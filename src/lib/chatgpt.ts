import OpenAI from 'openai';

export interface GPTMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export default class ChatGPT {

    private prompts: GPTMessage[];
    private apiKey: string;

    constructor(prompts: GPTMessage[], apiKey: string) {
        this.prompts = prompts;
        this.apiKey = apiKey;
    }

    async askQuestion(prompt: string) {
        const openai = new OpenAI({
            apiKey: this.apiKey
        });

        const completion = await openai.chat.completions.create({
            messages: [...(this.prompts || []), { role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });

        return completion.choices[0].message?.content;
    }

}