import { Component, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from '../../../environments/environment';
import { marked } from 'marked';
import { LoaderComponent } from '../../shared/loader';

@Component({
  selector: 'app-chat',
  template: `
    <input
      type="text" class="border-2 rounded-xl bg-white"
      placeholder="Chat to Gemini"
      #input (keydown.enter)="send(input)"
      style="position: fixed; bottom: 20px; right: 20px; left: 20px; padding: 20px"
    >
  
    @for (msg of messages(); track msg) {
      <h1 class="question">
        @if (pending() && msg.answer === '') {
          <app-loader></app-loader>
        }
        {{msg.question}}
      </h1>

      
      <div 
        class="answer" [innerHTML]="msg.answer"
        [style.margin-bottom.px]="100"></div>
    }   

  `,
  imports: [LoaderComponent]
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
    const prompt = input.value;
    input.value = ''
    this.messages.update(prev => [...prev, {
      question: prompt,
      answer: ''
    }])

    setTimeout(() => {
      const questions = document.querySelectorAll('h1.question');
      const lastQuestion = questions[questions.length - 1];
      if (lastQuestion) {
        lastQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300)


    const response = await this.chat.sendMessage({ message: prompt })
    const answer = await marked.parse(response.text || '', { breaks: true })

    this.messages.update(prev => {
      const newPrev = [...prev]
      newPrev[newPrev.length - 1].answer = answer
      return newPrev
    })
    this.pending.set(false)

    // input.value = '';
    /* 
        setTimeout(() => {
          const answers = document.querySelectorAll('div.answer');
          const lastAnswer = answers[answers.length - 1];
          if (lastAnswer) {
            lastAnswer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300) */

  }
}