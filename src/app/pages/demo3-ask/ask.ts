import { Component, inject, signal, computed } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Field, form, required } from '@angular/forms/signals';
import { GeminiService } from './services/gemini.service';
import { marked } from 'marked';
import { UploadFile } from '../../shared/upload-file';

const initialState = { text: '', base64: '' };

@Component({
  selector: 'app-ask',
  imports: [JsonPipe, Field, UploadFile],
  templateUrl: './ask.html',
  styleUrl: './ask.css',
})
export default class Ask {
  protected readonly geminiService = inject(GeminiService);
  protected readonly data = signal(initialState);

  protected readonly markdown = computed(() => {
    const value = this.geminiService.contentResource.value();
    return value ? marked.parse(value as string, { breaks: true }) : '';
  });

  protected readonly form = form(this.data, (p) => {
    required(p.text, { message: 'Name is required' });
  });

  ask(event: Event) {
    event.preventDefault();
    this.geminiService.setPrompt(this.data());
  }

  reset() {
    this.data.set(initialState);
  }
}
