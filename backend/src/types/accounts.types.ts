import z from "zod";

export enum AccountType {
  Savings = "savings",
  Checking = "checking",
  InterestBearing = "interest_bearing",
}

export const account = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4(),
  entityId: z.uuidv4(),
  name: z.string(),
  type: z.enum(AccountType),
  balance: z.string().regex(/^-?\d+\.\d{2}$/), // decimal
  annualNominalRate: z.string().regex(/^\d+\.\d{2}$/), // decimal
  isSalaryAccount: z.boolean(),
  overdraftLimit: z.string().regex(/^\d+\.\d{2}$/), // decimal
  createdAt: z.date(),
  updatedAt: z.date(),
});