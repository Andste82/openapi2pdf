import pdfMake from 'pdfmake/src/printer.js';
import { getApiDef, getApiListDef, getInfoDef, getSecurityDef } from './pdf-parts-gen.mjs';
import ProcessSpec from './spec-parser.mjs';

export default function createPdf(specUrl, options) {
  return new Promise(async function (resolve) {
    const parsedSpec = await ProcessSpec(specUrl, options.pdfSortTags);

    const pdfStyles = {
      title: { fontSize: 32 },
      h1: { fontSize: 20 },
      h2: { fontSize: 18 },
      h3: { fontSize: 16 },
      h4: { fontSize: 14 },
      h5: { fontSize: 12 },
      h6: { fontSize: 10, bold: true },
      p: { fontSize: 10 },
      small: { fontSize: 10 },
      sub: { fontSize: 8 },
      right: { alignment: 'right' },
      left: { alignment: 'left' },
      topMargin1: { margin: [0, 180, 0, 10] },
      topMargin2: { margin: [0, 60, 0, 5] },
      topMargin3: { margin: [0, 20, 0, 3] },
      topMargin4: { margin: [0, 15, 0, 3] },
      topMarginRegular: { margin: [0, 3, 0, 0] },
      tableMargin: { margin: [0, 5, 0, 15] },
      b: { bold: true },
      i: { italics: true },
      primary: {
        color: options.pdfPrimaryColor ? options.pdfPrimaryColor : '#b44646',
      },
      alternate: {
        color: options.pdfAlternateColor ? options.pdfAlternateColor : '#005b96',
      },
      gray: { color: 'gray' },
      lightGray: { color: '#aaaaaa' },
      darkGray: { color: '#666666' },
      red: { color: 'orangered' },
      blue: { color: '#005b96' },
      mono: { font: 'Courier', fontSize: 10 },
      monoSub: { font: 'Courier', fontSize: 8 },
    };

    const allContent = [];
    let infoDef = {};
    let tocDef = {};
    let securityDef = {};
    let apiListDef = {};
    let apiDef = {};

    if (options.includeInfo) {
      infoDef = getInfoDef(parsedSpec, options.pdfTitle, options.localize);
      allContent.push(infoDef);
    }
    if (options.includeToc) {
      tocDef = {
        toc: {
          title: { text: options.localize.index, style: ['b', 'h2'] },
          numberStyle: { bold: true },
          style: ['small'],
        },
        pageBreak: 'after',
      };
      // allContent.push({text:'', pageBreak:'after'});
      allContent.push(tocDef);
    }
    if (options.includeSecurity) {
      securityDef = getSecurityDef(parsedSpec, options.localize);
      allContent.push(securityDef);
    }
    if (options.includeApiDetails) {
      apiDef = getApiDef(
        parsedSpec,
        '',
        options.pdfSchemaStyle,
        options.localize,
        options.includeExample,
        options.includeApiList
      );
      allContent.push(apiDef);
    }
    if (options.includeApiList) {
      apiListDef = getApiListDef(parsedSpec, options.localize.apiList, options.localize);
      allContent.push(apiListDef);
    }

    const finalDocDef = {
      footer(currentPage, pageCount) {
        return {
          margin: 10,
          columns: [
            { text: options.pdfFooterText, style: ['sub', 'gray', 'left'] },
            {
              text: `${currentPage} of ${pageCount}`,
              style: ['sub', 'gray', 'right'],
            },
          ],
        };
      },
      content: allContent,
      styles: pdfStyles,
      defaultStyle: {
        fontSize: 10,
        font: 'Helvetica',
      },
    };

    try {
      const doc = new pdfMake({
        Courier: {
          normal: 'Courier',
          bold: 'Courier-Bold',
          italics: 'Courier-Oblique',
          bolditalics: 'Courier-BoldOblique',
        },
        Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique',
        },
      }).createPdfKitDocument(finalDocDef);

      const chunks = [];
      doc.on('data', function (chunk) {
        chunks.push(chunk);
      });
      doc.on('end', function () {
        resolve(Buffer.concat(chunks));
      });
      doc.end();
    } catch (e) {
      console.log(e);
    }
  });
}
