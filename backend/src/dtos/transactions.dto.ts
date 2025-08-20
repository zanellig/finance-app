import {
  creditCardTransactionSelectSchema,
  creditCardTransactionInsertSchema,
  creditCardTransactionUpdateSchema,
  transactionSelectSchema,
  transactionInsertSchema,
  transactionUpdateSchema,
} from "@/schemas";

export const getCreditCardTransactionDto = creditCardTransactionSelectSchema
  .pick({
    id: true,
    creditCardId: true,
    status: true,
    currency: true,
    amount: true,
    isInstallment: true,
    installments: true,
    currentInstallment: true,
  })
  .openapi("CreditCardTransaction");

export const getCreditCardTransactionsDto = getCreditCardTransactionDto
  .array()
  .openapi("CreditCardTransactions");

export const createCreditCardTransactionDto = creditCardTransactionInsertSchema
  .pick({
    creditCardId: true,
    status: true,
    currency: true,
    amount: true,
    isInstallment: true,
    installments: true,
    currentInstallment: true,
  })
  .openapi("CreateCreditCardTransaction");

export const createCreditCardTransactionResponseDto =
  creditCardTransactionSelectSchema
    .pick({
      id: true,
    })
    .openapi("CreateCreditCardTransactionResponse");

export const updateCreditCardTransactionDto = creditCardTransactionUpdateSchema
  .pick({
    id: true,
    status: true,
    currency: true,
    amount: true,
    isInstallment: true,
    installments: true,
    currentInstallment: true,
  })
  .openapi("UpdateCreditCardTransaction");

export const deleteCreditCardTransactionDto = creditCardTransactionSelectSchema
  .pick({
    id: true,
  })
  .openapi("DeleteCreditCardTransaction");

export const getTransactionDto = transactionSelectSchema
  .pick({
    id: true,
    userId: true,
    fromAccountId: true,
    toAccountId: true,
    loanId: true,
    type: true,
    currency: true,
    amount: true,
  })
  .openapi("Transaction");

export const getTransactionsDto = getTransactionDto
  .array()
  .openapi("Transactions");

export const createTransactionDto = transactionInsertSchema
  .pick({
    userId: true,
    fromAccountId: true,
    toAccountId: true,
    loanId: true,
    type: true,
    currency: true,
    amount: true,
  })
  .openapi("CreateTransaction");

export const createTransactionResponseDto = transactionSelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateTransactionResponse");

export const updateTransactionDto = transactionUpdateSchema
  .pick({
    id: true,
    userId: true,
    fromAccountId: true,
    toAccountId: true,
    loanId: true,
    type: true,
    currency: true,
    amount: true,
  })
  .openapi("UpdateTransaction");

export const deleteTransactionDto = transactionSelectSchema
  .pick({
    id: true,
  })
  .openapi("DeleteTransaction");
