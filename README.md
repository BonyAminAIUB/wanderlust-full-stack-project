# Wanderlust

A full-stack travel and destination booking web application where users can explore curated destinations, add new travel spots, and manage their personal bookings. Built with a decoupled architecture using Next.js on the frontend and a dedicated Express.js & MongoDB REST API on the backend.

**Live Demo:** [https://wanderlust-bony8.vercel.app](https://wanderlust-bony8.vercel.app)  

---

## Overview

Wanderlust was built to practice real-world full-stack architecture—connecting a modern Next.js (App Router) client with an independently deployed Express.js backend and MongoDB Atlas database. Instead of keeping everything tightly coupled in one server, authentication is handled with Better Auth (supporting both credentials, Google OAuth and GitHub OAuth), while protected API requests between the frontend and backend are secured using JWT bearer tokens.

---

## Key Features

- **Browse & Explore Destinations:** View featured destinations on the home page, browse the full catalog, and open dedicated detail pages for each location.
- **Add New Destinations:** Authenticated users can contribute new destinations directly to the platform.
- **Booking Management:** Book travel destinations and view or cancel active reservations from the **My Bookings** dashboard.
- **Authentication & Route Protection:**
  - Email/Password sign-up and login
  - Google and GutHub OAuth integration
  - Route protection via Next.js middleware (`proxy.ts`)
  - User profile view with secure sign-out and automatic redirect
- **Responsive UI & Feedback:** Clean, mobile-friendly interface styled with Tailwind CSS and shadcn/ui, paired with real-time toast notifications for user actions.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (App Router, Turbopack), React, TypeScript, Tailwind CSS, shadcn/ui, React Toastify |
| **Authentication** | Better Auth, JWT (Bearer Token), Google OAuth, GitHub OAuth |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB (MongoDB Atlas) |
| **Deployment** | Vercel (separate deployments for frontend and backend) |

---

## Challenges & What I Learned

Building and shipping a decoupled full-stack app brought up a few practical hurdles that taught me a lot during debugging:

1. **Securing an External Express API with Better Auth JWTs**  
   Since the backend runs as a separate Express server, passing user sessions wasn't automatic. Initially, protected server-side fetches (such as Destination Details and My Bookings) threw `401 Unauthorized` errors. I solved this by extracting the Better Auth JWT token on the server and forwarding it via the `Authorization: Bearer <token>` header, then verifying it inside the Express middleware.

2. **Next.js Dynamic Data Fetching vs. Static Prerendering**  
   During production builds (`npm run build`), Next.js attempted to statically prerender routes that relied on live database data using `cache: "no-store"`, triggering `DYNAMIC_SERVER_USAGE` errors in the build logs. Explicitly configuring dynamic rendering (`export const dynamic = "force-dynamic"`) ensured fresh data on every request without breaking builds.

3. **Decoupled Vercel Deployments & Runtime `SyntaxError` Debugging**  
   Deploying the frontend and Express backend as two separate Vercel projects came with subtle production issues—most notably a `500` `SyntaxError: Unexpected token '<'` on the live home page. Tracing the Vercel runtime logs revealed that **Vercel Deployment Protection** on the backend was intercepting server-to-server `fetch` calls and returning an HTML login page instead of JSON. Disabling Deployment Protection on the API project, properly configuring `vercel.json` for Express, and syncing production environment variables (`NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`, and MongoDB Atlas IP access) resolved it cleanly.

---

## Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/BonyAminAIUB/wanderlust-full-stack-project.git
cd wanderlust-full-stack-project
```

### 2. Setup the Backend (`wanderlust-server`)

```bash
cd wanderlust-server
npm install
```

Create a `.env` file inside `wanderlust-server` and add your credentials:

```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend (`wanderlust`)

Open a new terminal from the project root:

```bash
cd wanderlust
npm install
```

Create a `.env.local` file inside `wanderlust`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
MONGODB_URI=your_mongodb_atlas_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Upcoming Updates (Roadmap)

- [ ] **Forgot Password & Reset Password Flow:** Email-based password recovery using Better Auth (planned for the next update).
- [ ] **Search & Filtering:** Filter destinations by location, category, and budget range.
- [ ] **Booking Status & Payment Integration:** Expand booking workflows with checkout support.

---

## Author

**Md Bony Amin**  
- GitHub: [@BonyAminAIUB](https://github.com/BonyAminAIUB)
