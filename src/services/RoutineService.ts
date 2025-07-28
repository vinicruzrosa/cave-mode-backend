import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RoutineService {
  static async getRoutineById(id: string) {
    return prisma.routine.findUnique({ where: { id } });
  }

  static async deleteRoutine(id: string) {
    return prisma.routine.delete({ where: { id } });
  }
  static async createRoutine({ userId, title, description }: { userId: string; title: string; description?: string }) {
    return prisma.routine.create({
      data: {
        userId,
        title,
        description,
      },
    });
  }

  static async listRoutines(userId: string) {
    return prisma.routine.findMany({
      where: { userId },
      include: { tasks: true },
    });
  }

  static async addTaskToRoutine(routineId: string, taskData: any) {
    return prisma.task.create({
      data: {
        ...taskData,
        routine: { connect: { id: routineId } },
      },
    });
  }
}
