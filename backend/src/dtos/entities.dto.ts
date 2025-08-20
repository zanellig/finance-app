import {
  entitySelectSchema,
  entityInsertSchema,
  entityUpdateSchema,
} from "@/schemas";

export const getEntityDto = entitySelectSchema
  .pick({
    id: true,
    status: true,
    name: true,
    type: true,
  })
  .openapi("Entity");

export const getEntitiesDto = getEntityDto.array().openapi("Entities");

export const createEntityDto = entityInsertSchema
  .pick({
    name: true,
    type: true,
  })
  .openapi("CreateEntity");

export const createEntityResponseDto = entitySelectSchema
  .pick({
    id: true,
  })
  .openapi("CreateEntityResponse");

export const updateEntityDto = entityUpdateSchema
  .pick({
    id: true,
    status: true,
    name: true,
    type: true,
  })
  .openapi("UpdateEntity");

export const deleteEntityDto = entitySelectSchema
  .pick({
    id: true,
    status: true,
  })
  .openapi("DeleteEntity");
