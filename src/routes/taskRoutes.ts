import { FastifyInstance } from 'fastify';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.post('/tasks', { preHandler: [authMiddleware] }, TaskController.create);
  fastify.get('/tasks', { preHandler: [authMiddleware] }, TaskController.list);
  fastify.patch('/tasks/:id/complete', { preHandler: [authMiddleware] }, TaskController.complete);
} 