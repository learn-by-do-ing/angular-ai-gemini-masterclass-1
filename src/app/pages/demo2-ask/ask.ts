import { Component, resource, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Field, form, required } from '@angular/forms/signals';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';

const initialState = { text: '' };

@Component({
  selector: 'app-ask',
  imports: [JsonPipe, Field],
  templateUrl: './ask.html',
  styleUrl: './ask.css',
})
export default class Ask {
  protected readonly data = signal(initialState);
  protected readonly prompt = signal('');
  ai = new GoogleGenAI({ apiKey: environment.apiKey })

  protected readonly form = form(this.data, (p) => {
    required(p.text, { message: 'Name is required' });
  });

  ask(event: Event) {
    event.preventDefault();
    this.prompt.set(this.data().text);
  }

  reset() {
    this.data.set(initialState);
  }


  contentResource = resource<string | undefined, string>({
    params: () => this.prompt(),
    loader: async ({ params, abortSignal }) => {
      if (!params) return undefined

      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: params,
        config: {
          abortSignal
        }
      });
      return response.text
    },
  });
}
