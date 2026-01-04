import { Request, Response, NextFunction } from 'express';
import { PasteService } from '../services/paste.service';
import { createApiError } from '../middleware/error.middleware';
import { isValidId } from '../utils/id-generator';

export interface CreatePasteRequest {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export class PasteController {
  private pasteService: PasteService;

  constructor() {
    this.pasteService = new PasteService();
  }

  async createPaste(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { content, ttl_seconds, max_views } = req.body as CreatePasteRequest;

      // Basic validation
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        throw createApiError('Content is required and must be a non-empty string', 400, 'INVALID_CONTENT');
      }

      if (ttl_seconds !== undefined && (typeof ttl_seconds !== 'number' || ttl_seconds < 1)) {
        throw createApiError('TTL must be a number >= 1', 400, 'INVALID_TTL');
      }

      if (max_views !== undefined && (typeof max_views !== 'number' || max_views < 1)) {
        throw createApiError('Max views must be a number >= 1', 400, 'INVALID_MAX_VIEWS');
      }

      // Set default values if not provided
      const defaultTtlSeconds = ttl_seconds !== undefined ? ttl_seconds : 3600; // 1 hour default
      const defaultMaxViews = max_views !== undefined ? max_views : 10; // 10 views default

      const result = await this.pasteService.createPaste({
        content: content.trim(),
        ttl_seconds: defaultTtlSeconds,
        max_views: defaultMaxViews,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPaste(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string' || !isValidId(id)) {
        throw createApiError('Invalid paste ID format', 400, 'INVALID_ID');
      }

      const result = await this.pasteService.getPaste(id, req);

      if (!result) {
        throw createApiError('Paste not found', 404, 'PASTE_NOT_FOUND');
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}