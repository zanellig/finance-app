import { incomeSchema } from "@/schemas";

export const getIncomeDto = incomeSchema.pick({
  id: true,
  userId: true,
  name: true,
  amount: true,
  frequency: true,
  isHourly: true,
  startDate: true,
  endDate: true,
});

export const getIncomesDto = getIncomeDto.array();

export const createIncomeDto = incomeSchema.pick({
  name: true,
  amount: true,
  frequency: true,
  isHourly: true,
  startDate: true,
  endDate: true,
});

export const createIncomeResponseDto = incomeSchema.pick({
  id: true,
});

export const updateIncomeDto = incomeSchema.pick({
  name: true,
  amount: true,
  frequency: true,
  isHourly: true,
  startDate: true,
  endDate: true,
});