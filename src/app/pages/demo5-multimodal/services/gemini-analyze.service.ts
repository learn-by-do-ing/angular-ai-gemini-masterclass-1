import { Injectable, resource, signal } from '@angular/core';
import { ContentUnion, GoogleGenAI } from '@google/genai';
import { environment } from '../../../../environments/environment';
import { marked } from 'marked';

export type Prompt = { text: string, file: string }

const ai = new GoogleGenAI({ apiKey: environment.apiKey });

@Injectable({
  providedIn: 'root'
})
export class GeminiAnalyzeService {
  prompt = signal<Prompt>({ text: '', file: '' });

  setPrompt(data: Prompt) {
    this.prompt.set(data)
  }

  contentResource = resource<string | undefined, Prompt>({
    params: () => this.prompt(),
    loader: async ({ params, abortSignal }) => {
      if (!params.text) return undefined

      const prompt: ContentUnion = [
        params.text,
      ]

      if (params.file) {
        const matches = params.file.match(/^data:(.*);base64,(.*)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const data = matches[2];

          prompt.push({
            inlineData: {
              mimeType,
              data
            }
          })
        }
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: {
          abortSignal,

        },
      });

      return marked.parse(
        response.text || '', { breaks: true }
      )
    },
  });
}
