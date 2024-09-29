import { Injectable } from '@angular/core';
import { environment } from "app/../environments/environment";
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor() {}

  sendEmail(email: string, message: string): Promise<any> {
    const templateParams = {
      email: email,
      message: message,
    };

    const userId = environment.emailjsUserId;
    const serviceId = environment.emailjsServiceId;
    const templateId = environment.emailjsTemplateId;
    

    return emailjs.send(serviceId, templateId, templateParams, userId);

  }
}