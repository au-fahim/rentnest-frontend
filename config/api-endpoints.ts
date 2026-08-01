export const apiEndpoints = {
  health: "/",
  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
  },
  users: {
    profile: "/api/users/profile",
  },
  categories: {
    list: "/api/categories",
    create: "/api/categories",
    update: (categoryId: string) => `/api/categories/${categoryId}`,
    delete: (categoryId: string) => `/api/categories/${categoryId}`,
  },
  properties: {
    list: "/api/properties",
    details: (propertyId: string) => `/api/properties/${propertyId}`,
    create: "/api/properties",
    myProperties: "/api/properties/my-properties",
    update: (propertyId: string) => `/api/properties/${propertyId}`,
    deleteImage: (propertyId: string, imageId: string) =>
      `/api/properties/${propertyId}/images/${imageId}`,
    delete: (propertyId: string) => `/api/properties/${propertyId}`,
  },
  requests: {
    create: "/api/requests",
    tenantList: "/api/requests",
    details: (rentalRequestId: string) => `/api/requests/${rentalRequestId}`,
    landlordList: "/api/requests/landlord",
    updateStatus: (rentalRequestId: string) => `/api/requests/${rentalRequestId}/status`,
  },
  payments: {
    create: "/api/payments/create",
    confirm: "/api/payments/confirm",
    demoCard: "/api/payments/demo-card",
    list: "/api/payments",
    details: (paymentId: string) => `/api/payments/${paymentId}`,
  },
  reviews: {
    create: "/api/reviews",
  },
  admin: {
    users: "/api/admin/users",
    updateUser: (userId: string) => `/api/admin/users/${userId}`,
    properties: "/api/admin/properties",
    rentals: "/api/admin/rentals",
  },
} as const;
