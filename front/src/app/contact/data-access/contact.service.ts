import { Injectable } from '@angular/core';
import { environment } from 'app/../environments/environment';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

// Interface defining the parameters for the email
export interface EmailParams {
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root', // This service is available throughout the application
})
export class ContactService {
  // Retrieve environment variables for EmailJS configuration
  private userId = environment.EMAILJS_USER_ID;
  private serviceId = environment.EMAILJS_SERVICE_ID;
  private templateId = environment.EMAILJS_TEMPLATE_ID;

  constructor() {}

  // Method to send an email using EmailJS
  async sendEmail(params: EmailParams): Promise<EmailJSResponseStatus> {
    try {
      //template parameters
      const templateParams = {
        shopName: 'ALTEN SHOP',
      };

      // Sending the email through EmailJS
      const response: EmailJSResponseStatus = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams,
        this.userId
      );

      // Return the response status from EmailJS
      return response;
      
    } catch (error) {
      console.error('Error sending email:', error);
      // Throw a new error to notify of the failure
      throw new Error('Email sending failed, please try again later.');
    }
  }
}