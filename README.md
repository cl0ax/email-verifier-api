# Email Domain Verifier API

This local Express API checks an email address in two steps:

1. Validate its basic syntax.
2. Resolve the domain's DNS MX records.

It does not prove that a mailbox exists, send verification mail, or connect to a mail server. The API is not deployed as a public service.

## Endpoint

```text
GET /api/validate-email?email=name@example.com
```

An address with valid syntax and MX records returns:

```json
{
  "email": "name@example.com",
  "domain": "example.com",
  "formatValid": true,
  "domainHasMx": true,
  "isValid": true,
  "mxRecords": [
    { "exchange": "mail.example.com", "priority": 10 }
  ],
  "message": "Valid format and MX records found"
}
```

`isValid` means only that the syntax passed and the domain published at least one MX record.

Missing `email` parameters return HTTP 400. Invalid syntax and domains without MX records return HTTP 200 with `isValid: false` so clients receive the same response shape for completed checks. Unexpected DNS failures go through the Express error handler.

## Run locally

```bash
npm install
npm start
```

The server listens on port 5000 by default:

```bash
curl 'http://localhost:5000/api/validate-email?email=hello@gmail.com'
```

Set `PORT` to use another port.

## Test

```bash
npm test -- --runInBand
```

The automated tests mock DNS results for repeatability. Live results depend on the machine's DNS resolver and the domain's current MX records.

## Stack

- Node.js
- Express
- `node:dns` promises API
- CORS, Helmet, and Morgan
- Jest and Supertest

## Origin

This repository began from the `express-api-starter` scaffold. The API routes, verification behavior, tests, metadata, and documentation have been adapted for this project. The original scaffold's MIT copyright is retained in `LICENSE`.
