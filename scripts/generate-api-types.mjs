import openapiTS, { astToString } from 'openapi-typescript';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = process.env.API_SPEC_URL ?? 'http://localhost:3001/openapi.json';
const output = 'src/interfaces/generated/api.ts';
const spec =
  source.startsWith('http://') || source.startsWith('https://')
    ? source
    : JSON.parse(await readFile(resolve(process.cwd(), source), 'utf8'));

function removeDocumentation(value) {
  if (Array.isArray(value)) {
    value.forEach(removeDocumentation);
    return;
  }
  if (value && typeof value === 'object') {
    delete value.description;
    delete value.summary;
    delete value.externalDocs;
    delete value.example;
    delete value.examples;
    Object.values(value).forEach(removeDocumentation);
  }
}

if (typeof spec !== 'string') removeDocumentation(spec);
const ast = await openapiTS(spec, { commentHeader: false });

await mkdir('src/interfaces/generated', { recursive: true });
const types = astToString(ast).replace(/\/\*\*[\s\S]*?\*\//g, '');
await writeFile(output, types);
console.log(`Generated API types from ${source} into ${output}`);
