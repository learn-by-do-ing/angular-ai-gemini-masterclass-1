import { Component, inject } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { GeminiAnalyzeService } from './services/gemini-analyze.service';
import { UploadFile } from '../../shared/upload-file';
import { JsonPipe } from '@angular/common';
import { LoaderComponent } from '../../shared/loader';

const initialState = { text: '', file: '' };

@Component({
  selector: 'app-demo5-multimodal',
  imports: [FormField, UploadFile, JsonPipe, LoaderComponent],
  templateUrl: './demo5-multimodal.html',
})
export default class Demo5Multimodal {
  geminiService = inject(GeminiAnalyzeService);
  data = signal(initialState);

  form = form(this.data, (p) => {
    required(p.text, { message: 'Prompt is required' });
  });

  ask(event: Event) {
    event.preventDefault();
    this.geminiService.setPrompt(this.data());
  }

  reset() {
    this.data.set(initialState);
  }
}
