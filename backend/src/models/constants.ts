// MySQL Foreign Key Reference Actions Constants
// Following the naming convention: [onDelete behavior][onUpdate behavior]

// No Action combinations
export const noActionNoAction = {
  onDelete: "no action",
  onUpdate: "no action",
} as const;

export const noActionRestrict = {
  onDelete: "no action",
  onUpdate: "restrict",
} as const;

export const noActionCascade = {
  onDelete: "no action",
  onUpdate: "cascade",
} as const;

export const noActionSetNull = {
  onDelete: "no action",
  onUpdate: "set null",
} as const;

export const noActionSetDefault = {
  onDelete: "no action",
  onUpdate: "set default",
} as const;

// Restrict combinations
export const restrictNoAction = {
  onDelete: "restrict",
  onUpdate: "no action",
} as const;

export const restrictRestrict = {
  onDelete: "restrict",
  onUpdate: "restrict",
} as const;

export const restrictCascade = {
  onDelete: "restrict",
  onUpdate: "cascade",
} as const;

export const restrictSetNull = {
  onDelete: "restrict",
  onUpdate: "set null",
} as const;

export const restrictSetDefault = {
  onDelete: "restrict",
  onUpdate: "set default",
} as const;

// Cascade combinations
export const cascadeNoAction = {
  onDelete: "cascade",
  onUpdate: "no action",
} as const;

export const cascadeRestrict = {
  onDelete: "cascade",
  onUpdate: "restrict",
} as const;

export const cascadeCascade = {
  onDelete: "cascade",
  onUpdate: "cascade",
} as const;

export const cascadeSetNull = {
  onDelete: "cascade",
  onUpdate: "set null",
} as const;

export const cascadeSetDefault = {
  onDelete: "cascade",
  onUpdate: "set default",
} as const;

// Set Null combinations
export const setNullNoAction = {
  onDelete: "set null",
  onUpdate: "no action",
} as const;

export const setNullRestrict = {
  onDelete: "set null",
  onUpdate: "restrict",
} as const;

export const setNullCascade = {
  onDelete: "set null",
  onUpdate: "cascade",
} as const;

export const setNullSetNull = {
  onDelete: "set null",
  onUpdate: "set null",
} as const;

export const setNullSetDefault = {
  onDelete: "set null",
  onUpdate: "set default",
} as const;

// Set Default combinations
export const setDefaultNoAction = {
  onDelete: "set default",
  onUpdate: "no action",
} as const;

export const setDefaultRestrict = {
  onDelete: "set default",
  onUpdate: "restrict",
} as const;

export const setDefaultCascade = {
  onDelete: "set default",
  onUpdate: "cascade",
} as const;

export const setDefaultSetNull = {
  onDelete: "set default",
  onUpdate: "set null",
} as const;

export const setDefaultSetDefault = {
  onDelete: "set default",
  onUpdate: "set default",
} as const;
