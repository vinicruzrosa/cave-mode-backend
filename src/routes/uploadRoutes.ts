import { FastifyInstance } from 'fastify';
import { UploadController } from '../controllers/UploadController';

export async function uploadRoutes(fastify: FastifyInstance) {
  fastify.post('/upload', UploadController.upload);
}