import { entity } from "../types/entities.types";

export const getEntityDto = entity.pick({
  id: true,
  status: true,
  name: true,
  type: true,
});

export const getEntitiesDto = getEntityDto.array();

export const createEntityDto = entity.pick({
  name: true,
});

export const createEntityResponseDto = entity.pick({
  id: true,
});

export const updateEntityDto = entity.pick({
  id: true,
  status: true,
  name: true,
  type: true,
});

export const deleteEntityDto = entity.pick({
  id: true,
  status: true,
});
