import {
  incomeSelectSchema,
  incomeInsertSchema,
  incomeUpdateSchema,
} from "@/schemas";

export const getIncomeDto = incomeSelectSchema
  .pick({
    id: true,
    userId: true,
    name: true,
    amount: true,
    frequency: true,
    isHourly: true,
    startDate: true,
    endDate: true,
  })
  .openapi("Income");

export const getIncomesDto = getIncomeDto.array().openapi("Incomes");

export const createIncomeDto = incomeInsertSchema
  .pick({
    name: true,
    amount: true,
    frequency: true,
    isHourly: true,
    startDate: true,
    endDate: true,
  })
  .openapi("CreateIncome");

export const createIncomeResponseDto = incomeSelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateIncomeResponse");

export const updateIncomeDto = incomeUpdateSchema
  .pick({
    name: true,
    amount: true,
    frequency: true,
    isHourly: true,
    startDate: true,
    endDate: true,
  })
  .openapi("UpdateIncome");
