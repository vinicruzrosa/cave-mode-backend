import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SettingsRepository {
  static async findByUserId(userId: string): Promise<any | null> {
    return prisma.settings.findUnique({ where: { userId } });
  }

  static async update(userId: string, data: Partial<any>): Promise<any> {
    return prisma.settings.update({ where: { userId }, data });
  }
} 