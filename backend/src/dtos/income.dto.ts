import { income } from "../types/income.types";

export const getIncomeDto = income.pick({
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

export const createIncomeDto = income.pick({
  name: true,
  amount: true,
  frequency: true,
  isHourly: true,
  startDate: true,
  endDate: true,
});

export const createIncomeResponseDto = income.pick({
  id: true,
});

export const updateIncomeDto = income.pick({
  name: true,
  amount: true,
  frequency: true,
  isHourly: true,
  startDate: true,
  endDate: true,
});