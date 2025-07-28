import Fastify from 'fastify';
import { registerRoutes } from './routes/index';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';


const uploadsDir = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fastify = Fastify({ logger: true });


fastify.register(fastifyMultipart);

fastify.register(fastifyStatic, {
  root: uploadsDir,
  prefix: '/uploads/',
});

// Registra as rotas da aplicação
registerRoutes(fastify);

const PORT = process.env.PORT || 3333;

fastify.listen({ port: Number(PORT), host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
