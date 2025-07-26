import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskCompletionRepository {
  static async create(data: any): Promise<any> {
    return prisma.taskCompletion.create({ data });
  }

  static async findByUserAndDate(userId: string, date: Date): Promise<any[]> {
    return prisma.taskCompletion.findMany({
      where: {
        userId,
        completedAt: {
          gte: new Date(date.setHours(0,0,0,0)),
          lt: new Date(date.setHours(23,59,59,999)),
        },
      },
    });
  }

  static async findByUserAndRange(userId: string, start: Date, end: Date): Promise<any[]> {
    return prisma.taskCompletion.findMany({
      where: {
        userId,
        completedAt: {
          gte: start,
          lte: end,
        },
      },
    });
  }

  static async countEmergencyUsage(userId: string, week: number, year: number): Promise<number> {
    return prisma.taskCompletion.count({
      where: {
        userId,
        usedEmergencyMode: true,
        completedAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });
  }
} 