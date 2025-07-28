import { FastifyInstance } from 'fastify';
import { RoutineController } from '../controllers/RoutineController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function routineRoutes(app: FastifyInstance) {
  app.post('/routines', { preHandler: [authMiddleware] }, RoutineController.create);
  app.get('/routines', { preHandler: [authMiddleware] }, RoutineController.list);
  app.delete('/routines/:id', { preHandler: [authMiddleware] }, RoutineController.delete);
}
