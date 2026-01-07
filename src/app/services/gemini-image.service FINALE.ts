import { inject, Injectable, resource, signal } from '@angular/core';
import { GEMINI_AI } from './gemini.provider';

export type Prompt = { text: string, images: { base64: string }[] }

@Injectable({
  providedIn: 'root'
})
export class GeminiImageService {
  ai = inject(GEMINI_AI);
  prompt = signal<Prompt>({ text: '', images: [] });

  setPrompt(data: Prompt) {
    this.prompt.set(data)
  }

  contentResource = resource<string | undefined, Prompt>({
    params: () => this.prompt(),
    loader: async ({ params, abortSignal }) => {
      if (!params.text) return undefined

      const images = params.images.map((image) => ({
        inlineData: {
          mimeType: "image/png",
          data: image.base64.split(',')[1]
        }
      }));

      const prompt = [
        params.text,
        ...images
      ];

      console.log(prompt);

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: prompt,
        config: { abortSignal },
      });


      return `data:image/png;base64,${response.data}`;
    },
  });
}
