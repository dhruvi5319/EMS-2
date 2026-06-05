import { useState, useRef, useCallback } from 'react';
import { FileText, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ExistingFile {
  file_ref: string;
  filename: string;
  size: number;
}

interface IntakeFileUploadProps {
  requestId: string;
  existingFile?: ExistingFile | null;
  onUploadComplete?: (file: { file_ref: string; filename: string; size: number }) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

type UploadState = 'idle' | 'drag-over' | 'uploading' | 'success' | 'error';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'image/png',
  'image/jpeg',
]);
const MAX_BYTES = 25 * 1024 * 1024; // 25MB

export function IntakeFileUpload({
  requestId,
  existingFile,
  onUploadComplete,
  onRemove,
  disabled = false,
}: IntakeFileUploadProps) {
  const [state, setState] = useState<UploadState>(existingFile ? 'success' : 'idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<ExistingFile | null>(existingFile ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    // Client-side validation
    if (!ALLOWED_TYPES.has(file.type)) {
      setError('File type not permitted. Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, PNG, JPG.');
      setState('error');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File exceeds maximum size of 25 MB.');
      setState('error');
      return;
    }

    setState('uploading');
    setProgress(0);
    setError(null);

    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 85));
    }, 100);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/requests/${requestId}/intake-document`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? 'File could not be saved. Please try again.');
        setState('error');
        return;
      }

      setProgress(100);
      const result: { file_ref: string; filename: string; size: number } = await response.json();

      setTimeout(() => {
        setCurrentFile(result);
        setState('success');
        setProgress(0);
        onUploadComplete?.(result);
      }, 300);
    } catch {
      clearInterval(progressInterval);
      setError('File could not be saved. Please try again.');
      setState('error');
    }
  }, [requestId, onUploadComplete]);

  async function handleRemove() {
    try {
      await fetch(`/api/requests/${requestId}/intake-document`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setCurrentFile(null);
      setState('idle');
      setError(null);
      onRemove?.();
    } catch {
      setError('Failed to remove file.');
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setState('drag-over');
  }

  function handleDragLeave() {
    if (state === 'drag-over') setState('idle');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }

  const isDragOver = state === 'drag-over';
  const isUploading = state === 'uploading';
  const isSuccess = state === 'success';

  return (
    <div>
      {isSuccess && currentFile ? (
        // Success chip — replaces drop zone
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 border border-green-200"
          role="status"
          aria-live="polite"
        >
          <FileText size={16} className="text-green-700 shrink-0" aria-hidden="true" />
          <span className="text-sm text-green-800 flex-1 truncate">{currentFile.filename}</span>
          <CheckCircle size={14} className="text-green-600 shrink-0" aria-hidden="true" />
          <button
            type="button"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-foreground ml-1"
            aria-label={`Remove ${currentFile.filename}`}
            disabled={disabled}
          >
            <X size={14} />
          </button>
          {/* Re-upload: clicking triggers new upload */}
          <button
            type="button"
            className="text-xs text-blue-600 hover:underline ml-2"
            onClick={() => { setState('idle'); setCurrentFile(null); }}
            disabled={disabled}
          >
            Replace
          </button>
        </div>
      ) : (
        // Drop zone
        <div
          role="region"
          aria-label="Intake document upload area"
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-150',
            'cursor-pointer',
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-border bg-white hover:bg-secondary',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{ minHeight: 120 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            aria-hidden="true"
          />

          {isUploading ? (
            // Upload in progress
            <div className="w-full px-6 py-4" aria-live="polite">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Uploading...</span>
              </div>
              <Progress
                value={progress}
                className="h-1"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          ) : isDragOver ? (
            <div className="text-sm text-blue-600 font-medium py-6">Drop to upload</div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 px-4 text-center">
              <FileText size={32} className="text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Drag and drop intake document here</p>
              <p className="text-sm text-muted-foreground">
                or{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  aria-label="Browse files to upload"
                  disabled={disabled}
                >
                  Browse files
                </button>
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, DOC, XLSX, XLS, TXT, PNG, JPG · Max 25 MB</p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 mt-2" role="alert">{error}</p>
      )}
    </div>
  );
}
