# HopeRise Foundation – NGO Management & Public Website

A college internship project: a complete NGO web solution consisting of a **login/authentication system**, a **public-facing website** for the general public, and an **admin dashboard** for managing NGO operations.

## Project Structure

```
ngo/
├── index.html          # Admin dashboard (NGO management system)
├── styles.css          # Shared styles for the admin dashboard
├── app.js              # Dashboard logic (charts, modals, filters, navigation, auth guard)
├── login.html          # Login / Signup / Admin authentication page
├── login.css           # Login page styles
├── login.js            # Auth logic (localStorage users, sessions, validation)
├── README.md
└── user/               # Public-facing NGO website
    ├── index.html      # Public website (Home, Programs, Donate, Volunteer, etc.)
    ├── styles.css      # Public website styles
    └── app.js          # Public site logic (donation form, carousel, toasts, auth guard)
```

## Authentication System

The project has a **role-based frontend authentication system** (no backend):

| Role   | Login Page | Redirects To        |
|--------|------------|---------------------|
| User   | `login.html` (Login / Sign Up tabs) | `user/index.html` |
| Admin  | `login.html` (Admin tab) | `index.html` (dashboard) |

### Admin Credentials (built-in / hardcoded)
```
Email:    admin@hoperise.org
Password: admin123
```

### How it works
- **Sign Up** – users create an account (name, email, **Indian mobile number** `+91` format) and their data is saved to **localStorage** (`hoperise_users`)
- **User Login** – verifies against registered users, stores a session (`hoperise_session`), and redirects to the public website
- **Admin Login** – checks against the built-in admin credentials and redirects to the dashboard
- **Unauthorized access** – if a regular user tries to log in through the Admin tab (or visits the dashboard directly), they get an **"Unauthorized! Admin access only"** banner and are blocked
- **Logout** – clears the session and returns to the login page
- Pages are protected client-side: visiting the dashboard or website without a session redirects to `login.html`

## Features

### Admin Dashboard (`index.html`)
- **Dashboard** – key stats (donations, beneficiaries, active programs, volunteers), donation charts with monthly/weekly/yearly filters, fund allocation chart, recent donations, upcoming events
- **Programs** – program cards with category filters (Education, Healthcare, Environment, Community) and progress tracking
- **Donors** – donor table with search, filters, selection, pagination, and CSV-style export (Indian donors with +91 mobiles)
- **Events** – event cards with status badges (Upcoming / Scheduled / Completed)
- **Team** – team member cards with social links
- **Volunteers** – volunteer statistics and management
- **Gallery** – image gallery section
- Notifications panel, global search, sidebar navigation, and add/edit modals
- All amounts displayed in **Indian Rupee (₹) format** with Indian number grouping (e.g., ₹2,48,500)

### Public Website (`user/`)
- Hero section with impact stats
- About, Programs showcase, Impact counters (animated, ₹ format)
- Events carousel, success stories
- Donate form (one-time / monthly / yearly, custom amounts in ₹)
- Volunteer signup form, contact form, newsletter signup
- Partners strip, CTA banner, footer
- Shows the logged-in user's name/avatar with a logout option in the navbar

### Login Page (`login.html`)
- Tabbed interface: **Login** (user), **Sign Up**, **Admin**
- Indian mobile number validation (10 digits, starting with 6–9, formatted as `+91 XXXXX XXXXX`)
- Name validation and auto-capitalization
- Password strength check + show/hide password toggle
- Remember me (persistent session) support
- Unauthorized-access error banner

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure |
| **CSS3** (custom, no framework) | Styling, responsive layout, animations |
| **JavaScript (Vanilla ES6)** | Interactivity, DOM manipulation, auth, form handling |
| **localStorage / sessionStorage** | User accounts, sessions, remember-me |
| **Chart.js 4.4.0** (CDN) | Dashboard charts (donation trends, fund allocation) |
| **Font Awesome 6.4.0** (CDN) | Icons |
| **Google Fonts – Inter** (CDN) | Typography |
| **Unsplash / ui-avatars** (CDN) | Images and avatars (demo content) |

## Getting Started

No build tools or dependencies to install. Serve the project from a local HTTP server (required so the `user/` folder resolves correctly):

```bash
python -m http.server 8080
```

Then open:

```bash
# Login page (start here)
http://localhost:8080/login.html

# Admin dashboard (direct access redirects to login)
http://localhost:8080/index.html

# Public website (direct access redirects to login)
http://localhost:8080/user/
```

## Notes

- All data shown is **static demo/sample data** (no backend or database yet) – this is the UI prototype stage of the project.
- Authentication is **frontend-only** for demonstration purposes; real apps need server-side auth.
- The dashboard and public site are separate views of the same NGO brand (HopeRise Foundation).

## Future Scope

- Add a backend (e.g., Node.js/Express or Django) with a database (MongoDB/PostgreSQL/SQLite)
- Server-side authentication (JWT, password hashing)
- Real donation/payment gateway integration (UPI, Razorpay, etc.)
- Dynamic CRUD for programs, donors, events, and volunteers
