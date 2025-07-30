import z from "zod";

import { Currency } from "./loans.types"; // Reusing Currency from loans

export enum TransactionStatus {
  Approved = "approved",
  Declined = "declined",
  Pending = "pending",
  Refunded = "refunded",
}

export enum TransactionType {
  Payment = "payment",
  Transfer = "transfer",
  LoanPayment = "loan_payment",
  CcPayment = "cc_payment",
}

export const creditCardTransaction = z.object({
  id: z.uuidv4(),
  creditCardId: z.uuidv4(),
  status: z.enum(TransactionStatus),
  currency: z.enum(Currency),
  amount: z.string().regex(/^-?\d+\.\d{2}$/),
  isInstallment: z.boolean(),
  installments: z.number().int().nonnegative(),
  currentInstallment: z.number().int().nonnegative(),
});

export const transaction = z.object({
  id: z.uuidv4(),
  userId: z.uuidv4().optional(),
  fromAccountId: z.uuidv4(),
  toAccountId: z.uuidv4(),
  loanId: z.uuidv4().optional(),
  type: z.enum(TransactionType),
  currency: z.enum(Currency),
  amount: z.string().regex(/^-?\d+\.\d{2}$/),
});
