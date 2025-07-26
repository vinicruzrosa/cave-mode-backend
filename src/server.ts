import Fastify from 'fastify';
import dotenv from 'dotenv';
import { registerRoutes } from './routes/index';

dotenv.config();

const fastify = Fastify({ logger: true });

registerRoutes(fastify);

const PORT = process.env.PORT || 3333;

fastify.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
}); 