import { FastifyInstance } from 'fastify';
import { ReportController } from '../controllers/ReportController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function reportRoutes(fastify: FastifyInstance) {
  fastify.get('/tasks/today', { preHandler: [authMiddleware] }, ReportController.today);
  fastify.get('/tasks/weekly-report', { preHandler: [authMiddleware] }, ReportController.weekly);
  fastify.get('/emergency-usage', { preHandler: [authMiddleware] }, ReportController.emergencyUsage);
} 