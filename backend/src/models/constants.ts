// MySQL Foreign Key Reference Actions Constants
// Following the naming convention: [onDelete behavior][onUpdate behavior]
import type { ReferenceConfig } from "drizzle-orm/mysql-core";

// No Action combinations
export const noActionNoAction = {
  onDelete: "no action",
  onUpdate: "no action",
} as ReferenceConfig["actions"];

export const noActionRestrict = {
  onDelete: "no action",
  onUpdate: "restrict",
} as ReferenceConfig["actions"];

export const noActionCascade = {
  onDelete: "no action",
  onUpdate: "cascade",
} as ReferenceConfig["actions"];

export const noActionSetNull = {
  onDelete: "no action",
  onUpdate: "set null",
} as ReferenceConfig["actions"];

export const noActionSetDefault = {
  onDelete: "no action",
  onUpdate: "set default",
} as ReferenceConfig["actions"];

// Restrict combinations
export const restrictNoAction = {
  onDelete: "restrict",
  onUpdate: "no action",
} as ReferenceConfig["actions"];

export const restrictRestrict = {
  onDelete: "restrict",
  onUpdate: "restrict",
} as ReferenceConfig["actions"];

export const restrictCascade = {
  onDelete: "restrict",
  onUpdate: "cascade",
} as ReferenceConfig["actions"];

export const restrictSetNull = {
  onDelete: "restrict",
  onUpdate: "set null",
} as ReferenceConfig["actions"];

export const restrictSetDefault = {
  onDelete: "restrict",
  onUpdate: "set default",
} as ReferenceConfig["actions"];

// Cascade combinations
export const cascadeNoAction = {
  onDelete: "cascade",
  onUpdate: "no action",
} as ReferenceConfig["actions"];

export const cascadeRestrict = {
  onDelete: "cascade",
  onUpdate: "restrict",
} as ReferenceConfig["actions"];

export const cascadeCascade = {
  onDelete: "cascade",
  onUpdate: "cascade",
} as ReferenceConfig["actions"];

export const cascadeSetNull = {
  onDelete: "cascade",
  onUpdate: "set null",
} as ReferenceConfig["actions"];

export const cascadeSetDefault = {
  onDelete: "cascade",
  onUpdate: "set default",
} as ReferenceConfig["actions"];

// Set Null combinations
export const setNullNoAction = {
  onDelete: "set null",
  onUpdate: "no action",
} as ReferenceConfig["actions"];

export const setNullRestrict = {
  onDelete: "set null",
  onUpdate: "restrict",
} as ReferenceConfig["actions"];

export const setNullCascade = {
  onDelete: "set null",
  onUpdate: "cascade",
} as ReferenceConfig["actions"];

export const setNullSetNull = {
  onDelete: "set null",
  onUpdate: "set null",
} as ReferenceConfig["actions"];

export const setNullSetDefault = {
  onDelete: "set null",
  onUpdate: "set default",
} as ReferenceConfig["actions"];

// Set Default combinations
export const setDefaultNoAction = {
  onDelete: "set default",
  onUpdate: "no action",
} as ReferenceConfig["actions"];

export const setDefaultRestrict = {
  onDelete: "set default",
  onUpdate: "restrict",
} as ReferenceConfig["actions"];

export const setDefaultCascade = {
  onDelete: "set default",
  onUpdate: "cascade",
} as ReferenceConfig["actions"];

export const setDefaultSetNull = {
  onDelete: "set default",
  onUpdate: "set null",
} as ReferenceConfig["actions"];

export const setDefaultSetDefault = {
  onDelete: "set default",
  onUpdate: "set default",
} as ReferenceConfig["actions"];
