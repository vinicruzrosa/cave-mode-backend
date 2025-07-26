import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskService } from '../services/TaskService';

export class TaskController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { name } = request.body as any;
    const task = await TaskService.createTask(user.id, name);
    reply.send(task);
  }

  static async list(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const tasks = await TaskService.listTasks(user.id);
    reply.send(tasks);
  }

  static async complete(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as any;
    const { proofData, usedEmergencyMode, emergencyJustification } = request.body as any;
    const result = await TaskService.completeTask({
      userId: user.id,
      taskId: id,
      proofData,
      usedEmergencyMode,
      emergencyJustification,
    });
    reply.send(result);
  }
} 