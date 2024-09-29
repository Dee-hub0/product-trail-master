import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  ViewEncapsulation,
} from "@angular/core";
  import { FormsModule } from "@angular/forms";
  import { ButtonModule } from "primeng/button";
  import { InputTextModule } from "primeng/inputtext";
  import { InputTextareaModule } from 'primeng/inputtextarea';

  @Component({
    selector: "app-contact-form",
    template: `
      <form (ngSubmit)="onFormSubmit()" #form="ngForm">
  <div>
      <label for="email">Email:</label>
      <input pInputText type="email" id="email" required [(ngModel)]="email" name="email">
  </div>
  <div>
      <label for="message">Message:</label>
      <textarea pInputTextarea id="message" required [(ngModel)]="message" name="message" maxlength="300"></textarea>
  </div>
  <p-button type="submit" [disabled]="!form.valid" label="Enregistrer" severity="success"/>
</form>
    `,
    styleUrls: ["./contact-form.component.scss"],
    standalone: true,
    imports: [
      FormsModule,
      ButtonModule,
      InputTextModule,
      InputTextareaModule,
    ],
    encapsulation: ViewEncapsulation.None
  })
  export class ContactFormComponent {
    email: string = '';
    message: string = '';
  @Output() formSubmitted = new EventEmitter<{ email: string; message: string }>();

    onFormSubmit() {
      if (this.email && this.message) {
        this.formSubmitted.emit({ email: this.email, message: this.message });
        this.email = '';
        this.message = '';
      }
    }

  }
  