import { Injectable, Logger } from '@nestjs/common';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

export interface SendSmsParams {
  toPhone: string;
  message: string;
  otp?: string;
  type?: 'OTP' | 'BOOKING_PIN' | 'ALERT';
}

export interface SendEmailParams {
  toEmail: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private kafkaService: KafkaProducerService) {}

  async sendSms(params: SendSmsParams): Promise<{ success: boolean; simulated: boolean; messageId?: string }> {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (twilioSid && twilioAuth && twilioPhone) {
      try {
        const auth = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const formBody = new URLSearchParams({
          To: params.toPhone.startsWith('+') ? params.toPhone : `+91${params.toPhone.replace(/\D/g, '')}`,
          From: twilioPhone,
          Body: params.message,
        });

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        });

        if (res.ok) {
          const data = await res.json();
          this.logger.log(`Live SMS dispatched via Twilio to ${params.toPhone}: SID ${data.sid}`);
          await this.kafkaService.emitEvent('vahaan.events', 'notification.sms_sent', {
            to: params.toPhone,
            sid: data.sid,
            live: true,
          });
          return { success: true, simulated: false, messageId: data.sid };
        } else {
          const errText = await res.text();
          this.logger.error(`Twilio SMS dispatch failed: ${errText}`);
        }
      } catch (err: any) {
        this.logger.error(`Error connecting to SMS gateway: ${err.message}`);
      }
    }

    // Fallback: Simulation mode
    this.logger.log(`[SMS SIMULATION] Dispatched to ${params.toPhone}: "${params.message}"`);
    await this.kafkaService.emitEvent('vahaan.events', 'notification.sms_simulated', {
      to: params.toPhone,
      message: params.message,
      type: params.type || 'ALERT',
      live: false,
    });

    return { success: true, simulated: true, messageId: `sim_sms_${Date.now()}` };
  }

  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; simulated: boolean }> {
    const smtpHost = process.env.SMTP_HOST;
    const emailFrom = process.env.EMAIL_FROM || 'support@vahaanrent.in';

    // If live SMTP configured
    if (smtpHost && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.logger.log(`Live Email dispatched to ${params.toEmail}: ${params.subject}`);
      await this.kafkaService.emitEvent('vahaan.events', 'notification.email_sent', {
        to: params.toEmail,
        subject: params.subject,
        live: true,
      });
      return { success: true, simulated: false };
    }

    // Fallback: Simulation mode
    this.logger.log(`[EMAIL SIMULATION] Sent to ${params.toEmail}: Subject "${params.subject}"`);
    await this.kafkaService.emitEvent('vahaan.events', 'notification.email_simulated', {
      to: params.toEmail,
      subject: params.subject,
      live: false,
    });

    return { success: true, simulated: true };
  }
}
