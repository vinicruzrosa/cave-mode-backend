import { FastifyReply, FastifyRequest } from 'fastify';
import { TaskService } from '../services/TaskService';
import { z } from 'zod';

export class TaskController {
static async create(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;

    const bodySchema = z.object({
      routineId: z.string().min(1, 'A rotina é obrigatória'),
      name: z.string().min(1, 'O nome da tarefa é obrigatório'),
      description: z.string().min(1, 'A descrição é obrigatória'),
      startTime: z.coerce.date({ error: 'startTime deve ser uma data válida' }),
      validUntil: z.coerce.date({ error: 'validUntil deve ser uma data válida' }),
      requiresProof: z.boolean(),
      duration: z.number().int().positive().optional()
    });

    const parseResult = bodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Dados inválidos', issues: parseResult.error.flatten() });
    }

    const { routineId, name, description, startTime, validUntil, requiresProof, duration } = parseResult.data;

    const task = await TaskService.createTask({
      userId: user.id,
      routineId,
      name,
      description,
      startTime,
      endTime: validUntil,
      requiresProof,
      duration,
    });

    reply.status(201).send(task);
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