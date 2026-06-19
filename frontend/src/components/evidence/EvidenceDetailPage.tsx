import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useEvidenceCoverage } from '@/hooks/useEvidence';
import { ForbiddenPage } from '@/pages/ForbiddenPage';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { SensitivityBadge } from './SensitivityBadge';
import { EvidenceTypeBadge } from './EvidenceTypeBadge';
import { EvidenceMetadataBlock } from './EvidenceMetadataBlock';
import { EvidenceFileList } from './EvidenceFileList';
import { LinkedObjectivesList } from './LinkedObjectivesList';
import { DeleteEvidenceButton } from './DeleteEvidenceButton';
import { AddEvidencePanel } from './AddEvidencePanel';
import { format } from 'date-fns';
import type { EvidenceItem } from '@/hooks/useEvidence';
import type { EvidenceFileItem } from './EvidenceFileList';
import type { LinkedObjective } from './LinkedObjectivesList';

interface EvidenceDetailData extends EvidenceItem {
  evidence_ref?: string;
  created_by_name?: string;
}

interface LinkedFinding {
  id: string;
  finding_ref: string;
  finding_text: string;
}

export const EvidenceDetailPage: React.FC = () => {
  const { engagementId, evidenceId } = useParams<{
    engagementId: string;
    evidenceId: string;
  }>();

  const [evidence, setEvidence] = useState<EvidenceDetailData | null>(null);
  const [files, setFiles] = useState<EvidenceFileItem[]>([]);
  const [linkedObjectives, setLinkedObjectives] = useState<LinkedObjective[]>([]);
  const [linkedObjectiveIds, setLinkedObjectiveIds] = useState<string[]>([]);
  const [linkedFindings, setLinkedFindings] = useState<LinkedFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [editPanelOpen, setEditPanelOpen] = useState(false);

  const { coverage } = useEvidenceCoverage(engagementId ?? '');

  const fetchEvidence = useCallback(async () => {
    if (!engagementId || !evidenceId) return;
    setLoading(true);
    try {
      const result = await api.get<{ evidence: EvidenceDetailData }>(
        `/api/engagements/${engagementId}/evidence/${evidenceId}`
      );
      if (!result.ok) {
        if ((result as { ok: false; status: number }).status === 403) {
          setForbidden(true);
          return;
        }
        return;
      }
      setEvidence(result.data.evidence);

      // Fetch files
      const filesResult = await api.get<{ files: EvidenceFileItem[] }>(
        `/api/engagements/${engagementId}/evidence/${evidenceId}/files`
      );
      if (filesResult.ok) {
        setFiles(filesResult.data.files ?? []);
      }

      // Fetch linked objectives for this evidence item
      const objResult = await api.get<{ objectives: LinkedObjective[] }>(
        `/api/engagements/${engagementId}/evidence/${evidenceId}/objectives`
      );
      if (objResult.ok) {
        const objs = objResult.data.objectives ?? [];
        setLinkedObjectives(objs);
        setLinkedObjectiveIds(objs.map((o) => o.id));
      }

      // Fetch linked findings
      const findingsResult = await api.get<{ findings: LinkedFinding[] }>(
        `/api/engagements/${engagementId}/findings?evidence_id=${evidenceId}`
      );
      if (findingsResult.ok) {
        setLinkedFindings(findingsResult.data.findings ?? []);
      }
    } catch (err) {
      console.error('Error fetching evidence detail:', err);
    } finally {
      setLoading(false);
    }
  }, [engagementId, evidenceId]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleObjectiveLinked = (_objectiveId: string) => {
    // Re-fetch full evidence data to get accurate linked objectives list
    fetchEvidence();
  };

  if (forbidden) {
    return <ForbiddenPage />;
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="p-6 text-muted-foreground text-sm">Evidence item not found.</div>
    );
  }

  const evidenceRef = evidence.evidence_ref ?? `E-${evidence.id.slice(0, 8)}`;
  const formattedDate = (() => {
    try {
      return format(new Date(evidence.date_received), 'MMMM d, yyyy');
    } catch {
      return evidence.date_received;
    }
  })();

  const allObjectives = coverage?.objectives ?? [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-1">
        <Link to="/engagements" className="hover:underline" style={{ color: 'hsl(221 83% 53%)' }}>
          Engagements
        </Link>
        <span>/</span>
        <Link
          to={`/engagements/${engagementId}`}
          className="hover:underline"
          style={{ color: 'hsl(221 83% 53%)' }}
        >
          ENG-...
        </Link>
        <span>/</span>
        <Link
          to={`/engagements/${engagementId}`}
          className="hover:underline"
          style={{ color: 'hsl(221 83% 53%)' }}
        >
          Evidence
        </Link>
        <span>/</span>
        <span>{evidenceRef}</span>
      </nav>

      {/* Page header */}
      <div className="flex items-center gap-3">
        <SensitivityBadge sensitivity={evidence.sensitivity} />
        <span className="text-[14px] font-normal text-muted-foreground">
          <EvidenceTypeBadge type={evidence.evidence_type} />
        </span>
        <span className="text-[14px] font-normal text-muted-foreground">·</span>
        <span className="text-[14px] font-normal text-muted-foreground">{formattedDate}</span>
      </div>

      {/* Metadata block */}
      <section>
        <EvidenceMetadataBlock
          source={evidence.source}
          custodian={evidence.custodian}
          date_received={evidence.date_received}
          created_by_name={evidence.created_by_name ?? evidence.created_by}
          created_at={evidence.created_at}
          description={evidence.description}
        />
      </section>

      <Separator />

      {/* Linked Objectives */}
      <section>
        <h3 className="text-[12px] font-normal uppercase tracking-wide text-muted-foreground mb-2">
          LINKED OBJECTIVES
        </h3>
        <LinkedObjectivesList
          engagementId={engagementId ?? ''}
          evidenceId={evidenceId ?? ''}
          linkedObjectives={linkedObjectives}
          linkedObjectiveIds={linkedObjectiveIds}
          allObjectives={allObjectives}
          onLinked={handleObjectiveLinked}
        />
      </section>

      <Separator />

      {/* Attached Files */}
      <section>
        <h3 className="text-[12px] font-normal uppercase tracking-wide text-muted-foreground mb-2">
          ATTACHED FILES
        </h3>
        <EvidenceFileList
          engagementId={engagementId ?? ''}
          evidenceId={evidenceId ?? ''}
          files={files}
          canUpload
          onFileUploaded={fetchEvidence}
        />
      </section>

      <Separator />

      {/* Linked Findings */}
      <section>
        <h3 className="text-[12px] font-normal uppercase tracking-wide text-muted-foreground mb-2">
          LINKED FINDINGS
        </h3>
        {linkedFindings.length === 0 ? (
          <p className="text-[12px] font-normal" style={{ color: 'hsl(215 16% 47%)' }}>
            No findings linked to this evidence item.
          </p>
        ) : (
          <ul className="space-y-2">
            {linkedFindings.map((finding) => (
              <li key={finding.id} className="flex items-center gap-2">
                <span className="font-mono text-[14px] font-normal shrink-0">
                  {finding.finding_ref}
                </span>
                <span className="text-[14px] font-normal truncate">
                  {finding.finding_text.length > 80
                    ? finding.finding_text.slice(0, 80) + '…'
                    : finding.finding_text}
                </span>
                <Link
                  to={`/engagements/${engagementId}/findings/${finding.id}`}
                  className="text-[14px] font-normal shrink-0"
                  style={{ color: 'hsl(221 83% 53%)' }}
                >
                  View Finding →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      {/* Action buttons */}
      <section className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" onClick={() => setEditPanelOpen(true)}>
          Edit Evidence
        </Button>
        <DeleteEvidenceButton
          engagementId={engagementId ?? ''}
          evidenceId={evidenceId ?? ''}
          evidenceRef={evidenceRef}
          objectiveCount={evidence.objective_count ?? 0}
          findingCount={0}
        />
        <Link
          to={`/engagements/${engagementId}/audit`}
          className="text-[14px] font-normal"
          style={{ color: 'hsl(221 83% 53%)' }}
        >
          View Audit Trail →
        </Link>
      </section>

      {/* Edit panel */}
      <AddEvidencePanel
        open={editPanelOpen}
        onOpenChange={setEditPanelOpen}
        engagementId={engagementId ?? ''}
        onSuccess={() => {
          setEditPanelOpen(false);
          fetchEvidence();
        }}
      />
    </div>
  );
};
