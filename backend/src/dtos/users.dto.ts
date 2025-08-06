import { user } from "../types/users.types";

export const getUserDto = user.pick({
  id: true,
  status: true,
  name: true,
  email: true,
});

export const getUsersDto = getUserDto.array();

export const createUserDto = user.pick({
  name: true,
  email: true,
  password: true,
});

export const createUserResponseDto = user.pick({
  id: true,
});

export const updateUserDto = user.pick({
  id: true,
  status: true,
  name: true,
  email: true,
});

export const deleteUserDto = user.pick({
  id: true,
  status: true,
});
