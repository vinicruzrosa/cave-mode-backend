import { FastifyInstance } from 'fastify';
import { authRoutes } from './authRoutes';
import { taskRoutes } from './taskRoutes';
import { reportRoutes } from './reportRoutes';
import { routineRoutes } from './routineRoutes';
import { uploadRoutes } from './uploadRoutes';

export async function registerRoutes(fastify: FastifyInstance) {
  await authRoutes(fastify);
  await taskRoutes(fastify);
  await reportRoutes(fastify);
  await routineRoutes(fastify);
  await uploadRoutes(fastify);
} 