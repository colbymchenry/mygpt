// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import ChatGPT from '@/lib/chatgpt';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const body = req.body;
  const prompts = [...body.botConfig, ...body.messages];
  const apiKey = body.apiKey;
  const prompt = body.message;

  console.log(prompts)

  const gpt = new ChatGPT(prompts, apiKey);
  const resp = await gpt.askQuestion(prompt);
  console.log(resp);

  res.status(200).json({
    messages: [...body.messages, {
      role: 'user',
      content: prompt
    }, {
      role: 'system',
      content: resp
    }]
  })
}
