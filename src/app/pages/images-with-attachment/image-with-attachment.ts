import { Component, inject } from '@angular/core';
import { Field, form, required } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { GeminiImageService } from './services/gemini-image.service';
import { UploadFile } from '../../shared/upload-file';
import { JsonPipe } from '@angular/common';

const initialState = { text: '', image: '' };

@Component({
  selector: 'app-image-with-attachment',
  imports: [Field, UploadFile, JsonPipe],
  templateUrl: './image-with-attachment.html',
  styleUrl: './image-with-attachment.css',
})
export default class ImageWithAttachment {
  geminiService = inject(GeminiImageService);
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
