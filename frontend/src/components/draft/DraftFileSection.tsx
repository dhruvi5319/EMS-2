import { useState, useRef } from 'react';
import { Download, Paperclip, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.xlsx', '.xls', '.txt', '.zip'];
const MAX_SIZE_MB = 50;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DraftFileSectionProps {
  filename: string | null;
  fileSize: number | null;
  fileRef: string | null;
  engagementId: string;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  canEdit: boolean;
}

export function DraftFileSection({
  filename,
  fileSize,
  fileRef,
  engagementId,
  onUpload,
  onRemove: _onRemove,
  canEdit,
}: DraftFileSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
    if (!typeOk) {
      return 'File type not permitted. Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP.';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File exceeds maximum size of ${MAX_SIZE_MB} MB.`;
    }
    return null;
  }

  async function handleFile(file: File) {
    const err = validateFile(file);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError(null);
    setUploading(true);
    setProgress(10);
    try {
      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 200);
      await onUpload(file);
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 400);
    } catch (e) {
      setFileError(e instanceof Error ? e.message : 'Upload failed.');
      setUploading(false);
      setProgress(0);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  const downloadUrl = fileRef
    ? `/api/engagements/${engagementId}/draft/file`
    : null;

  return (
    <div className="space-y-3">
      {/* Existing file */}
      {filename && !uploading && (
        <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
          <Paperclip size={16} className="text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{filename}</p>
            {fileSize && (
              <p className="text-xs text-muted-foreground">{formatSize(fileSize)}</p>
            )}
          </div>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Download size={14} />
              Download
            </a>
          )}
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Uploading...</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}

      {/* Upload zone */}
      {canEdit && !uploading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-600 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Paperclip size={20} className="text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Drag & drop or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:underline font-medium"
              >
                Choose File
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Allowed: PDF, DOCX, DOC, XLSX, XLS, TXT, ZIP · Max {MAX_SIZE_MB} MB
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={handleInputChange}
            aria-label="Upload draft product file"
          />
        </div>
      )}

      {/* Error message */}
      {fileError && (
        <p className="text-sm text-destructive">{fileError}</p>
      )}
    </div>
  );
}
