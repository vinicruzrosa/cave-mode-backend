import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new Error('No token provided');
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    (request as any).user = decoded;
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
} 