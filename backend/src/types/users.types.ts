import z from "zod";

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
}

export const user = z.object({
  id: z.uuidv4(),
  status: z.enum(UserStatus),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
