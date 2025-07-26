import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EmergencyUsageRepository {
  static async create(data: { userId: string; week: number; year: number }): Promise<any> {
    return prisma.emergencyUsage.create({ data });
  }

  static async countByUserAndWeek(userId: string, week: number, year: number): Promise<number> {
    return prisma.emergencyUsage.count({ where: { userId, week, year } });
  }
} 