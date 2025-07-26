import { FastifyReply, FastifyRequest } from 'fastify';
import { ReportService } from '../services/ReportService';

export class ReportController {
  static async today(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const tasks = await ReportService.tasksToday(user.id);
    reply.send(tasks);
  }

  static async weekly(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { start, end } = request.query as any;
    const stats = await ReportService.weeklyReport(user.id, new Date(start), new Date(end));
    reply.send(stats);
  }

  static async emergencyUsage(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const usage = await ReportService.emergencyUsage(user.id);
    reply.send(usage);
  }
} 