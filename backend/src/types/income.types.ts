import z from "zod";

export enum IncomeFrequency {
  Monthly = "monthly",
  Biweekly = "biweekly",
  Quarterly = "quarterly",
  Annually = "annually",
}

export const income = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string(),
  amount: z.string().regex(/^\d+\.\d{2}$/), // decimal
  frequency: z.nativeEnum(IncomeFrequency),
  isHourly: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});