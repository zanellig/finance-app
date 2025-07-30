import { loan } from "../types/loans.types";

export const getLoanDto = loan.pick({
  id: true,
  userId: true,
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
});

export const getLoansDto = getLoanDto.array();

export const createLoanDto = loan.pick({
  userId: true,
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
});

export const createLoanResponseDto = loan.pick({
  id: true,
});

export const updateLoanDto = loan.pick({
  id: true,
  userId: true,
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
});

export const deleteLoanDto = loan.pick({
  id: true,
});