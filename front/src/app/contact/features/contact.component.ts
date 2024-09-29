import { Component } from '@angular/core';
import { ContactService, EmailParams } from 'app/contact/data-access/contact.service';
import { ContactFormComponent } from 'app/contact/ui/contact-form/contact-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [ContactFormComponent, CommonModule, FormsModule],
})
export class ContactComponent {
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private contactService: ContactService) {} // Inject ContactService for sending emails

  // Method to handle form submission
  onFormSubmit(event: { email: string; message: string }): void {
    // Create EmailParams object from submitted form data
    const emailParams: EmailParams = {
      email: event.email,
      message: event.message,
    };

    // Call sendEmail method with the constructed emailParams
    this.sendEmail(emailParams);
  }

  // Private method to send the email using the contact service
  private sendEmail(params: EmailParams): void {
    this.contactService.sendEmail(params)
      .then(response => {
        console.log('Message sent:', response.status, response.text);
        this.successMessage = "Demande de contact envoyée avec succès.";
        this.clearMessages(); // Clear messages after successful send
      })
      .catch(error => {
        console.error('Email sending failed:', error);
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      });
  }

  // Private method to clear success and error messages after a delay
  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = ''; // Clear success message
      this.errorMessage = ''; // Clear error message
    }, 5000); // Clear messages after 5 seconds
  }
}