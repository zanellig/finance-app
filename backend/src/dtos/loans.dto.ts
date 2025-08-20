import {
  loanSelectSchema,
  loanInsertSchema,
  loanUpdateSchema,
} from "@/schemas";

export const getLoanDto = loanSelectSchema
  .pick({
    id: true,
    entityId: true,
    name: true,
    initialCapital: true,
    annualInterestRate: true,
    installments: true,
    remainingInstallments: true,
    totalAnnualFinancedCost: true,
    amortizationStrategy: true,
    currency: true,
    remainingCapital: true,
  })
  .openapi("Loan");

export const getLoansDto = getLoanDto.array().openapi("Loans");

export const createLoanDto = loanInsertSchema
  .pick({
    entityId: true,
    name: true,
    initialCapital: true,
    annualInterestRate: true,
    installments: true,
    remainingInstallments: true,
    totalAnnualFinancedCost: true,
    amortizationStrategy: true,
    currency: true,
    remainingCapital: true,
  })
  .openapi("CreateLoan");

export const createLoanResponseDto = loanSelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateLoanResponse");

export const updateLoanDto = loanUpdateSchema
  .pick({
    id: true,
    entityId: true,
    name: true,
    initialCapital: true,
    annualInterestRate: true,
    installments: true,
    remainingInstallments: true,
    totalAnnualFinancedCost: true,
    amortizationStrategy: true,
    currency: true,
    remainingCapital: true,
  })
  .openapi("UpdateLoan");

export const deleteLoanDto = loanSelectSchema
  .pick({
    id: true,
  })
  .openapi("DeleteLoan");
