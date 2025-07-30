import z from "zod";

export enum CreditCardStatus {
  Active = "active",
  Inactive = "inactive",
  Blocked = "blocked",
  Deleted = "deleted",
}

export const creditCard = z.object({
  id: z.uuidv4(),
  entityId: z.uuidv4().optional(),
  status: z.enum(CreditCardStatus),
  name: z.string(),
  description: z.string().optional(),
  limit: z.string().regex(/^\d+\.\d{2}$/), // decimal
  number: z.string().length(16).optional(),
  expiration: z.date(),
  closingDay: z.number().int().default(30),
  createdAt: z.date(),
  updatedAt: z.date(),
});
