import { creditCardTransaction, transaction } from "../types/transactions.types";

export const getCreditCardTransactionDto = creditCardTransaction.pick({
  id: true,
  creditCardId: true,
  status: true,
  currency: true,
  amount: true,
  isInstallment: true,
  installments: true,
  currentInstallment: true,
});

export const getCreditCardTransactionsDto = getCreditCardTransactionDto.array();

export const createCreditCardTransactionDto = creditCardTransaction.pick({
  creditCardId: true,
  status: true,
  currency: true,
  amount: true,
  isInstallment: true,
  installments: true,
  currentInstallment: true,
});

export const createCreditCardTransactionResponseDto = creditCardTransaction.pick({
  id: true,
});

export const updateCreditCardTransactionDto = creditCardTransaction.pick({
  id: true,
  status: true,
  currency: true,
  amount: true,
  isInstallment: true,
  installments: true,
  currentInstallment: true,
});

export const deleteCreditCardTransactionDto = creditCardTransaction.pick({
  id: true,
});

export const getTransactionDto = transaction.pick({
  id: true,
  userId: true,
  fromAccountId: true,
  toAccountId: true,
  loanId: true,
  type: true,
  currency: true,
  amount: true,
});

export const getTransactionsDto = getTransactionDto.array();

export const createTransactionDto = transaction.pick({
  userId: true,
  fromAccountId: true,
  toAccountId: true,
  loanId: true,
  type: true,
  currency: true,
  amount: true,
});

export const createTransactionResponseDto = transaction.pick({
  id: true,
});

export const updateTransactionDto = transaction.pick({
  id: true,
  userId: true,
  fromAccountId: true,
  toAccountId: true,
  loanId: true,
  type: true,
  currency: true,
  amount: true,
});

export const deleteTransactionDto = transaction.pick({
  id: true,
});