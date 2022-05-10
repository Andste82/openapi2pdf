# OpenApi2Pdf

Converts a openapi spec file to pdf. Based on [RapiPDF](https://github.com/mrin9/RapiPdf)

## Features

- Supports Swagger 2.0 and OpenAPI 3.0
- Support YAML and JSON format
- Support $ref (thx to swagger-parser)
- Plenty of customizing options, including selection of brand colors

## Usage

```bash
npm install -g openapi2pdf

openapi2pdf --spec ~/home/openapi-spec.json --out ~/home/pdf-spec.pdf
```

## Licence

OpenApi2Pdf is [MIT licensed](LICENSE).
