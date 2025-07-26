import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  static async create(data: { userId: string; name: string }): Promise<any> {
    return prisma.task.create({ data });
  }

  static async findByUser(userId: string): Promise<any[]> {
    return prisma.task.findMany({ where: { userId } });
  }

  static async findById(id: string): Promise<any | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  static async update(id: string, data: Partial<any>): Promise<any> {
    return prisma.task.update({ where: { id }, data });
  }
} 