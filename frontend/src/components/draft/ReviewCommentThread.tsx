import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import type { DraftComment } from '@/hooks/useDraftProduct';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' ' + d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ReviewCommentThreadProps {
  engagementId: string;
  canAddComment: boolean;
  fetchComments: () => Promise<DraftComment[]>;
  addComment: (text: string) => Promise<DraftComment>;
}

export function ReviewCommentThread({
  canAddComment,
  fetchComments,
  addComment,
}: ReviewCommentThreadProps) {
  const { toast } = useToast();
  const [comments, setComments] = useState<DraftComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchComments()
      .then((c) => setComments(c))
      .catch(() => {/* non-blocking */})
      .finally(() => setLoading(false));
  }, [fetchComments]);

  async function handleSave() {
    if (!commentText.trim()) return;
    setSaving(true);
    try {
      const newComment = await addComment(commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      toast({ title: 'Comment saved.' });
    } catch (e) {
      toast({ title: 'Failed to save comment.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 size={14} className="animate-spin" />
        Loading comments...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comment list (DESC order) */}
      {comments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No review comments yet.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-slate-200 rounded-lg p-4 space-y-1"
              style={{ minHeight: 72 }}
            >
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{comment.author_name}</span>
                <span>·</span>
                <span>{formatDateTime(comment.created_at)}</span>
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      {canAddComment && (
        <div className="space-y-2">
          <p className="text-xs font-medium">Add Comment</p>
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a review comment..."
            className="min-h-[80px]"
            aria-label="Review comment text"
          />
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!commentText.trim() || saving}
            >
              {saving ? (
                <>
                  <Loader2 size={12} className="mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Comment'
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Comments are append-only and cannot be edited after save.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
