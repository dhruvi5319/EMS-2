import * as React from 'react';
import { GripVertical, Target, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  addObjective,
  updateObjective,
  deleteObjective,
  type Objective,
} from '@/lib/planning.api';

interface ObjectiveListProps {
  engagementId: string;
  objectives: Objective[];
  canEdit: boolean;
  onObjectivesChange: () => void;
}

interface AddFormState {
  objective_text: string;
  information_need: string;
  loading: boolean;
  error: string | null;
}

interface EditFormState {
  objective_text: string;
  information_need: string;
  loading: boolean;
  error: string | null;
}

interface DeleteConfirmState {
  loading: boolean;
  error: string | null;
}

export function ObjectiveList({
  engagementId,
  objectives,
  canEdit,
  onObjectivesChange,
}: ObjectiveListProps) {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [addForm, setAddForm] = React.useState<AddFormState>({
    objective_text: '',
    information_need: '',
    loading: false,
    error: null,
  });

  // Per-objective state for editing and deletion
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForms, setEditForms] = React.useState<Record<string, EditFormState>>({});
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [deleteStates, setDeleteStates] = React.useState<Record<string, DeleteConfirmState>>({});

  function startEdit(obj: Objective) {
    setEditingId(obj.id);
    setEditForms((prev) => ({
      ...prev,
      [obj.id]: {
        objective_text: obj.objective_text,
        information_need: obj.information_need ?? '',
        loading: false,
        error: null,
      },
    }));
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSaveEdit(obj: Objective) {
    const form = editForms[obj.id];
    if (!form) return;
    if (!form.objective_text.trim()) {
      setEditForms((prev) => ({
        ...prev,
        [obj.id]: { ...form, error: 'Objective text is required.' },
      }));
      return;
    }
    setEditForms((prev) => ({
      ...prev,
      [obj.id]: { ...form, loading: true, error: null },
    }));
    try {
      await updateObjective(engagementId, obj.id, {
        objective_text: form.objective_text.trim(),
        information_need: form.information_need.trim() || undefined,
      });
      toast({ description: 'Objective saved.' });
      setEditingId(null);
      onObjectivesChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save objective.';
      setEditForms((prev) => ({
        ...prev,
        [obj.id]: { ...form, loading: false, error: msg },
      }));
    }
  }

  async function handleDeleteConfirm(obj: Objective) {
    setDeleteStates((prev) => ({
      ...prev,
      [obj.id]: { loading: true, error: null },
    }));
    try {
      await deleteObjective(engagementId, obj.id);
      toast({ description: 'Objective deleted.' });
      setDeletingId(null);
      onObjectivesChange();
    } catch (err) {
      const error = err as { status?: number; message?: string };
      const msg =
        error.status === 409
          ? 'Cannot delete this objective — it has linked evidence items. Unlink evidence first.'
          : err instanceof Error
          ? err.message
          : 'Failed to delete objective.';
      setDeleteStates((prev) => ({
        ...prev,
        [obj.id]: { loading: false, error: msg },
      }));
    }
  }

  async function handleAddSave() {
    if (!addForm.objective_text.trim()) {
      setAddForm((prev) => ({
        ...prev,
        error: 'Objective text is required.',
      }));
      return;
    }
    setAddForm((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await addObjective(engagementId, {
        objective_text: addForm.objective_text.trim(),
        information_need: addForm.information_need.trim() || undefined,
      });
      toast({ description: 'Objective saved.' });
      setShowAddForm(false);
      setAddForm({ objective_text: '', information_need: '', loading: false, error: null });
      onObjectivesChange();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save objective.';
      setAddForm((prev) => ({ ...prev, loading: false, error: msg }));
    }
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">OBJECTIVES</p>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddForm(true);
            }}
            disabled={showAddForm}
          >
            + Add Objective
          </Button>
        )}
      </div>

      {/* Empty state */}
      {objectives.length === 0 && !showAddForm && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Target className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm text-muted-foreground">No objectives added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add at least one objective before submitting for P2 review.
          </p>
        </div>
      )}

      {/* Objectives accordion */}
      {objectives.length > 0 && (
        <Accordion type="multiple" className="border border-slate-200 rounded-md">
          {objectives.map((obj, idx) => (
            <AccordionItem key={obj.id} value={obj.id} className="border-b last:border-b-0">
              <div className="flex items-center px-3">
                <GripVertical className="h-4 w-4 text-slate-300 mr-2 shrink-0" aria-hidden="true" />
                <AccordionTrigger className="flex-1 hover:no-underline py-3 text-sm text-left">
                  <span className="line-clamp-2 text-sm font-normal">
                    {idx + 1}. {obj.objective_text}
                  </span>
                </AccordionTrigger>
                {canEdit && editingId !== obj.id && deletingId !== obj.id && (
                  <div className="flex gap-1 ml-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(obj);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs px-2 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(obj.id);
                        setDeleteStates((prev) => ({
                          ...prev,
                          [obj.id]: { loading: false, error: null },
                        }));
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                )}
              </div>

              <AccordionContent className="px-3 pb-3">
                {/* Delete confirmation */}
                {deletingId === obj.id && (
                  <div className="mb-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-medium mb-2">Delete this objective?</p>
                    {deleteStates[obj.id]?.error && (
                      <p className="text-xs text-red-600 mb-2">
                        {deleteStates[obj.id].error}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(null)}
                        disabled={deleteStates[obj.id]?.loading}
                      >
                        Keep Objective
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteConfirm(obj)}
                        disabled={deleteStates[obj.id]?.loading}
                      >
                        {deleteStates[obj.id]?.loading ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Objective'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Edit form */}
                {editingId === obj.id && editForms[obj.id] && (
                  <div className="space-y-3 mb-3">
                    <div>
                      <Label className="text-xs mb-1">
                        Objective Text <span className="text-red-600">*</span>
                      </Label>
                      <Textarea
                        value={editForms[obj.id].objective_text}
                        onChange={(e) =>
                          setEditForms((prev) => ({
                            ...prev,
                            [obj.id]: {
                              ...prev[obj.id],
                              objective_text: e.target.value,
                            },
                          }))
                        }
                        className="min-h-[80px] text-sm border-slate-200"
                        disabled={editForms[obj.id].loading}
                      />
                    </div>
                    <div>
                      <Label className="text-xs mb-1">Information Need (optional)</Label>
                      <Input
                        value={editForms[obj.id].information_need}
                        onChange={(e) =>
                          setEditForms((prev) => ({
                            ...prev,
                            [obj.id]: {
                              ...prev[obj.id],
                              information_need: e.target.value,
                            },
                          }))
                        }
                        className="text-sm border-slate-200"
                        disabled={editForms[obj.id].loading}
                      />
                    </div>
                    {editForms[obj.id].error && (
                      <p className="text-xs text-red-600">{editForms[obj.id].error}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={editForms[obj.id].loading}
                      >
                        Discard Changes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(obj)}
                        disabled={editForms[obj.id].loading}
                      >
                        {editForms[obj.id].loading ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Objective'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Read-only expanded content */}
                {editingId !== obj.id && deletingId !== obj.id && (
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Objective Text</p>
                      <p className="text-sm mt-0.5">{obj.objective_text}</p>
                    </div>
                    {obj.information_need && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Information Need</p>
                        <p className="text-sm mt-0.5">{obj.information_need}</p>
                      </div>
                    )}
                    {!obj.information_need && (
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Information Need</p>
                        <p className="text-sm mt-0.5 text-muted-foreground italic">[not set]</p>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Add objective form */}
      {showAddForm && (
        <div className="mt-3 border border-slate-200 rounded-md p-4 space-y-3 bg-slate-50">
          <div>
            <Label className="text-xs mb-1">
              Objective Text <span className="text-red-600">*</span>
            </Label>
            <Textarea
              placeholder="Full text of the objective or research question..."
              value={addForm.objective_text}
              onChange={(e) =>
                setAddForm((prev) => ({ ...prev, objective_text: e.target.value }))
              }
              className="min-h-[80px] text-sm border-slate-200"
              disabled={addForm.loading}
            />
          </div>
          <div>
            <Label className="text-xs mb-1">Information Need (optional)</Label>
            <Input
              placeholder="What information is needed to answer this objective?"
              value={addForm.information_need}
              onChange={(e) =>
                setAddForm((prev) => ({ ...prev, information_need: e.target.value }))
              }
              className="text-sm border-slate-200"
              disabled={addForm.loading}
            />
          </div>
          {addForm.error && <p className="text-xs text-red-600">{addForm.error}</p>}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddForm(false);
                setAddForm({
                  objective_text: '',
                  information_need: '',
                  loading: false,
                  error: null,
                });
              }}
              disabled={addForm.loading}
            >
              Discard Objective
            </Button>
            <Button size="sm" onClick={handleAddSave} disabled={addForm.loading}>
              {addForm.loading ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Objective'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
