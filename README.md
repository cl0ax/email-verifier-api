# 📧 Email Verifier API

A lightweight, fast, and easy-to-use API for validating email addresses by format.

---

## 🚀 Live Demo (Coming Soon)
> Deployment in progress — this will point to Vercel or RapidAPI once deployed.

---

## ✅ What It Does

This API checks whether an email is **syntactically valid** (RFC-compliant format) using regular expressions.

Future updates may include:
- MX record/domain validation
- API key gating
- Usage tracking and monetization (RapidAPI)

---

## 🔧 Endpoint

### `GET /api/validate-email`

**Query Parameters:**

| Param   | Required | Description                    |
|---------|----------|--------------------------------|
| `email` | ✅ Yes    | The email address to validate |

---

**Example Request:**  
`GET http://localhost:5000/api/validate-email?email=hello@gmail.com`

**Successful Response:**
```json
{
  "email": "hello@gmail.com",
  "isValid": true,
  "message": "✅ Valid email format"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Missing email parameter"
}
```

---

## 🛠 Tech Stack

- Node.js  
- Express.js  
- CORS, Helmet, Morgan  
- Regex-based email validation  

---

## 📦 Installation

```bash
git clone https://github.com/cl0ax/email-verifier-api.git
cd email-verifier-api
npm install
npm run dev
```

Then visit:  
`http://localhost:5000/api/validate-email?email=your@email.com`

---

## 📄 License

MIT — free to use, modify, and deploy.

---

## ✨ Author

Made by cl0ax — open to feedback, PRs, and good vibes.
