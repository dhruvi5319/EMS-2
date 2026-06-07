import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  getDraft,
  createDraft,
  updateDraft,
  uploadDraftFile,
  deleteDraftFile,
  listDraftComments,
  addDraftComment,
} from '../services/draft.service';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// mergeParams: true so :id (engagementId) from the parent router is accessible
export const draftRouter = Router({ mergeParams: true });

draftRouter.use(authenticateSession);

// ─── Helper: error handler ────────────────────────────────────────────────────

function handleError(err: unknown, res: Response, context: string): void {
  const error = err as { status?: number; message?: string };
  if (error.status && error.status < 500) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  void context; // suppress unused-var lint
  res.status(500).json({ error: 'Internal server error' });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /api/engagements/:id/draft — all authenticated roles
draftRouter.get('/', async (req: Request, res: Response) => {
  try {
    const draft = await getDraft(req.params.id);
    if (!draft) {
      res.status(404).json({ error: 'No draft product found.' });
      return;
    }
    res.json({ draft });
  } catch (err) {
    handleError(err, res, 'GET /draft');
  }
});

// POST /api/engagements/:id/draft — EM, AN, AD
draftRouter.post(
  '/',
  requireRole('EM', 'AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { title, version, owner_id, status, draft_notes } = req.body;
      const draft = await createDraft(
        req.params.id,
        { title, version, owner_id, status, draft_notes },
        req.user!.id
      );
      res.status(201).json({ draft });
    } catch (err) {
      handleError(err, res, 'POST /draft');
    }
  }
);

// PATCH /api/engagements/:id/draft — EM, AN, AD, QA
draftRouter.patch(
  '/',
  requireRole('EM', 'AN', 'AD', 'QA'),
  async (req: Request, res: Response) => {
    try {
      const { title, version, owner_id, status, draft_notes } = req.body;

      // QA "Return to Drafting" enforcement:
      // under_review → drafting is allowed only for QA/AD roles
      if (status === 'drafting') {
        const userRoles: string[] = req.user!.roles;
        const canReturnToDrafting =
          userRoles.includes('QA') || userRoles.includes('AD');
        if (!canReturnToDrafting) {
          res.status(403).json({
            error: 'Only QA or Admin can return draft to Drafting status.',
          });
          return;
        }
      }

      const draft = await updateDraft(
        req.params.id,
        { title, version, owner_id, status, draft_notes },
        req.user!.id
      );
      res.json({ draft });
    } catch (err) {
      handleError(err, res, 'PATCH /draft');
    }
  }
);

// POST /api/engagements/:id/draft/file — EM, AN, AD
// Content-Type: multipart/form-data; field: file
draftRouter.post(
  '/file',
  requireRole('EM', 'AN', 'AD'),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file provided.' });
        return;
      }
      const result = await uploadDraftFile(
        req.params.id,
        {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer,
        },
        req.user!.id
      );
      res.json(result);
    } catch (err) {
      handleError(err, res, 'POST /draft/file');
    }
  }
);

// DELETE /api/engagements/:id/draft/file — EM, AN, AD
draftRouter.delete(
  '/file',
  requireRole('EM', 'AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteDraftFile(req.params.id);
      res.json(result);
    } catch (err) {
      handleError(err, res, 'DELETE /draft/file');
    }
  }
);

// GET /api/engagements/:id/draft/comments — all authenticated roles
draftRouter.get('/comments', async (req: Request, res: Response) => {
  try {
    const result = await listDraftComments(req.params.id);
    res.json(result);
  } catch (err) {
    handleError(err, res, 'GET /draft/comments');
  }
});

// POST /api/engagements/:id/draft/comments — EM, QA, AN, AD
// IR/PC/RO/AL are read-only per UI-SPEC
draftRouter.post(
  '/comments',
  requireRole('EM', 'QA', 'AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { comment_text } = req.body;
      const comment = await addDraftComment(
        req.params.id,
        { comment_text },
        req.user!.id
      );
      res.status(201).json({ comment });
    } catch (err) {
      handleError(err, res, 'POST /draft/comments');
    }
  }
);
