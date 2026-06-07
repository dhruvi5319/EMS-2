import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Image, File, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EvidenceFileItem {
  id: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
}

interface EvidenceFileListProps {
  engagementId: string;
  evidenceId: string;
  files: EvidenceFileItem[];
  canUpload?: boolean;
  onFileUploaded?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string): React.ReactElement {
  if (
    mimeType === 'application/pdf' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return <FileText size={16} className="text-muted-foreground shrink-0" />;
  }
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mimeType === 'application/vnd.ms-excel' ||
    mimeType === 'text/csv'
  ) {
    return <FileSpreadsheet size={16} className="text-muted-foreground shrink-0" />;
  }
  if (mimeType === 'image/png' || mimeType === 'image/jpeg') {
    return <Image size={16} className="text-muted-foreground shrink-0" />;
  }
  return <File size={16} className="text-muted-foreground shrink-0" />;
}

export const EvidenceFileList: React.FC<EvidenceFileListProps> = ({
  engagementId,
  evidenceId,
  files,
  canUpload = false,
  onFileUploaded,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (file: EvidenceFileItem) => {
    setDownloadingId(file.id);
    try {
      const response = await fetch(
        `/api/engagements/${engagementId}/evidence/${evidenceId}/files/${file.id}/download`,
        { credentials: 'include' }
      );
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = '.pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.png,.jpg,.jpeg,.zip';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(
          `/api/engagements/${engagementId}/evidence/${evidenceId}/files`,
          { method: 'POST', credentials: 'include', body: formData }
        );
        if (response.ok) {
          onFileUploaded?.();
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    };
    input.click();
  };

  if (files.length === 0 && !canUpload) {
    return (
      <p className="text-[12px] font-normal" style={{ color: 'hsl(215 16% 47%)' }}>
        No files attached yet.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {files.length === 0 ? (
        <p className="text-[12px] font-normal" style={{ color: 'hsl(215 16% 47%)' }}>
          No files attached yet.
        </p>
      ) : (
        files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between h-12 px-2 rounded hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              {getFileIcon(file.mime_type)}
              <span className="text-[14px] font-normal truncate">{file.original_filename}</span>
              <span className="text-[12px] font-normal shrink-0" style={{ color: 'hsl(215 16% 47%)' }}>
                ({formatFileSize(file.file_size)})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[12px] shrink-0 ml-2"
              aria-label={`Download ${file.original_filename}`}
              onClick={() => handleDownload(file)}
              disabled={downloadingId === file.id}
            >
              {downloadingId === file.id ? (
                <>
                  <Loader2 size={12} className="animate-spin mr-1" />
                  Downloading...
                </>
              ) : (
                '↓ Download'
              )}
            </Button>
          </div>
        ))
      )}
      {canUpload && files.length < 20 && (
        <button
          type="button"
          onClick={handleUpload}
          className="flex items-center gap-1 text-[12px] font-normal mt-2"
          style={{ color: 'hsl(221 83% 53%)' }}
        >
          <Upload size={12} />
          + Upload additional file
        </button>
      )}
    </div>
  );
};
