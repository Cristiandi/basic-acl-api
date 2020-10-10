import * as path from 'path';
import * as fs from 'fs';
import hbs from 'handlebars';
import * as mjml2html from 'mjml';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {

  public async generateHtmlByTemplate(templateName: string, parameters = {}, helpers = [], isReport = false): Promise<string> {
    // get the path of the template
    const filePath = isReport ? `./reports/${templateName}.hbs` : `./emails/${templateName}.mjml`;
    const templatePath = path.resolve(__dirname, filePath);

    // compile the template
    const template = hbs.compile(fs.readFileSync(templatePath, 'utf8'));

    if (helpers.length) {
      for (const helper of helpers) {
        hbs.registerHelper(helper.name, helper.function);
      }
    }

    // get the result
    const result = template(parameters);

    // get the html
    const html = isReport ? result : mjml2html(result).html;

    return html;
  }

}
