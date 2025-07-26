import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async signup(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    const user = await AuthService.signup(email, password);
    reply.send(user);
  }

  static async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    const token = await AuthService.login(email, password);
    reply.send({ token });
  }
} 