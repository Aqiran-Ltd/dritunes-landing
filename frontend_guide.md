# Frontend Integration Guide for Newsletter Workflow 🎨

With the move to frontend-handled verification, you need to implement two new routes in your Next.js/Flutter app. This ensures users stay on your domain and solves the API key issue.

## 📧 Email Newsletter Flow

### 1. Subscription Confirmation Page
**Route**: `{FRONTEND_URL}/newsletter/verify` (Query: `?token=...&email=...`)

**Implementation Details**:
- **Action**: On page mount, extract the `token` and `email` from the URL.
- **Backend Call**: Make a **GET** request to `{{base_url}}/api/v1/newsletter/verify?token=...&email=...`
- **Security**: Include the `x-api-key` in the request headers from your frontend.
- **UX**: Show a "Verifying your subscription..." loader, then a success message once the API responds.

### 2. Unsubscribe Page
**Route**: `{FRONTEND_URL}/newsletter/unsubscribe` (Query: `?email=...`)

**Implementation Details**:
- **Action**: Extract `email` from the URL.
- **Backend Call**: Make a **GET** request to `{{base_url}}/api/v1/newsletter/unsubscribe?email=...`
- **Security**: Include the `x-api-key` in the headers.
- **UX**: Show a "You have been successfully unsubscribed" message.

---

## 🛠️ Updated API Summary

| Endpoint | Method | Purpose | Headers |
|----------|--------|---------|---------|
| `/newsletter/subscribe` | POST | Request subscription (New fields: `name`, `phone`) | `x-api-key` |
| `/newsletter/verify` | GET | Confirm subscription | `x-api-key` |
| `/newsletter/unsubscribe` | GET | Opt-out of newsletter | `x-api-key` |
| `/postmark/webhook` | POST | (System) Handle Bounces/Spam | *None* |

---

## 🏗️ UI Recommendations
- **Resubscribe**: On the unsubscribe page, offer a "Resubscribe" button that leads back to the home page newsletter form.
- **Celebrate**: After successful verification, show a celebratory message like "Welcome to Dr iTunes Consult! 🎉"
- **Redirect**: After 5-10 seconds of showing the success message, consider redirecting the user back to your home page.
