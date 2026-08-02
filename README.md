# 🏡 RentNest Frontend

RentNest is a production-style rental property marketplace. The application connects to a real backend API and supports public property browsing, tenant rental requests and payments, landlord property management, and admin moderation.

Live frontend: https://rentnest-frontend-ten.vercel.app

Backend API: https://rent-nest-backend-lilac.vercel.app

## Documentation

API integration map: `API_INTEGRATION.md`

## Admin Credentials

Use these credentials to test the admin dashboard:

```text
Email: admin@rentnest.com
Password: admin123
```

## Core Features

- Public property browsing with optimized `next/image` images.
- Advanced property filters for search, location, price range, property type, and searchable multi-select amenities.
- Property details page with image gallery, landlord information, amenities, reviews, and rental request CTA.
- Tenant dashboard for rental requests, payment history, and completed-rental reviews.
- Landlord dashboard for property CRUD, Cloudinary image upload UI, image deletion, request approval/rejection, and tenant history.
- Admin dashboard for platform overview, user management, category management, property moderation, and rental request moderation.
- Stripe Elements payment flow with dedicated success and cancel pages.
- Custom JWT authentication with HttpOnly cookies, protected routes, and role-based navigation.
- Responsive UI, dark/light theme, loading states, empty states, validation errors, and toast feedback.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Shadcn UI-style Radix primitives
- React Hook Form and Zod
- TanStack Query v5
- TanStack Table
- Stripe Elements
- Sonner
- Lucide React
- next-themes
- Framer Motion
- Recharts
- Custom JWT auth with HttpOnly cookies

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
JWT_ACCESS_SECRET=your_backend_jwt_secret
```

For local development with the deployed backend, use:

```env
NEXT_PUBLIC_API_BASE_URL=https://rent-nest-backend-lilac.vercel.app
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Production Environment

Use these values on Vercel:

```env
NEXT_PUBLIC_APP_URL=https://rentnest-frontend-ten.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://rent-nest-backend-lilac.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
JWT_ACCESS_SECRET=your_backend_jwt_secret
```

Do not expose backend-only secrets in public frontend variables.

## User Guide

Public users can browse properties from the home page or the properties page. They can filter by text search, location, price range, property type, and exact amenities using the searchable multi-select field.

Tenants can register, log in, request a property from the property details page, track request status from the tenant dashboard, pay through Stripe after landlord approval, view payment history, and leave reviews for completed rentals.

Landlords can register, log in, create listings, upload up to 6 property images, preview selected uploads, reorder images before submission, remove wrong files, update listings, manage availability, approve or reject rental requests, and view tenant history.

Admins can log in with the provided admin credentials, review platform metrics, search and paginate users, ban or unban users, manage categories, inspect properties, and monitor rental requests.

## Payment Flow

RentNest uses Stripe Elements for frontend payment collection.

Tenant payment journey:

```text
Approved rental request -> Pay Now -> Stripe Elements -> Backend confirmation -> Success page
```

Use Stripe test cards in development, for example:

```text
4242 4242 4242 4242
Any future expiry date
Any CVC
Any ZIP/postal code
```

Cancelled or failed payments are handled by the cancel page and user-friendly toast messages.

## Important Routes

```text
/properties
/properties/[id]
/auth/register
/auth/login
/dashboard/tenant
/dashboard/tenant/requests
/dashboard/tenant/payments
/dashboard/tenant/reviews
/dashboard/landlord
/dashboard/landlord/properties
/dashboard/landlord/requests
/dashboard/landlord/history
/dashboard/admin
/dashboard/admin/users
/dashboard/admin/properties
/dashboard/admin/requests
/dashboard/admin/categories
/payment/success
/payment/cancel
```

## Acknowledgements

- [Shadcn UI](https://shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest/)
- [TanStack Table](https://tanstack.com/table/v8/)
- [Stripe](https://stripe.com/)
- [Sonner](https://sonner.npmjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Lucide React](https://lucide.dev/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)

---

## ⭐ Support

If you found this project useful, please consider giving it a **Star ⭐** on GitHub.

It helps support my work and encourages future improvements.

---