import { creditCard } from "../types/credit-cards.types";

export const getCreditCardDto = creditCard.pick({
  id: true,
  entityId: true,
  status: true,
  name: true,
  description: true,
  limit: true,
  expiration: true,
  closingDay: true,
});

export const getCreditCardsDto = getCreditCardDto.array();

export const createCreditCardDto = creditCard.pick({
  entityId: true,
  status: true,
  name: true,
  description: true,
  limit: true,
  number: true,
  expiration: true,
  closingDay: true,
});

export const createCreditCardResponseDto = creditCard.pick({
  id: true,
});

export const updateCreditCardDto = creditCard.pick({
  id: true,
  entityId: true,
  status: true,
  name: true,
  description: true,
  limit: true,
  number: true,
  expiration: true,
  closingDay: true,
});

export const deleteCreditCardDto = creditCard.pick({
  id: true,
  status: true,
});