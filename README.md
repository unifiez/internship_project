# HopeRise Foundation – NGO Management & Public Website

A college internship project: a complete NGO web solution consisting of a **public-facing website** for the general public and an **admin dashboard** for managing NGO operations.

## Project Structure

```
ngo/
├── index.html          # Admin dashboard (NGO management system)
├── styles.css          # Shared styles for the admin dashboard
├── app.js              # Dashboard logic (charts, modals, filters, navigation)
└── user/               # Public-facing NGO website
    ├── index.html      # Public website (Home, Programs, Donate, Volunteer, etc.)
    ├── styles.css      # Public website styles
    └── app.js          # Public site logic (donation form, carousel, toasts, etc.)
```

## Features

### Admin Dashboard (`index.html`)
- **Dashboard** – key stats (donations, beneficiaries, active programs, volunteers), donation charts with monthly/weekly/yearly filters, fund allocation chart, recent donations, upcoming events
- **Programs** – program cards with category filters (Education, Healthcare, Environment, Community) and progress tracking
- **Donors** – donor table with search, filters, selection, pagination, and CSV-style export
- **Events** – event cards with status badges (Upcoming / Scheduled / Completed)
- **Team** – team member cards with social links
- **Volunteers** – volunteer statistics and management
- **Gallery** – image gallery section
- Notifications panel, global search, sidebar navigation, and add/edit modals

### Public Website (`user/`)
- Hero section with impact stats
- About, Programs showcase, Impact counters (animated)
- Events carousel, success stories
- Donate form (one-time / monthly / yearly, custom amounts)
- Volunteer signup form, contact form, newsletter signup
- Partners strip, CTA banner, footer

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Page structure |
| **CSS3** (custom, no framework) | Styling, responsive layout, animations |
| **JavaScript (Vanilla ES6)** | Interactivity, DOM manipulation, form handling |
| **Chart.js 4.4.0** (CDN) | Dashboard charts (donation trends, fund allocation) |
| **Font Awesome 6.4.0** (CDN) | Icons |
| **Google Fonts – Inter** (CDN) | Typography |
| **Unsplash / ui-avatars** (CDN) | Images and avatars (demo content) |

## Getting Started

No build tools or dependencies to install. Just open the pages in a browser:

```bash
# Public website
open user/index.html

# Admin dashboard
open index.html
```

Or serve locally, e.g.:

```bash
python -m http.server 8080
# then visit http://localhost:8080/user/ and http://localhost:8080/
```

## Notes

- All data shown is **static demo/sample data** (no backend or database yet) – this is the UI prototype stage of the project.
- The dashboard and public site are separate views of the same NGO brand (HopeRise Foundation).
- `presentation.tex` contains the project presentation (LaTeX).

## Future Scope

- Add a backend (e.g., Node.js/Express or Django) with a database (MongoDB/PostgreSQL/SQLite)
- User authentication (admin login, volunteer registration)
- Real donation/payment gateway integration
- Dynamic CRUD for programs, donors, events, and volunteers
