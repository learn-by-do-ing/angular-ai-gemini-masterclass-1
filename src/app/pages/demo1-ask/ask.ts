import { Component, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ask',
  imports: [FormsModule],
  template: `
    <h1>Demo 1: ask</h1>
    <textarea [(ngModel)]="prompt" placeholder="Ask..."></textarea>

    <button class="primary" (click)="ask()">Submit</button>

    <div>{{ response() }}</div>
`,
})
export default class Ask {
  prompt = signal('');
  response = signal<string | undefined>(undefined);

  async ask() {
    const ai = new GoogleGenAI({ apiKey: environment.apiKey })

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: this.prompt(),
    });

    this.response.set(response.text);
  }

}
