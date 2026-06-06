import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authenticateSession } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  listEvidence,
  createEvidence,
  updateEvidence,
  deleteEvidence,
  uploadFile,
  deleteFile,
  getEvidenceFile,
} from '../services/evidence.service';
import { storageProvider } from '../storage/local.storage';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// mergeParams: true so :id (engagementId) from the parent router is accessible
export const evidenceRouter = Router({ mergeParams: true });

evidenceRouter.use(authenticateSession);

// ─── Helper: error handler ────────────────────────────────────────────────────

function handleError(
  err: unknown,
  res: Response,
  context: string
): void {
  const error = err as { status?: number; message?: string };
  if (error.status && error.status < 500) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  console.error(`${context}:`, err);
  res.status(500).json({ error: 'Internal server error' });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// IMPORTANT: /export must be registered BEFORE /:evidence_id to avoid route param capture

// GET /api/engagements/:id/evidence/export
// Roles: AL, EM, AN, QA, PC, RO, AD (IR excluded per US-9.4)
evidenceRouter.get(
  '/export',
  requireRole('AL', 'EM', 'AN', 'QA', 'PC', 'RO', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const engagementId = req.params.id;
      // Explicitly deny pure IR users (may have passed requireRole if IR has another granted role)
      const userRoles = req.user!.roles;
      const hasNonIRRole = userRoles.some((r: string) =>
        ['AL', 'EM', 'AN', 'QA', 'PC', 'RO', 'AD'].includes(r)
      );
      if (!hasNonIRRole) {
        res.status(403).json({ error: 'Access denied.' });
        return;
      }

      const result = await listEvidence(engagementId, { limit: 1000 }, userRoles);
      const rows = result.evidence;

      const headers = [
        'ID',
        'Type',
        'Source',
        'Date Received',
        'Custodian',
        'Description',
        'Sensitivity',
        'Objectives Linked',
        'Files',
      ];
      const csvLines = [
        headers.join(','),
        ...rows.map((e) =>
          [
            e.id,
            e.evidence_type,
            `"${(e.source || '').replace(/"/g, '""')}"`,
            e.date_received,
            `"${(e.custodian || '').replace(/"/g, '""')}"`,
            `"${(e.description || '').replace(/"/g, '""')}"`,
            e.sensitivity,
            e.objective_count ?? 0,
            e.file_count ?? 0,
          ].join(',')
        ),
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="evidence-registry.csv"');
      res.send(csvLines.join('\n'));
    } catch (err) {
      handleError(err, res, 'GET /evidence/export');
    }
  }
);

// GET /api/engagements/:id/evidence — all authenticated roles
evidenceRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { type, sensitivity, limit, offset } = req.query as Record<string, string>;
    const result = await listEvidence(
      req.params.id,
      {
        type: type as import('../services/evidence.service').EvidenceType | undefined,
        sensitivity:
          sensitivity as import('../services/evidence.service').Sensitivity | undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        offset: offset ? parseInt(offset, 10) : undefined,
      },
      req.user!.roles
    );
    res.json(result);
  } catch (err) {
    handleError(err, res, 'GET /evidence');
  }
});

// POST /api/engagements/:id/evidence — AN, AD only
evidenceRouter.post(
  '/',
  requireRole('AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { evidence_type, source, date_received, custodian, description, sensitivity } =
        req.body;
      const evidence = await createEvidence(
        req.params.id,
        { evidence_type, source, date_received, custodian, description, sensitivity },
        req.user!.id
      );
      res.status(201).json({ evidence });
    } catch (err) {
      handleError(err, res, 'POST /evidence');
    }
  }
);

// PATCH /api/engagements/:id/evidence/:evidence_id — AN, AD only
evidenceRouter.patch(
  '/:evidence_id',
  requireRole('AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const { evidence_type, source, date_received, custodian, description, sensitivity } =
        req.body;
      const evidence = await updateEvidence(
        req.params.id,
        req.params.evidence_id,
        { evidence_type, source, date_received, custodian, description, sensitivity },
        req.user!.id
      );
      res.json({ evidence });
    } catch (err) {
      handleError(err, res, 'PATCH /evidence/:evidence_id');
    }
  }
);

// DELETE /api/engagements/:id/evidence/:evidence_id — AN, AD only
evidenceRouter.delete(
  '/:evidence_id',
  requireRole('AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteEvidence(req.params.id, req.params.evidence_id);
      res.json(result);
    } catch (err) {
      handleError(err, res, 'DELETE /evidence/:evidence_id');
    }
  }
);

// POST /api/engagements/:id/evidence/:evidence_id/files — AN, AD only
// Content-Type: multipart/form-data; field: file
evidenceRouter.post(
  '/:evidence_id/files',
  requireRole('AN', 'AD'),
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(422).json({ error: 'No file provided.' });
        return;
      }
      const file = await uploadFile(
        req.params.id,
        req.params.evidence_id,
        {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer,
        },
        req.user!.id
      );
      res.json({ file });
    } catch (err) {
      handleError(err, res, 'POST /evidence/:evidence_id/files');
    }
  }
);

// DELETE /api/engagements/:id/evidence/:evidence_id/files/:file_id — AN, AD only
evidenceRouter.delete(
  '/:evidence_id/files/:file_id',
  requireRole('AN', 'AD'),
  async (req: Request, res: Response) => {
    try {
      const result = await deleteFile(
        req.params.id,
        req.params.evidence_id,
        req.params.file_id,
        req.user!.roles
      );
      res.json(result);
    } catch (err) {
      handleError(err, res, 'DELETE /evidence/:evidence_id/files/:file_id');
    }
  }
);

// GET /api/engagements/:id/evidence/:evidence_id/files/:file_id/download — all authenticated roles
evidenceRouter.get(
  '/:evidence_id/files/:file_id/download',
  async (req: Request, res: Response) => {
    try {
      const fileInfo = await getEvidenceFile(
        req.params.evidence_id,
        req.params.file_id,
        req.user!.roles
      );
      // Use storageProvider.get() to retrieve buffer, then send as stream
      const buffer = await storageProvider.get(fileInfo.storage_key);
      res.setHeader('Content-Type', fileInfo.mime_type);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileInfo.original_filename}"`
      );
      res.send(buffer);
    } catch (err) {
      handleError(err, res, 'GET /evidence/:evidence_id/files/:file_id/download');
    }
  }
);
