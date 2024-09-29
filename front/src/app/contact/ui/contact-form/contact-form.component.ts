import {
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-contact-form", // Component selector for use in templates
  template: `
    <div *ngIf="loading" class="loader">Envoi...</div> <!-- Display loading message when sending -->
    <form (ngSubmit)="onFormSubmit(form)" #form="ngForm"> <!-- Handle form submission -->
      <div>
        <label for="email">Email:</label>
        <input pInputText type="email" id="email" required 
               [(ngModel)]="email" name="email" 
               email #emailField="ngModel" aria-required="true" aria-invalid="emailField.invalid">
        <div *ngIf="emailField.invalid && emailField.touched"> <!-- Show errors for email input -->
          <small *ngIf="emailField.errors?.required" class="text-error">L'adresse e-mail est obligatoire</small>
          <small *ngIf="emailField.errors?.email" class="text-error">Format d'e-mail non valide.</small>
        </div>
      </div>
      <div>
        <label for="message">Message:</label>
        <textarea pInputTextarea id="message" required 
                  [(ngModel)]="message" name="message" 
                  maxlength="300" #messageField="ngModel" aria-required="true" aria-invalid="messageField.invalid"></textarea>
        <div *ngIf="messageField.invalid && messageField.touched"> <!-- Show errors for message input -->
          <small *ngIf="messageField.errors?.required" class="text-error">Le message est obligatoire.</small>
          <small *ngIf="messageField.errors?.maxlength" class="text-error">Le message ne peut pas dépasser 300 caractères.</small>
        </div>
      </div>
      <p-button type="submit" [disabled]="!form.valid" label="Envoyer"></p-button> <!-- Submit button -->
    </form>
  `,
  styleUrls: ["./contact-form.component.scss"],
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CommonModule
  ],
  encapsulation: ViewEncapsulation.None
})
export class ContactFormComponent {
  email: string = '';
  message: string = '';
  loading: boolean = false; // Indicates if the form is in loading state
  @Output() formSubmitted = new EventEmitter<{ email: string; message: string }>(); // EventEmitter to emit form data

  // Method to handle form submission
  onFormSubmit(form: NgForm) {
    // Check if email and message fields are populated
    if (this.email && this.message) {
      this.loading = true; // Set loading state to true
      this.formSubmitted.emit({ email: this.email, message: this.message }); // Emit the form data
      this.simulateEmailSending(form); // Simulate email sending
    }
  }

  // Simulates email sending with a timeout
  private simulateEmailSending(form: NgForm) {
    setTimeout(() => {
      this.loading = false; // Reset loading state
      this.resetForm(form); // Reset the form
    }, 2000); 
  }

  // Resets the form fields and the model values
  private resetForm(form: NgForm) {
    form.reset(); 
    this.email = ''; 
    this.message = '';
  }
}