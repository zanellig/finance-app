import z from "zod";

export enum AmortizationStrategy {
  Flat = "flat",
  French = "french",
  German = "german",
  American = "american",
}

export enum Currency {
  ARS = "ARS",
  USD = "USD",
}

export const loan = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4().optional(),
  entityId: z.uuidv4().optional(),
  name: z.string().optional(),
  initialCapital: z.string().regex(/^\d+\.\d{2}$/),
  annualInterestRate: z.string().regex(/^\d+\.\d{2}$/),
  installments: z.number().int().nonnegative(),
  remainingInstallments: z.number().int().nonnegative(),
  totalAnnualFinancedCost: z.string().regex(/^\d+\.\d{2}$/),
  amortizationStrategy: z.nativeEnum(AmortizationStrategy).optional(),
  currency: z.nativeEnum(Currency),
  remainingCapital: z.string().regex(/^\d+\.\d{2}$/),
  createdAt: z.date(),
  updatedAt: z.date(),
});
