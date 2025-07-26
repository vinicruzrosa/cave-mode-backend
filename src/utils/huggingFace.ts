import axios from 'axios';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function validateImageWithHuggingFace(imageUrl: string): Promise<string> {
  const response = await axios.post(
    HUGGINGFACE_API_URL,
    { inputs: imageUrl },
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      },
    }
  );
  return response.data[0]?.generated_text || '';
} 