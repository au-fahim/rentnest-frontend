export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";

export type RentalRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export type ApiResponse<TData> = {
  success: boolean;
  message: string;
  data: TData;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PropertyImage = {
  id: string;
  url: string;
  publicId: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  amenities: string[];
  isAvailable: boolean;
  imageUrl?: string | null;
  images?: PropertyImage[];
  landlordId: string;
  categoryId: string;
  landlord?: Pick<User, "id" | "name"> & Partial<Pick<User, "email">>;
  category?: Category;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
};

export type RentalRequest = {
  id: string;
  status: RentalRequestStatus;
  moveInDate: string;
  moveOutDate: string;
  tenantId: string;
  propertyId: string;
  tenant?: Pick<User, "id" | "name" | "email">;
  property?: Property;
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
};

export type Payment = {
  id: string;
  amount: number;
  transactionId: string;
  method: string;
  provider: string;
  status: PaymentStatus;
  paidAt: string | null;
  rentalRequestId: string;
  rentalRequest?: RentalRequest;
  createdAt: string;
  updatedAt: string;
};

export type PaymentIntentPayload = {
  paymentId: string;
  transactionId: string;
  clientSecret: string;
  amount: number;
  provider: string;
  status: PaymentStatus;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  tenantId: string;
  propertyId: string;
  tenant?: Pick<User, "id" | "name">;
  createdAt: string;
  updatedAt: string;
};
