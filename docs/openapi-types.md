# OpenAPI-generated TypeScript types

The UI calls the API through Axios. TypeScript types describe the API contract at development and build time, but they do not make HTTP requests or validate API responses at runtime.

## How the contract flows

1. The API defines controllers, request DTOs, response schemas, and Swagger metadata in NestJS.
2. When the API starts, it creates an OpenAPI document and serves it at `http://localhost:3001/openapi.json`. The interactive Swagger UI is available at `http://localhost:3001/docs`.
3. The UI script `scripts/generate-api-types.mjs` reads that document and passes it to `openapi-typescript`.
4. The generator writes TypeScript definitions to `src/interfaces/generated/api.ts`.
5. UI services and hooks can refer to those definitions so route names, query parameters, request bodies, and response shapes stay aligned with the API contract.

The generated file is checked into the UI repository. Normal UI startup and production builds use that file and do not require the API to be running. The API must be available when generating or refreshing the types.

## Generate or refresh the types

Start the API and its PostgreSQL database using the instructions in the API repository. From the UI repository, run:

```powershell
corepack yarn api:generate
```

The default source is `http://localhost:3001/openapi.json`. To use another API instance or a local OpenAPI JSON file, set `API_SPEC_URL` for that command:

```powershell
$env:API_SPEC_URL = 'http://localhost:3001/openapi.json'
corepack yarn api:generate
Remove-Item Env:API_SPEC_URL
```

For a local file, set `API_SPEC_URL` to its path, for example `C:\contracts\bookstore-openapi.json`. The generator accepts HTTP and HTTPS URLs or a local JSON file path.

After generation, inspect the changes and run:

```powershell
corepack yarn typecheck
corepack yarn sanitycheck
```

Commit the generated `src/interfaces/generated/api.ts` alongside any UI changes that depend on the updated contract.

## Using the generated types

The file exports a `paths` type keyed by API paths and HTTP methods. A component or service can derive its types from the route it uses instead of maintaining a duplicate interface:

```ts
import type { paths } from '@/interfaces/generated/api';

type BookQuery = NonNullable<paths['/books']['get']['parameters']['query']>;
```

The catalog uses this pattern for the supported books query parameters. Services continue to make requests through the shared Axios client; generated types provide compile-time guidance and do not change request behavior.

## Troubleshooting

- **Connection refused or fetch error:** start the API and verify `http://localhost:3001/openapi.json` opens in a browser. If the API uses another host or port, set `API_SPEC_URL`.
- **Types appear outdated:** rerun `corepack yarn api:generate`, inspect the generated diff, and run the UI typecheck.
- **Generation succeeds but a request fails at runtime:** generated types are compile-time only. Check the API URL, authentication, server logs, and actual response payload separately.
- **A generated type is missing:** confirm the controller route and DTO/response metadata are included in the API's OpenAPI document, then regenerate.
