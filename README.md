# HopeRise Foundation – NGO Management & Public Website

A college internship project: a complete NGO web solution consisting of a **login/authentication system**, a **public-facing website** for the general public, and an **admin dashboard** for managing NGO operations.

## Project Structure

```
ngo/
├── index.html          # Public NGO website (Home, Programs, Donate, Volunteer, etc.)
├── styles.css          # Public website styles
├── app.js              # Public site logic (donation form, carousel, toasts, login gates)
├── _redirects          # Netlify URL redirects
├── admin/              # Admin dashboard (NGO management system)
│   ├── index.html      # Dashboard (stats, fund allocation, donors, events, team, etc.)
│   ├── styles.css      # Dashboard styles
│   └── app.js          # Dashboard logic (modals, filters, navigation, auth guard, donor CRUD)
├── login/              # Login / Signup / Admin authentication page
│   ├── login.html      # Authentication page (matches website theme)
│   ├── login.css       # Login page styles
│   └── login.js        # Auth logic (localStorage users, sessions, validation)
└── README.md
```

## Authentication System

The project has a **role-based frontend authentication system** (no backend):

| Role   | Login Page | Redirects To        |
|--------|------------|---------------------|
| User   | `login/login.html` (Login / Sign Up tabs) | `/` (public website) |
| Admin  | `login/login.html` (Admin tab) | `admin/index.html` (dashboard) |

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
- The public website is open to all; the admin dashboard is protected client-side (visiting it without a session redirects to `login/`)

## Features

### Admin Dashboard (`admin/`)
- **Dashboard** – key stats (donations, beneficiaries, active programs, volunteers), **fund allocation progress card**, recent donations, and upcoming events
- **Programs** – program cards with category filters (Education, Healthcare, Environment, Community) and progress tracking
- **Donors** – full donor management with search, filters, selection, pagination, CSV export, and **working View / Edit / Delete / Add actions**:
  - **View** – opens a Donor Details modal (avatar, name, mobile, amount, program, status, notes) with a quick "Edit Donor" shortcut
  - **Edit** – pre-fills the donor form with the row's data and updates the row in place on save
  - **Delete** – confirm prompt, then removes the row with animation and updates the pagination count
  - **Add Donor** – appends a new row to the table (avatar, ₹ amount, badges) and updates pagination
- **Events** – event cards with status badges (Upcoming / Scheduled / Completed)
- **Team** – team member cards with social links
- **Volunteers** – volunteer statistics and management
- **Gallery** – image gallery section
- Notifications panel, global search, sidebar navigation, and add/edit modals
- All amounts displayed in **Indian Rupee (₹) format** with Indian number grouping (e.g., ₹2,48,500)
- Indian donor data (+91 mobiles, Indian names)

### Public Website (root `/`)
- Hero section with impact stats
- About, Programs showcase, Impact counters (animated, ₹ format)
- Events carousel, success stories
- Donate form (one-time / monthly / yearly, custom amounts in ₹)
- Volunteer signup form, contact form, newsletter signup
- Partners strip, CTA banner, footer
- Shows the logged-in user's name/avatar with a logout option in the navbar (desktop & mobile)
- Public — no login required to browse; login is only needed for donations and volunteer signup

### Login Page (`login/`)
- Tabbed interface: **Login** (user), **Sign Up**, **Admin**
- Styled to match the HopeRise website theme (same colors, fonts, buttons, and design tokens)
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
| **Font Awesome 6.4.0** (CDN) | Icons |
| **Google Fonts – Inter** (CDN) | Typography |
| **Unsplash / ui-avatars** (CDN) | Images and avatars (demo content) |

## Getting Started

No build tools or dependencies to install. Serve the project from a local HTTP server:

```bash
python -m http.server 8080
```

Then open:

```bash
# Public website (open to everyone, no login required)
http://localhost:8080/

# Login page (needed for donations, volunteer signup, and admin access)
http://localhost:8080/login/login.html

# Admin dashboard (direct access redirects to login)
http://localhost:8080/admin/
```

## Deployment (Netlify)

This project is deployed on Netlify. The root `index.html` IS the public NGO website, so the base URL opens the website directly:

- **`/`** → public NGO website — no login required
- **`/admin/`** → admin dashboard (login required)
- **`/login/`** → login / signup / admin authentication page

The `_redirects` file handles clean URLs:

```
/login  /login/login.html  200
/login/  /login/login.html  200
```

## Notes

- All data shown is **static demo/sample data** (no backend or database yet) – this is the UI prototype stage of the project.
- Authentication is **frontend-only** for demonstration purposes; real apps need server-side auth.
- The dashboard and public site are separate views of the same NGO brand (HopeRise Foundation).

## Future Scope

- Add a backend (e.g., Node.js/Express or Django) with a database (MongoDB/PostgreSQL/SQLite)
- Server-side authentication (JWT, password hashing)
- Real donation/payment gateway integration (UPI, Razorpay, etc.)
- Dynamic CRUD for programs, events, and volunteers (currently donor CRUD is implemented)
