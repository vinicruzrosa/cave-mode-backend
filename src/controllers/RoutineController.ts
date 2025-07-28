import { FastifyReply, FastifyRequest } from 'fastify';
import { RoutineService } from '../services/RoutineService';
import { z } from 'zod';

export class RoutineController {
  static async create(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const bodySchema = z.object({
      title: z.string().min(1, 'O título é obrigatório'),
      description: z.string().optional(),
    });
    const parseResult = bodySchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: 'Dados inválidos', issues: parseResult.error.flatten() });
    }
    const { title, description } = parseResult.data;
    const routine = await RoutineService.createRoutine({ userId: user.id, title, description });
    reply.status(201).send(routine);
  }

  static async list(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const routines = await RoutineService.listRoutines(user.id);
    reply.send(routines);
  }
  static async delete(request: FastifyRequest, reply: FastifyReply) {
    const user = (request as any).user;
    const { id } = request.params as any;
    const routine = await RoutineService.getRoutineById(id);
    if (!routine || routine.userId !== user.id) {
      return reply.status(404).send({ error: 'Rotina não encontrada' });
    }
    await RoutineService.deleteRoutine(id);
    reply.status(204).send();
  }
}
