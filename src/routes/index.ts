import { FastifyInstance } from 'fastify';
import { authRoutes } from './authRoutes';
import { taskRoutes } from './taskRoutes';
import { reportRoutes } from './reportRoutes';

export async function registerRoutes(fastify: FastifyInstance) {
  await authRoutes(fastify);
  await taskRoutes(fastify);
  await reportRoutes(fastify);
} 