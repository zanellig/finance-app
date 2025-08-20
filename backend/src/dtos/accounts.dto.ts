import {
  accountSelectSchema,
  accountInsertSchema,
  accountUpdateSchema,
} from "@/schemas";

export const getAccountDto = accountSelectSchema
  .pick({
    id: true,
    entityId: true,
    name: true,
    type: true,
    balance: true,
    annualNominalRate: true,
    isSalaryAccount: true,
    overdraftLimit: true,
  })
  .openapi("Account");

export const getAccountsDto = getAccountDto.array().openapi("Accounts");

export const createAccountDto = accountInsertSchema
  .pick({
    entityId: true,
    name: true,
    type: true,
    balance: true,
    annualNominalRate: true,
    isSalaryAccount: true,
    overdraftLimit: true,
  })
  .openapi("CreateAccount");

export const createAccountResponseDto = accountSelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateAccountResponse");

export const updateAccountDto = accountUpdateSchema
  .pick({
    id: true,
    name: true,
    type: true,
    balance: true,
    annualNominalRate: true,
    isSalaryAccount: true,
    overdraftLimit: true,
  })
  .openapi("UpdateAccount");

export const deleteAccountDto = accountSelectSchema
  .pick({
    id: true,
  })
  .openapi("DeleteAccount");
