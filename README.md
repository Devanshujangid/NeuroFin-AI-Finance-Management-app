
# NeuroFin — AI-Powered Personal Finance Tracker

NeuroFin is a full-stack AI-powered personal finance management platform designed to help users track transactions, manage multiple accounts, monitor budgets, analyze spending patterns, and automate financial workflows.

The application combines **Next.js, TypeScript, PostgreSQL, Gemini AI, Inngest, Clerk, Supabase, and Arcjet** to build a secure, automated, and scalable finance management system.

---

## 🚀 Live Application

🔗 **Live Demo:** Launching Soon

🔗 **GitHub:** https://github.com/Devanshujangid/NeuroFin-AI-Finance-Management-app

---

## ✨ Why NeuroFin?

Traditional expense trackers mainly record transactions.

NeuroFin goes further by combining:

- Automated financial monitoring
- AI-powered receipt processing
- AI-generated financial recommendations
- Multi-account transaction management
- Budget monitoring
- Automated background workflows
- Email-based financial alerts
- API rate limiting
- Spending analytics

The goal is to create a finance platform where users don't just **record their finances**, but can also **understand and act on them**.

---

# 🧠 Core Features

## 🔐 Authentication & Authorization

NeuroFin uses **Clerk** for authentication and user identity management.

Users can securely:

- Sign up
- Sign in
- Access protected application routes
- Manage their own financial data

All server-side operations verify the authenticated user's identity before modifying financial records.

---

## 💳 Multi-Account Management

Users can manage multiple financial accounts from a single dashboard.

Examples:

- Bank Account
- Cash
- Savings
- Credit Account
- Other financial accounts

Each account maintains its own:

- Balance
- Transactions
- Budget
- Financial activity

The backend validates account ownership before performing transaction operations.

---

# 💸 Transaction Management

NeuroFin provides complete transaction management.

Users can:

- Create transactions
- Edit transactions
- Delete transactions
- Bulk delete transactions
- Categorize transactions
- Add descriptions
- Set transaction dates
- Mark transactions as recurring
- Record income and expenses

Transaction creation follows a secure backend flow:

```text
Client
   ↓
Transaction Form
   ↓
Next.js Server Action
   ↓
Authentication
   ↓
Authorization
   ↓
Arcjet Rate Limiting
   ↓
Database Validation
   ↓
Transaction Insert
   ↓
Account Balance Update
   ↓
Cache Revalidation
   ↓
Updated UI
````

---

# 📊 Financial Dashboard

The dashboard provides a centralized view of the user's financial activity.

It includes:

* Total account balances
* Income
* Expenses
* Budget progress
* Transaction analytics
* Spending trends
* Account-level financial information

The application dynamically revalidates relevant pages after financial mutations so that users see updated information without manually refreshing the application.

---

# 🎯 Budget Management

Users can create and manage budgets for their accounts.

Budget functionality includes:

* Budget creation
* Budget editing
* Budget progress tracking
* Spending monitoring
* Budget threshold detection
* Automated budget alerts

The system continuously evaluates spending against configured budgets.

---

# 🤖 AI-Powered Financial Intelligence

NeuroFin integrates **Google Gemini API** to introduce AI capabilities into the finance workflow.

Instead of treating AI as a simple chatbot, the application uses AI for structured financial processing.

---

## 🧾 AI Receipt Scanner

Users can upload a receipt and let Gemini extract transaction information automatically.

### Processing Pipeline

```text
Receipt Image
      ↓
Image Upload
      ↓
Server-side Processing
      ↓
Base64 Conversion
      ↓
Gemini Vision
      ↓
Prompt Engineering
      ↓
Structured JSON
      ↓
Validation
      ↓
Transaction Form Auto-Fill
```

The system extracts information such as:

* Merchant
* Amount
* Category
* Date
* Description

This significantly reduces manual transaction entry.

---

# 🧠 AI Financial Recommendations

NeuroFin also uses Gemini to generate financial recommendations from structured spending information.

The application converts spending signals into structured AI output instead of relying on unstructured text.

Example:

```text
Financial Data
      ↓
Spending Signals
      ↓
Gemini API
      ↓
Prompt
      ↓
Structured JSON
      ↓
Financial Insights
      ↓
Dashboard
```

This allows AI-generated insights to be consumed reliably by the application UI.

---

# ⚡ Event-Driven Automation

NeuroFin uses **Inngest** for background and event-driven workflows.

Instead of performing long-running automation directly inside user requests, background processing is separated from the main request-response lifecycle.

Example:

```text
User Financial Activity
        ↓
Application Event
        ↓
Inngest
        ↓
Background Processing
        ↓
Budget Evaluation
        ↓
Alert Decision
        ↓
Email Notification
```

This architecture improves reliability and prevents background work from unnecessarily blocking user-facing requests.

---

# 📧 Automated Email Notifications

NeuroFin integrates **Resend** for transactional email delivery.

Automated emails can be generated for important financial events such as:

* Budget threshold alerts
* Financial notifications
* Monthly financial reports

Budget monitoring includes protection against repeatedly sending the same alert when the user remains within the same risk level.

---

# 🛡️ API Rate Limiting

NeuroFin uses **Arcjet** to protect backend operations from excessive requests.

The transaction creation endpoint is protected using a **Token Bucket** rate-limiting strategy.

Current configuration:

```text
Capacity       → 10 requests
Refill Rate    → 10 tokens
Interval       → 1 minute
Mode           → LIVE
Characteristic → Clerk userId
```

Conceptually:

```text
User Request
     ↓
Clerk Authentication
     ↓
Arcjet
     ↓
Token Bucket
     ↓
 ┌───────────────┐
 │ Token Available│
 └───────┬───────┘
         ↓
       ALLOW
         ↓
   Process Request


No Token
     ↓
    DENY
     ↓
Request stops
     ↓
Database is not modified
```

Rate limiting is performed before the database mutation, ensuring that rejected requests do not create transactions or modify account balances.

---

# 🗄️ Database Architecture

NeuroFin uses **PostgreSQL through Supabase** as its primary database.

The data model is centered around users, accounts, transactions, and budgets.

Simplified relationship:

```text
User
 │
 ├── Account
 │     │
 │     ├── Transactions
 │     │
 │     └── Budget
 │
 ├── Account
 │     │
 │     ├── Transactions
 │     │
 │     └── Budget
 │
 └── ...
```

The application enforces ownership checks at the backend layer before performing account or transaction operations.

---

# 🏗️ Application Architecture

NeuroFin follows a modern Next.js full-stack architecture.

```text
                         ┌──────────────────┐
                         │     Browser      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js UI    │
                         │ React + TS       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Server Actions  │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  Clerk   │ │  Arcjet  │ │ Business │
              │   Auth   │ │ Security │ │  Logic   │
              └──────────┘ └──────────┘ └────┬─────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  Supabase   │
                                      │ PostgreSQL  │
                                      └─────────────┘

              Background Processing
                       │
                       ▼
                  ┌──────────┐
                  │ Inngest  │
                  └────┬─────┘
                       │
                ┌──────┴──────┐
                ▼             ▼
             Resend         Gemini
             Emails           AI
```

---

# 📁 Project Structure

```text
neurofin/
│
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── (main)/
│   │   ├── account/
│   │   ├── dashboard/
│   │   └── transaction/
│   │
│   ├── api/
│   │   └── inngest/
│   │
│   └── globals.css
│
├── components/
│   ├── dashboard/
│   ├── transaction/
│   ├── landing/
│   └── ui/
│
├── lib/
│   ├── actions/
│   │   ├── create-account.ts
│   │   ├── create-budget.ts
│   │   ├── create-transaction.ts
│   │   ├── update-transaction.ts
│   │   ├── delete-transaction.ts
│   │   └── ...
│   │
│   ├── ai/
│   │   ├── gemini.ts
│   │   └── generate-recommendation.ts
│   │
│   ├── inngest/
│   │   ├── client.ts
│   │   └── functions.ts
│   │
│   ├── arcjet.ts
│   ├── account.ts
│   ├── transactions.ts
│   ├── ensure-user.ts
│   ├── supabase-server.ts
│   └── utils.ts
│
├── emails/
│   └── BudgetAlertEmails.tsx
│
├── middleware.ts
├── package.json
└── README.md
```

---

# 🛠️ Technology Stack

| Technology   | Purpose                          |
| ------------ | -------------------------------- |
| Next.js      | Full-stack application framework |
| React        | User interface                   |
| TypeScript   | Type safety                      |
| Tailwind CSS | Styling                          |
| shadcn/ui    | UI components                    |
| Clerk        | Authentication                   |
| Supabase     | PostgreSQL database              |
| Prisma       | Database ORM                     |
| Gemini API   | AI processing                    |
| Inngest      | Background workflows             |
| Arcjet       | Rate limiting & security         |
| Resend       | Email delivery                   |
| Recharts     | Financial analytics              |
| Vercel       | Deployment                       |

---

# 🔒 Security Architecture

Security is implemented at multiple layers.

### Authentication

Clerk verifies the user's identity.

### Authorization

Backend operations verify that the requested account or transaction belongs to the authenticated user.

### Rate Limiting

Arcjet limits excessive requests before database mutations occur.

### Server-side Validation

Critical operations are performed through server-side actions rather than trusting client-side input.

### Database Isolation

Queries include user ownership constraints where required.

---

# ⚙️ Performance & Reliability

NeuroFin uses several techniques to improve application reliability:

* Server-side data access
* Database query optimization
* Next.js cache revalidation
* Background processing with Inngest
* API rate limiting
* Structured AI responses
* Duplicate alert prevention
* Server-side authorization checks

Long-running or automated processes are separated from user-facing operations whenever appropriate.

---

# 🧪 Testing Strategy

Important workflows are verified through functional and integration testing.

### Transaction Testing

* Create transaction
* Edit transaction
* Delete transaction
* Bulk delete
* Income transaction
* Expense transaction
* Account balance updates
* Invalid transaction ID
* Unauthorized access

### Budget Testing

* Budget creation
* Budget updates
* Threshold detection
* Alert generation
* Duplicate alert prevention

### AI Testing

* Restaurant receipts
* Shopping receipts
* Invalid images
* Large images
* Structured JSON extraction
* AI failure handling

### Security Testing

* Authenticated requests
* Unauthorized requests
* Rate-limit enforcement
* Blocked requests
* Database integrity after blocked requests

---

# 📈 Scalability Considerations

The architecture is designed to separate responsibilities across different systems.

```text
Frontend
   ↓
Next.js
   ↓
Server Actions
   ↓
Supabase
```

while background processing is handled independently:

```text
Events
  ↓
Inngest
  ↓
Background Jobs
  ↓
Resend / Gemini
```

This separation allows expensive or asynchronous operations to be handled independently from interactive user requests.

Arcjet provides an additional protection layer against abusive request patterns.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd neurofin
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

ARCJET_KEY=

GEMINI_API_KEY=

RESEND_API_KEY=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

Use the appropriate credentials from each service.

Never commit secrets or `.env` files to GitHub.

## 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔄 Core Transaction Flow

A transaction creation request follows this sequence:

```text
User
 ↓
Transaction Form
 ↓
createTransaction()
 ↓
Clerk auth()
 ↓
Verify userId
 ↓
Arcjet request()
 ↓
Arcjet protect()
 ↓
Rate Limit Decision
 ↓
Account Ownership Check
 ↓
Insert Transaction
 ↓
Update Account Balance
 ↓
Revalidate Pages
 ↓
Return Success
```

If Arcjet denies the request:

```text
Request
  ↓
Arcjet
  ↓
DENY
  ↓
Throw Error
  ↓
No Transaction Insert
  ↓
No Balance Update
```

---

# 🎯 Engineering Highlights

NeuroFin demonstrates practical implementation of:

* Full-stack Next.js architecture
* Type-safe React development
* Server Actions
* Authentication and authorization
* Relational database design
* Multi-account financial modeling
* AI-powered document processing
* Structured LLM outputs
* Prompt engineering
* Event-driven architecture
* Background job processing
* Transactional email workflows
* API rate limiting
* Cache revalidation
* Error handling
* Production-oriented security practices

---

# 🗺️ Future Roadmap

Planned improvements include:

* Recurring transaction automation
* Monthly financial reports
* Expense category visualization
* Advanced bot protection
* AI finance assistant
* CSV transaction export
* Financial goals
* Budget history
* Search and filtering
* Dark mode
* PWA support
* Multi-currency support
* Premium plans

---

# 👨‍💻 Author

**Devanshu**

Computer Science Engineering Student

### Project

**NeuroFin — AI-Powered Personal Finance Tracker**

Built with:

`Next.js` · `React` · `TypeScript` · `Supabase` · `PostgreSQL` · `Gemini` · `Inngest` · `Arcjet` · `Clerk`

---

## ⭐ If you find the project interesting

Feel free to explore the repository, review the architecture, and experiment with the application.

```


```
