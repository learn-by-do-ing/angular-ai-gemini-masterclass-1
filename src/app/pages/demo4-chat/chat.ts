import { Component, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';
import { marked } from 'marked';

@Component({
  selector: 'app-chat',
  template: `
    <input
      type="text" class="border-2 rounded-xl bg-white"
      placeholder="Chat to Gemini"
      #input (keydown.enter)="send(input)"
      style="position: fixed; bottom: 20px; right: 20px; left: 20px; padding: 20px"
    >
    @if (pending()) { <div style="text-align: center">loading...</div>}

    @for (msg of messages(); track msg) {
      <h1>{{msg.question}}</h1>
      <div  [innerHTML]="msg.answer" style="margin-bottom: 100px"></div>
    }   
  `,
})
export default class ChatComponent {
  ai = new GoogleGenAI({ apiKey: environment.apiKey });
  chat = this.ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'Act as a Personal Trainer. Its name is Max.'
    },
    /* history: [
      {
        role: 'user', parts: [{ text: 'my name is Fabio' }]
      },
      {
        role: 'model', parts: [{ text: 'Hi Fabio, how can I help you today?' }]
      },
    ] */
  })
  pending = signal(false)
  messages = signal<{ question: string, answer: string }[]>([])

  async send(input: HTMLInputElement) {
    this.pending.set(true)
    const response = await this.chat.sendMessage({ message: input.value })
    const answer = await marked.parse(response.text || '', { breaks: true })

    this.messages.update(prev => [...prev, {
      question: input.value,
      answer: answer
    }])
    input.value = '';

    this.pending.set(false)

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }, 300)
  }
}