import {
  userSelectSchema,
  userInsertSchema,
  userUpdateSchema,
} from "@/schemas";
import { z } from "@hono/zod-openapi";

const password = z
  .string()
  .openapi({
    title: "Password",
    description:
      "The password for the user. Must be at least 8 characters long.",
    format: "password",
  })
  .min(8, "Password must be at least 8 characters long")
  .max(255, "Password must not exceed 255 characters")
  .refine((val) => /[a-zA-Z]/.test(val) && /\d/.test(val), {
    message: "Password must contain at least one letter and one number",
  })
  .refine((val) => !/\s/.test(val), {
    message: "Password must not contain whitespace",
  })
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    message: "Password must contain at least one special character",
  });

export const getUserDto = userSelectSchema
  .pick({
    id: true,
    status: true,
    name: true,
    email: true,
  })
  .openapi("User");

export const _getUsersDto = getUserDto.array().openapi("_Users");

export const createUserDto = userInsertSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({ password })
  .openapi("CreateUser");

export const createUserResponseDto = userSelectSchema
  .pick({
    id: true,
    name: true,
    email: true,
  })
  .openapi("CreateUserResponse");

/**
 * Not currently used
 */
export const updateUserDto = userUpdateSchema
  .pick({
    id: true,
    status: true,
    name: true,
    email: true,
  })
  .openapi("UpdateUser");

export const deleteUserResponseDto = userSelectSchema
  .pick({
    id: true,
    status: true,
  })
  .openapi("DeleteUser");

export const loginUserDto = userSelectSchema
  .pick({
    email: true,
  })
  .extend({ password })
  .openapi("LoginUser");

export const loginResponseDto = userSelectSchema
  .pick({
    id: true,
    name: true,
    email: true,
  })
  .openapi("LoginResponse");
