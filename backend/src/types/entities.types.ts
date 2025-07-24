import z from "zod";

export enum EntityStatus {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
}

export enum EntityType {
  Bank = "bank",
  Wallet = "wallet",
  AssetManager = "asset_manager",
}

export const entity = z.object({
  id: z.uuidv4(),
  status: z.enum(EntityStatus),
  userId: z.uuidv4(),
  name: z.string(),
  type: z.enum(EntityType),
  createdAt: z.date(),
  updatedAt: z.date(),
});
