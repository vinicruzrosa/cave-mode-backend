import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';
const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;

export async function validateImageWithHuggingFace(imagePathOrUrl: string): Promise<string> {
  let base64Image: string;
  // Se for URL http(s), tente baixar e converter para base64 (não recomendado para localhost)
  if (imagePathOrUrl.startsWith('http')) {
    // Se for URL local, converte para caminho local
    if (imagePathOrUrl.startsWith('http://localhost')) {
      const localPath = path.resolve(
        __dirname,
        '../../',
        imagePathOrUrl.replace('http://localhost:3333/', '')
      );
      const buffer = await fs.readFile(localPath);
      base64Image = buffer.toString('base64');
    } else {
      // Para URLs externas, baixe a imagem
      const response = await axios.get(imagePathOrUrl, { responseType: 'arraybuffer' });
      base64Image = Buffer.from(response.data).toString('base64');
    }
  } else {
    // Caminho local
    const buffer = await fs.readFile(imagePathOrUrl);
    base64Image = buffer.toString('base64');
  }

  const response = await axios.post(
    HUGGINGFACE_API_URL,
    { inputs: { image: base64Image } },
    {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_TOKEN}`,
      },
    }
  );
  return response.data[0]?.generated_text || '';
}