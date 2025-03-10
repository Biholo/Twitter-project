import { Resend } from 'resend';

export class EmailService {
  private resend: Resend;
  private from: string;

  /**
   * @param from Adresse email d'envoi.
   */
  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.from = 'kilian@cashflowpositif.fr';
  }

  /**
   * Envoie un email via Resend.
   * @param to Destinataire.
   * @param subject Sujet de l'email.
   * @param html Contenu HTML de l'email.
   * @returns La réponse de Resend.
   */
  public async sendEmail(to: string, subject: string, html: string): Promise<any> {
    return this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}

const emailService = new EmailService();

export default emailService;
