import { prisma } from '../config/database';
import { Paste } from '@prisma/client';
import { generateSimpleId } from '../utils/id-generator';

export interface CreatePasteData {
  content: string;
  expiresAt: Date | null;
  maxViews: number | null;
}

export class PasteRepository {
  async create(data: CreatePasteData): Promise<Paste> {
    // Generate a unique ID
    let id: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      id = generateSimpleId();
      attempts++;
      
      // Check if ID already exists
      const existing = await prisma.paste.findUnique({
        where: { id },
      });
      
      if (!existing) {
        break;
      }
      
      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique ID after multiple attempts');
      }
    } while (true);

    return await prisma.paste.create({
      data: {
        id,
        content: data.content,
        expiresAt: data.expiresAt,
        maxViews: data.maxViews,
        viewCount: 0,
      },
    });
  }

  async findById(id: string): Promise<Paste | null> {
    return await prisma.paste.findUnique({
      where: { id },
    });
  }

  async incrementViewCount(id: string): Promise<Paste | null> {
    try {
      // Use atomic update to prevent race conditions
      return await prisma.paste.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      // If the paste doesn't exist or update fails, return null
      return null;
    }
  }
}