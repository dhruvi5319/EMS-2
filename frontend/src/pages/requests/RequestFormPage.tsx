import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRequest, createRequest, updateRequest, submitRequest } from '@/hooks/useRequests';

// Zod schema for submit validation (zod v4: use .message not required_error)
const submitSchema = z.object({
  request_type: z.string().min(1, 'Request type is required.'),
  requester_name: z.string().min(1, 'Requester is required.'),
  topic: z.string().min(1, 'Topic is required.').max(500, 'Topic must be 500 characters or fewer.'),
  agency_program: z.string().min(1, 'Agency / Program is required.'),
  due_date: z.date().optional(),
  requester_org: z.string().optional(),
  notes: z.string().max(5000, 'Notes must be 5000 characters or fewer.').optional(),
});

type FormValues = z.infer<typeof submitSchema>;

type RequestTypeValue = 'congressional' | 'mandate' | 'internal';

export function RequestFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { request, loading: loadingRequest } = useRequest(id);

  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(submitSchema),
    mode: 'onBlur',
  });

  // Pre-populate form in edit mode
  useEffect(() => {
    if (request) {
      reset({
        request_type: request.request_type ?? undefined,
        requester_name: request.requester_name ?? '',
        requester_org: request.requester_org ?? '',
        topic: request.topic ?? '',
        agency_program: request.agency_program ?? '',
        due_date: request.due_date ? new Date(request.due_date) : undefined,
        notes: request.notes ?? '',
      });
    }
  }, [request, reset]);

  const watchedValues = watch();
  const requestTypeValue = watch('request_type');
  const topicValue = watch('topic') ?? '';
  const notesValue = watch('notes') ?? '';
  const dueDateValue = watch('due_date');

  const isPastDue = dueDateValue && dueDateValue < new Date(new Date().setHours(0, 0, 0, 0));
  const canSaveDraft = !!requestTypeValue;
  const canSubmit = !!(requestTypeValue && watchedValues.requester_name && watchedValues.topic && watchedValues.agency_program && watchedValues.due_date);

  async function handleSaveAsDraft() {
    setSaving(true);
    try {
      const data = {
        request_type: watchedValues.request_type as RequestTypeValue,
        requester_name: watchedValues.requester_name,
        requester_org: watchedValues.requester_org,
        topic: watchedValues.topic,
        agency_program: watchedValues.agency_program,
        due_date: watchedValues.due_date ? format(watchedValues.due_date, 'yyyy-MM-dd') : undefined,
        notes: watchedValues.notes,
      };
      let saved;
      if (isEdit && id) {
        saved = await updateRequest(id, data);
      } else {
        saved = await createRequest(data);
      }
      setToast(`Request saved as draft.`);
      setTimeout(() => setToast(null), 4000);
      navigate(`/requests/${saved.id}`);
    } catch (err) {
      setToast((err as Error).message ?? 'Failed to save draft.');
    } finally {
      setSaving(false);
    }
  }

  const onSubmit = async (values: FormValues) => {
    if (!values.due_date) {
      setToast('Due date is required to submit.');
      return;
    }
    setSubmitting(true);
    try {
      let requestId = id;
      const data = {
        request_type: values.request_type as RequestTypeValue,
        requester_name: values.requester_name,
        requester_org: values.requester_org,
        topic: values.topic,
        agency_program: values.agency_program,
        due_date: format(values.due_date, 'yyyy-MM-dd'),
        notes: values.notes,
      };
      if (!requestId) {
        const created = await createRequest(data);
        requestId = created.id;
      } else {
        await updateRequest(requestId, data);
      }
      await submitRequest(requestId);
      setToast('Request submitted successfully.');
      setTimeout(() => setToast(null), 4000);
      navigate(`/requests/${requestId}`);
    } catch (err: unknown) {
      const e = err as Error & { fields?: string[] };
      setToast(e.message ?? 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loadingRequest) {
    return <div className="px-6 py-6 text-sm text-muted-foreground">Loading...</div>;
  }

  const breadcrumb = isEdit
    ? `Requests > ${request?.request_id_display ?? 'Loading...'} > Edit`
    : 'Requests > New Request';

  return (
    <div className="px-6 py-6 max-w-[720px] mx-auto">
      {/* Breadcrumb + header */}
      <p className="text-xs text-muted-foreground mb-1">{breadcrumb}</p>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{isEdit ? `Edit Request` : 'New Request'}</h1>
      </div>

      {/* Toast notification */}
      {toast && (
        <Alert className="mb-4 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{toast}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* REQUEST DETAILS section */}
        <div className="mb-1 flex items-center gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Request Details</p>
          <Separator className="flex-1" />
        </div>
        <div className="space-y-4 mt-4 mb-6">

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Request Type <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="request_type"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger className={cn(errors.request_type && 'border-red-500')} aria-required="true" aria-invalid={!!errors.request_type}>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="congressional">Congressional Request</SelectItem>
                    <SelectItem value="mandate">Mandate</SelectItem>
                    <SelectItem value="internal">Internal Proposal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.request_type && (
              <p className="text-xs text-red-600 mt-1">{errors.request_type.message}</p>
            )}
          </div>

          {/* Requester + Agency/Program — two-column on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Requester <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('requester_name')}
                placeholder="Name or organization"
                aria-required="true"
                aria-invalid={!!errors.requester_name}
                className={cn(errors.requester_name && 'border-red-500')}
                maxLength={255}
              />
              {errors.requester_name && (
                <p className="text-xs text-red-600 mt-1">{errors.requester_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Agency / Program <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('agency_program')}
                placeholder="Agency or program name"
                aria-required="true"
                aria-invalid={!!errors.agency_program}
                className={cn(errors.agency_program && 'border-red-500')}
                maxLength={255}
              />
              {errors.agency_program && (
                <p className="text-xs text-red-600 mt-1">{errors.agency_program.message}</p>
              )}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Topic <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('topic')}
              placeholder="Brief description of the engagement topic"
              aria-required="true"
              aria-invalid={!!errors.topic}
              className={cn('resize-none', errors.topic && 'border-red-500')}
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {errors.topic ? (
                <p className="text-xs text-red-600">{errors.topic.message}</p>
              ) : <span />}
              <p className={cn('text-xs text-right', topicValue.length > 490 ? 'text-red-600' : 'text-muted-foreground')}>
                {topicValue.length} / 500
              </p>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="due_date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.value && 'text-muted-foreground',
                        errors.due_date && 'border-red-500'
                      )}
                      aria-required="true"
                      aria-invalid={!!errors.due_date}
                    >
                      <CalendarIcon size={16} className="mr-2" aria-hidden="true" />
                      {field.value ? format(field.value, 'MM/dd/yyyy') : 'MM/DD/YYYY'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.due_date && (
              <p className="text-xs text-red-600 mt-1">{errors.due_date.message}</p>
            )}
            {/* Past due date warning — non-blocking (from UI-SPEC) */}
            {isPastDue && !errors.due_date && (
              <div
                className="mt-2 flex items-start gap-2 rounded px-3 py-2 text-sm text-yellow-800 bg-yellow-100"
                role="alert"
              >
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" aria-hidden="true" />
                <span>Due date is in the past. Permitted for retrospective mandates.</span>
              </div>
            )}
          </div>

          {/* Notes (optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Textarea
              {...register('notes')}
              placeholder="Optional — additional context or background"
              className="resize-none"
              rows={4}
              maxLength={5000}
            />
            <div className="flex justify-end mt-1">
              <p className={cn('text-xs', notesValue.length > 4900 ? 'text-red-600' : 'text-muted-foreground')}>
                {notesValue.length} / 5000
              </p>
            </div>
          </div>
        </div>

        {/* INTAKE DOCUMENT section header (file upload handled in plan 03-04) */}
        <div className="mb-1 flex items-center gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Intake Document</p>
          <Separator className="flex-1" />
        </div>
        <div className="mt-4 mb-6 p-4 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
          File upload component (Plan 03-04)
        </div>

        {/* Sticky form actions */}
        <div className="sticky bottom-0 bg-white border-t border-border py-4 flex items-center justify-between" style={{ height: 64 }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={!canSaveDraft || saving}
          >
            {saving ? <><Loader2 size={14} className="mr-2 animate-spin" />Saving...</> : (isEdit ? 'Save Changes' : 'Save as Draft')}
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit || submitting}
          >
            {submitting ? <><Loader2 size={14} className="mr-2 animate-spin" />Submitting...</> : 'Submit Request →'}
          </Button>
        </div>
      </form>
    </div>
  );
}
