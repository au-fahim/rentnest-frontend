# RentNest API Integration

This document maps the RentNest frontend to the backend API.

## Project URLs

| Item | URL |
| --- | --- |
| Live frontend | https://rentnest-frontend-ten.vercel.app |
| Production backend | https://rent-nest-backend-lilac.vercel.app |
| Local backend | http://localhost:5000 |

Frontend API base variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://rent-nest-backend-lilac.vercel.app
```

## Admin Credentials

```env
ADMIN_EMAIL="admin@rentnest.com"
ADMIN_PASSWORD="admin123"
```

## Integration Structure

- Backend endpoint paths are centralized in `config/api-endpoints.ts`.
- API request handling is centralized in `lib/api/api-client.ts`.
- Feature-specific API functions are organized under `lib/api`.
- Auth session handling uses the backend JWT stored in an HttpOnly frontend cookie.
- Protected route and role access checks are handled by `proxy.ts`.
- Forms use React Hook Form with Zod validation.
- User feedback uses inline validation messages and Sonner toasts.

## API Mapping

### Authentication And Profile

| Frontend area | Backend endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Register page | `/api/auth/register` | `POST` | Register tenant or landlord accounts. Public admin registration is not available. |
| Login page | `/api/auth/login` | `POST` | Log in and receive the backend JWT. |
| Frontend session route | `/api/auth/session` | `POST` | Store the verified backend JWT in an HttpOnly cookie. |
| Header/user menu/profile page | `/api/users/profile` | `GET` | Load the authenticated user profile. |
| Profile page | `/api/users/profile` | `PATCH` | Update authenticated user profile details. |

### Public Property Pages

| Frontend area | Backend endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Home page | `/api/properties` | `GET` | Display featured available properties. |
| Properties page | `/api/properties` | `GET` | Display responsive property grid with `next/image`. |
| Property filters | `/api/properties?searchTerm=&location=&minPrice=&maxPrice=&categoryId=&amenities=` | `GET` | Filter by search, location, price, property type, and amenities. |
| Property details page | `/api/properties/:propertyId` | `GET` | Display full property details, image gallery, amenities, landlord info, and reviews. |
| Property category selects | `/api/categories` | `GET` | Load property type/category options. |

### Tenant Dashboard

| Frontend area | Backend endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Rental request form | `/api/requests` | `POST` | Submit a rental request for a property. |
| Tenant requests page | `/api/requests` | `GET` | Show tenant rental request history. |
| Payment page | `/api/requests/:rentalRequestId` | `GET` | Load approved rental request before payment. |
| Payment page | `/api/payments/create` | `POST` | Create a Stripe payment intent. |
| Stripe payment form | Stripe Elements | Client SDK | Collect card details and confirm the payment. |
| Payment confirmation | `/api/payments/confirm` | `POST` | Confirm successful Stripe payment with the backend. |
| Payment history page | `/api/payments` | `GET` | Show tenant payment history. |
| Tenant reviews page | `/api/reviews` | `POST` | Submit a review after eligible rental completion. |

### Landlord Dashboard

| Frontend area | Backend endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Landlord overview | `/api/properties/my-properties`, `/api/requests/landlord` | `GET` | Show landlord metrics and recent activity. |
| My properties page | `/api/properties/my-properties` | `GET` | Search, paginate, and manage landlord properties. |
| Create property page | `/api/properties` | `POST` | Create a property with amenities and image uploads. |
| Edit property page | `/api/properties/:propertyId` | `GET` | Load property data for editing. |
| Edit property form | `/api/properties/:propertyId` | `PATCH` | Update property details, availability, amenities, and images. |
| Property image management | `/api/properties/:propertyId/images/:imageId` | `DELETE` | Delete an existing property image. |
| Property actions | `/api/properties/:propertyId` | `DELETE` | Delete a property. |
| Incoming requests page | `/api/requests/landlord` | `GET` | Search and paginate landlord rental requests. |
| Request actions | `/api/requests/:rentalRequestId/status` | `PATCH` | Approve, reject, or complete rental requests. |
| Tenant history page | `/api/requests/landlord` | `GET` | View tenant and request history. |

### Admin Dashboard

| Frontend area | Backend endpoint | Method | Purpose |
| --- | --- | --- | --- |
| Admin overview | `/api/admin/users`, `/api/admin/properties`, `/api/admin/rentals` | `GET` | Show platform-level dashboard metrics. |
| User management page | `/api/admin/users` | `GET` | Search and paginate users. |
| User status action | `/api/admin/users/:userId` | `PATCH` | Ban or unban users. |
| Property management page | `/api/admin/properties` | `GET` | Search and paginate all properties. |
| Rental requests page | `/api/admin/rentals` | `GET` | Search and paginate all rental requests. |
| Category management page | `/api/categories` | `GET` | Display categories. |
| Category form | `/api/categories` | `POST` | Create a category. |
| Category form | `/api/categories/:categoryId` | `PATCH` | Update a category. |
| Category action | `/api/categories/:categoryId` | `DELETE` | Delete a category. |

## Payment Integration

- The project uses real Stripe Elements integration.
- Payment intents are created by the backend through `/api/payments/create`.
- Successful payments are confirmed through `/api/payments/confirm`.
- The frontend includes dedicated success and cancel routes at `/payment/success` and `/payment/cancel`.
- Failed Stripe attempts can be retried within the active browser payment session (10 Minutes).

## Error Handling And Validation

- API errors are normalized by `lib/api/api-client.ts`.
- Forms show Zod validation errors inline.
- Success and failure states use Sonner toast messages.
- Loading, empty, and error states are included across public pages and dashboards.
- App-level fallbacks are provided by `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, and loading files.
