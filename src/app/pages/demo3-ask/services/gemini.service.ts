import { inject, Injectable, resource, signal } from '@angular/core';
import { ContentListUnion } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../../environments/environment';


export type Prompt = { text: string, base64: string }

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  ai = new GoogleGenAI({ apiKey: environment.apiKey })
  prompt = signal({ text: '', base64: '' });

  setPrompt(data: Prompt) {
    this.prompt.set(data)
  }

  contentResource = resource<string | undefined, Prompt>({
    params: () => this.prompt(),
    loader: async ({ params, abortSignal }) => {
      if (!params.text) return undefined

      const contents: ContentListUnion = [
        { text: params.text }
      ];

      // Check if a base64 image is provided in the prompt parameters
      if (params.base64) {
        // Split the Data URL into metadata (part 0) and raw data (part 1)
        const dataUrlParts = params.base64.split(',')
        // Extract the MIME type (e.g., 'image/png') from the metadata part using a valid regex
        const mimeType = dataUrlParts[0].match(/:(.*?);/)![1]

        // Ensure the data parts exist (though split always returns an array, this acts as a safety check)
        if (dataUrlParts) {
          // Add the image content to the request payload
          contents.push({
            inlineData: {
              // The raw base64 string content
              data: dataUrlParts[1],
              // The extracted MIME type
              mimeType,
            },
          });
        }
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          abortSignal
        }
      });
      return response.text
    },
  });
}
