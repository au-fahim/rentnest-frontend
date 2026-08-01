import { z } from "zod";

export const roleSchema = z.enum(["TENANT", "LANDLORD", "ADMIN"]);
export const publicRegisterRoleSchema = z.enum(["TENANT", "LANDLORD"]);

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(80),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/\d/, "Password must include a number."),
  role: publicRegisterRoleSchema,
});

export const propertyFilterSchema = z.object({
  searchTerm: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  categoryId: z.string().optional(),
  amenities: z.string().optional(),
});

export const rentalRequestSchema = z
  .object({
    propertyId: z.string().min(1, "Property is required."),
    moveInDate: z.string().min(1, "Move-in date is required."),
    moveOutDate: z.string().min(1, "Move-out date is required."),
  })
  .refine((data) => new Date(data.moveOutDate) > new Date(data.moveInDate), {
    message: "Move-out date must be after move-in date.",
    path: ["moveOutDate"],
  });

export const reviewSchema = z.object({
  propertyId: z.string().min(1, "Property is required."),
  rating: z.coerce.number().int().min(1, "Choose at least 1 star.").max(5),
  comment: z.string().min(10, "Review must be at least 10 characters.").max(500),
});

export const propertySchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters.").max(120),
  description: z.string().min(20, "Description must be at least 20 characters.").max(1000),
  price: z.coerce.number().positive("Price must be greater than 0."),
  location: z.string().min(3, "Location is required.").max(160),
  categoryId: z.string().min(1, "Choose a category."),
  amenities: z.string().min(2, "Add at least one amenity."),
  isAvailable: z.boolean().default(true),
});

export const requestStatusSchema = z.object({
  rentalRequestId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "COMPLETED"]),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(80),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required.").max(80),
  description: z.string().max(300).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyFilterInput = z.infer<typeof propertyFilterSchema>;
export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type RequestStatusInput = z.infer<typeof requestStatusSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ReviewFormInput = z.input<typeof reviewSchema>;
export type PropertyFormInput = z.input<typeof propertySchema>;
export type ProfileFormInput = z.input<typeof profileSchema>;
export type CategoryFormInput = z.input<typeof categorySchema>;
