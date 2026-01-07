import { Injectable, resource, signal } from '@angular/core';
import { ContentUnion, GoogleGenAI } from '@google/genai';
import { environment } from '../../../../environments/environment';

export type Prompt = { text: string, image: string }

const ai = new GoogleGenAI({ apiKey: environment.apiKey });

@Injectable({
  providedIn: 'root'
})
export class GeminiImageService {
  prompt = signal<Prompt>({ text: '', image: '' });

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

      if (params.image) {
        prompt.push({
          inlineData: {
            mimeType: "image/png",
            data: params.image.split(',')[1]
          }
        })
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,

        config: {
          abortSignal,
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "4K"
          }
        },
      });


      return `data:image/png;base64,${response.data}`;
    },
  });
}
