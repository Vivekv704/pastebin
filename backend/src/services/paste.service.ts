import { Request } from 'express';
import { PasteRepository } from '../repositories/paste.repository';
import { TimeService } from './time.service';
import { getEnvironmentConfig } from '../config/environment';

export interface CreatePasteInput {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface CreatePasteOutput {
  id: string;
  url: string;
}

export interface GetPasteOutput {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export class PasteService {
  private pasteRepository: PasteRepository;
  private timeService: TimeService;

  constructor() {
    this.pasteRepository = new PasteRepository();
    this.timeService = new TimeService();
  }

  async createPaste(input: CreatePasteInput): Promise<CreatePasteOutput> {
    const now = this.timeService.getCurrentTime();
    const expiresAt = input.ttl_seconds ? new Date(now.getTime() + input.ttl_seconds * 1000) : null;

    const paste = await this.pasteRepository.create({
      content: input.content,
      expiresAt,
      maxViews: input.max_views || null,
    });

    const config = getEnvironmentConfig();
    const url = `${config.frontendBaseUrl}/p/${paste.id}`;

    return {
      id: paste.id,
      url,
    };
  }

  async getPaste(id: string, req: Request): Promise<GetPasteOutput | null> {
    const now = this.timeService.getCurrentTime(req);
    
    const paste = await this.pasteRepository.findById(id);
    
    if (!paste) {
      return null;
    }

    // Check if paste has expired
    if (paste.expiresAt && paste.expiresAt <= now) {
      return null;
    }

    // Check if paste has reached view limit
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return null;
    }

    // Increment view count atomically
    const updatedPaste = await this.pasteRepository.incrementViewCount(id);
    
    if (!updatedPaste) {
      return null;
    }

    const remainingViews = updatedPaste.maxViews 
      ? Math.max(0, updatedPaste.maxViews - updatedPaste.viewCount)
      : null;

    return {
      content: updatedPaste.content,
      remaining_views: remainingViews,
      expires_at: updatedPaste.expiresAt?.toISOString() || null,
    };
  }
}