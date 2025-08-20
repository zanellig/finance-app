import {
  creditCardSelectSchema,
  creditCardInsertSchema,
  creditCardUpdateSchema,
} from "@/schemas";

export const getCreditCardDto = creditCardSelectSchema
  .pick({
    id: true,
    entityId: true,
    status: true,
    name: true,
    description: true,
    limit: true,
    expiration: true,
    closingDay: true,
  })
  .openapi("CreditCard");

export const getCreditCardsDto = getCreditCardDto
  .array()
  .openapi("CreditCards");

export const createCreditCardDto = creditCardInsertSchema
  .pick({
    entityId: true,
    status: true,
    name: true,
    description: true,
    limit: true,
    number: true,
    expiration: true,
    closingDay: true,
  })
  .openapi("CreateCreditCard");

export const createCreditCardResponseDto = creditCardSelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateCreditCardResponse");

export const updateCreditCardDto = creditCardUpdateSchema
  .pick({
    id: true,
    entityId: true,
    status: true,
    name: true,
    description: true,
    limit: true,
    number: true,
    expiration: true,
    closingDay: true,
  })
  .openapi("UpdateCreditCard");

export const deleteCreditCardDto = creditCardSelectSchema
  .pick({
    id: true,
    status: true,
  })
  .openapi("DeleteCreditCard");
