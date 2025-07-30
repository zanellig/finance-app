import { account } from "../types/accounts.types";

export const getAccountDto = account.pick({
  id: true,
  userId: true,
  entityId: true,
  name: true,
  type: true,
  balance: true,
  annualNominalRate: true,
  isSalaryAccount: true,
  overdraftLimit: true,
});

export const getAccountsDto = getAccountDto.array();

export const createAccountDto = account.pick({
  userId: true,
  entityId: true,
  name: true,
  type: true,
  balance: true,
  annualNominalRate: true,
  isSalaryAccount: true,
  overdraftLimit: true,
});

export const createAccountResponseDto = account.pick({
  id: true,
});

export const updateAccountDto = account.pick({
  id: true,
  name: true,
  type: true,
  balance: true,
  annualNominalRate: true,
  isSalaryAccount: true,
  overdraftLimit: true,
});

export const deleteAccountDto = account.pick({
  id: true,
});
