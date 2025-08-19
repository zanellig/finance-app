import { user } from "../types/users.types";

export const getUserDto = user.pick({
  id: true,
  status: true,
  name: true,
  email: true,
}).openapi('User');

export const getUsersDto = getUserDto.array();

export const createUserDto = user.pick({
  name: true,
  email: true,
  password: true,
}).openapi('CreateUser');

export const createUserResponseDto = user.pick({
  id: true,
  name: true,
  email: true,
}).openapi('CreateUserResponse');

export const updateUserDto = user.pick({
  id: true,
  status: true,
  name: true,
  email: true,
}).openapi('UpdateUser');

export const deleteUserDto = user.pick({
  id: true,
  status: true,
}).openapi('DeleteUser');

export const loginUserDto = user.pick({
  email: true,
  password: true,
}).openapi('LoginUser');

export const loginResponseDto = user.pick({
  id: true,
  name: true,
  email: true,
}).openapi('LoginResponse');

export const apiResponseDto = {
  success: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
      user: { $ref: '#/components/schemas/CreateUserResponse' },
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
    },
    required: ['success', 'message']
  },
  error: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string' }
    },
    required: ['success', 'message']
  }
} as const;
