import { Injectable, resource, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

export type Prompt = { text: string, images: { image: string }[] } // <==

const ai = new GoogleGenAI({ apiKey: 'AIzaSyAJBxypv9cETfYLnHv2Ek085M - oP1vx56s' });

@Injectable({
  providedIn: 'root'
})
export class GeminiImageService {
  prompt = signal<Prompt>({ text: '', images: [] }); // <==

  setPrompt(data: Prompt) {
    this.prompt.set(data)
  }

  contentResource = resource<string | undefined, Prompt>({
    params: () => this.prompt(),
    loader: async ({ params, abortSignal }) => {
      if (!params.text) return undefined

      // <==
      const images = params.images.map((img) => ({
        inlineData: {
          mimeType: "image/png",
          data: img.image.split(',')[1]
        }
      }));

      const prompt = [ // <==
        params.text,
        ...images
      ];

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
