#!/usr/bin/env node
'use strict';

import createPdf from '../src/pdf-gen.mjs';
import { readFileSync, writeFileSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import SwaggerParser from '@apidevtools/swagger-parser';

const argv = yargs(hideBin(process.argv))
  .option('spec', {
    alias: 's',
    type: 'string',
    description: 'openapi spec file to convert',
    requiresArg: true,
    demandOption: true,
  })
  .option('out', { alias: 'o', type: 'string', description: 'output file', requiresArg: true, demandOption: true })
  .option('primaryColor', { type: 'string', description: 'primary color to use in document', requiresArg: true })
  .help().argv;

export async function generatePdf() {
  try {
    const api = await SwaggerParser.validate(argv.spec);
    const data = await createPdf(api, {
      pdfSortTags: false,
      pdfPrimaryColor: argv.primaryColor ? argv.primaryColor : '',
      // pdfAlternateColor: '',
      pdfTitle: 'API Reference',
      pdfCoverText: '',
      pdfSecurityText: '',
      pdfApiText: '',
      pdfSchemaStyle: 'object',
      pdfFooterText: '',
      includeInfo: true,
      includeToc: true,
      includeSecurity: true,
      includeExample: false,
      includeApiDetails: true,
      includeApiList: false,
      localize: {
        index: 'INDEX',
        api: 'API',
        apiList: 'API List',
        apiReference: 'API Reference',
        apiVersion: 'API Version',
        contact: 'CONTACT',
        name: 'NAME',
        email: 'EMAIL',
        url: 'URL',
        termsOfService: 'Terms of service',
        securityAndAuthentication: 'Security and Authentication',
        securitySchemes: 'SECURITY SCHEMES',
        key: 'KEY',
        type: 'TYPE',
        example: 'EXAMPLE',
        description: 'DESCRIPTION',
        request: 'REQUEST',
        requestBody: 'REQUEST BODY',
        response: 'RESPONSE',
        responseModel: 'RESPONSE MODEL',
        statusCode: 'STATUS CODE',
        deprecated: 'DEPRECATED',
        allowed: 'ALLOWED',
        default: 'DEFAULT',
        readOnly: 'READ ONLY',
        writeOnly: 'WRITE ONLY',
        enumValues: 'ENUM',
        pattern: 'PATTERN',
        parameters: 'Parameters',
        noRequestParameters: 'No request parameters',
        method: 'METHOD',
      },
    });

    writeFileSync(argv.out, data);
  } catch (e) {
    console.error('Something went wrong! Please check your input parameters!');
	console.log(e.message ?? e);
  }
}
generatePdf();
