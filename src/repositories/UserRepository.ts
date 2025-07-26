import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  static async create(data: { email: string; password: string }): Promise<any> {
    return prisma.user.create({ data });
  }

  static async findByEmail(email: string): Promise<any | null> {
    return prisma.user.findUnique({ where: { email } });
  }
} 