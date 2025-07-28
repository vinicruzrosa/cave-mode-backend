import { FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export class UploadController {
  static async upload(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();
    if (!data || !data.mimetype.startsWith('image/')) {
      return reply.status(400).send({ error: 'Arquivo de imagem inválido ou ausente.' });
    }

    const uploadsDir = path.resolve(__dirname, '../../uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(data.filename);
    const fileName = `${randomUUID()}${ext}`;
    const filePath = path.resolve(uploadsDir, fileName);
    await fs.writeFile(filePath, await data.toBuffer());

    const url = `http://localhost:3333/uploads/${fileName}`;
    return reply.send({ url });
  }
}