import { PrismaClient, Task, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  static async create(data: Prisma.TaskCreateInput): Promise<Task> {
    // Cria uma task associando userId e name
    return prisma.task.create({
      data
    });
  }

  static async findByUser(userId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
  }

  static async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({ where: { id } });
  }

  static async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }
}
