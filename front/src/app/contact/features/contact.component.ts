import { Component } from '@angular/core';
import { ContactService } from 'app/contact/data-access/contact.service'; // Adjust the path as needed
import { ContactFormComponent } from "app/contact/ui/contact-form/contact-form.component";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [ContactFormComponent],
})
export class ContactComponent {
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private contactService: ContactService) {}

  onFormSubmit(event: { email: string; message: string }) {
    this.contactService.sendEmail(event.email, event.message)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        this.successMessage = "Demande de contact envoyée avec succès";
      })
      .catch((error) => {
        console.log('FAILED...', error);
        this.errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      });
  }
}
