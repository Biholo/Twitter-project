import fs from 'fs';
import path from 'path';

class TemplateService {
    private templatesDir: string;
  constructor() {
    // je dois .. pour sortir de services
    this.templatesDir = path.join(__dirname, '..', 'emails');
  }

  public generateHtml(templateName: string, context: Record<string, string>): string {
    const basePath = path.join(this.templatesDir, 'components', 'base.html');
    const headerPath = path.join(this.templatesDir, 'components', 'header.html');
    const footerPath = path.join(this.templatesDir, 'components', 'footer.html');
    const templatePath = path.join(this.templatesDir, `${templateName}.html`);

    console.log(templatePath);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Le template n'existe pas : ${templatePath}`);
    }

    // Charger les fichiers HTML
    let base = fs.existsSync(basePath) ? fs.readFileSync(basePath, 'utf8') : '';
    const header = fs.existsSync(headerPath) ? fs.readFileSync(headerPath, 'utf8') : '';
    const footer = fs.existsSync(footerPath) ? fs.readFileSync(footerPath, 'utf8') : '';
    let content = fs.readFileSync(templatePath, 'utf8');

    // Remplacer les variables dans le contenu
    content = this.replacePlaceholders(content, context);

    // Assembler l'email final
    if (!base) {
      base = `{{header}}\n{{content}}\n{{footer}}`; // Si `base.html` n'existe pas, structure par défaut
    }

    let emailHtml = base
      .replace('{{header}}', header)
      .replace('{{content}}', content)
      .replace('{{footer}}', footer);

    return emailHtml;
  }

  private replacePlaceholders(template: string, context: Record<string, string>): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => context[key.trim()] || '');
  }
}

const templateService = new TemplateService();

export default templateService;
