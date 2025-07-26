import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/signup', AuthController.signup);
  fastify.post('/login', AuthController.login);
} 