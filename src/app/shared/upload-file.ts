import { Component, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-upload-file',
  template: `
    <div>
      <input type="file" class="file-input" (change)="onFileSelected($event)" [accept]="accept()" />
    </div>
  `,
})
/**
 * A reusable file upload component that reads the selected file as a Data URL
 * and updates a signal-based form control.
 */
export class UploadFile implements FormValueControl<string> {
  // 1. Two-way binding signal that holds the base64 string of the uploaded file
  value = model('');
  accept = input<string>();

  reader = new FileReader();

  constructor() {
    // 2. Bind the setData callback to the current instance to ensure 'this' refers to the component
    this.reader.onload = this.setData.bind(this);
  }

  // 3. Triggered when the user selects a file from the input
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // 4. Start reading the file as a Data URL (base64)
      this.reader.readAsDataURL(file);
    }
  }

  // 5. Callback executed when the FileReader finishes reading the file
  setData() {
    const dataUrl = this.reader.result as string;
    // 6. Update the signal with the file's base64 content
    this.value.set(dataUrl);
  }
}
