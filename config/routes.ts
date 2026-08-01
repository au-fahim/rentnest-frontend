import type { UserRole } from "@/types/domain";

export const appRoutes = {
  home: "/",
  properties: "/properties",
  propertyDetails: (id: string) => `/properties/${id}`,
  register: "/auth/register",
  login: "/auth/login",
  tenantDashboard: "/dashboard/tenant",
  tenantRequests: "/dashboard/tenant/requests",
  tenantPayments: "/dashboard/tenant/payments",
  tenantReviews: "/dashboard/tenant/reviews",
  tenantRequestPayment: (id: string) => `/dashboard/tenant/requests/${id}/pay`,
  landlordDashboard: "/dashboard/landlord",
  landlordProperties: "/dashboard/landlord/properties",
  landlordPropertyCreate: "/dashboard/landlord/properties/new",
  landlordPropertyEdit: (id: string) => `/dashboard/landlord/properties/${id}/edit`,
  landlordRequests: "/dashboard/landlord/requests",
  landlordHistory: "/dashboard/landlord/history",
  adminDashboard: "/dashboard/admin",
  adminUsers: "/dashboard/admin/users",
  adminProperties: "/dashboard/admin/properties",
  adminRequests: "/dashboard/admin/requests",
  adminCategories: "/dashboard/admin/categories",
  profile: "/dashboard/profile",
  paymentSuccess: "/payment/success",
  paymentCancel: "/payment/cancel",
} as const;

export const dashboardHomeByRole: Record<UserRole, string> = {
  TENANT: appRoutes.tenantDashboard,
  LANDLORD: appRoutes.landlordDashboard,
  ADMIN: appRoutes.adminDashboard,
};

export const protectedRouteAccess: Array<{
  prefix: string;
  roles: readonly UserRole[];
}> = [
  { prefix: "/dashboard/tenant", roles: ["TENANT"] },
  { prefix: "/dashboard/landlord", roles: ["LANDLORD"] },
  { prefix: "/dashboard/admin", roles: ["ADMIN"] },
  { prefix: "/dashboard/profile", roles: ["TENANT", "LANDLORD", "ADMIN"] },
  { prefix: "/payment", roles: ["TENANT"] },
];

export const roleDashboardLinks: Record<
  UserRole,
  Array<{
    href: string;
    label: string;
  }>
> = {
  TENANT: [
    { href: appRoutes.tenantDashboard, label: "Overview" },
    { href: appRoutes.tenantRequests, label: "Rental requests" },
    { href: appRoutes.tenantPayments, label: "Payment history" },
    { href: appRoutes.tenantReviews, label: "Reviews" },
  ],
  LANDLORD: [
    { href: appRoutes.landlordDashboard, label: "Overview" },
    { href: appRoutes.landlordProperties, label: "My properties" },
    { href: appRoutes.landlordRequests, label: "Requests" },
    { href: appRoutes.landlordHistory, label: "Tenant history" },
  ],
  ADMIN: [
    { href: appRoutes.adminDashboard, label: "Overview" },
    { href: appRoutes.adminUsers, label: "Users" },
    { href: appRoutes.adminProperties, label: "Properties" },
    { href: appRoutes.adminRequests, label: "Requests" },
    { href: appRoutes.adminCategories, label: "Categories" },
  ],
};
