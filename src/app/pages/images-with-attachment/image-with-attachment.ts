import { Component, inject } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { GeminiImageService } from './services/gemini-image.service';
import { UploadFile } from '../../shared/upload-file';
import { JsonPipe } from '@angular/common';
import { LoaderComponent } from '../../shared/loader';

const initialState = { text: '', image: '' };

@Component({
  selector: 'app-image-with-attachment',
  imports: [FormField, UploadFile, JsonPipe, LoaderComponent],
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
