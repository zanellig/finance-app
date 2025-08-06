import z from "zod";

export enum ClerkAPIErrorCodes {
  // Auth
  CouldNotAuthenticateRequest = "could_not_authenticate_request",
  FailedToVerifyInternalMigrationJwt = "failed_to_verify_internal_migration_jwt",
  IdentificationExists = "identification_exists",
  InternalMigrationJwtMissingInstanceId = "internal_migration_jwt_missing_instance_id",
  InvalidAuthentication = "authentication_invalid",
  InvalidAuthorization = "authorization_invalid",
  InvalidAuthorizationHeaderFormat = "authorization_header_format_invalid",
  InvalidClerkSecretKey = "clerk_key_invalid",
  InvalidRequestForEnvironment = "request_invalid_for_environment",
  RequestInvalidForInstance = "request_invalid_for_instance",
  UnsupportedCountry = "unsupported_country_code",

  // Allowlist
  AllowlistIdentifierNotFound = "resource_not_found",
  DuplicateAllowlistIdentifier = "duplicate_record",

  // Blocklist
  BlocklistIdentifierNotFound = "resource_not_found",
  DuplicateBlocklistIdentifier = "duplicate_record",

  // Clients
  ClientNotFound = "resource_not_found",
  ClientNotFoundInRequest = "client_not_found",

  // Cookie
  InvalidCookie = "cookie_invalid",
  InvalidRotatingToken = "cookie_invalid",
  MissingClaims = "cookie_invalid",

  // Deprecation
  ApiEndpointDeprecated = "operation_deprecated",

  // Domains
  DomainUpdateForbidden = "domain_update_forbidden",
  InvalidProxyConfiguration = "invalid_proxy_configuration",
  OperationNotAllowedOnPrimaryDomain = "operation_not_allowed_on_primary_domain",
  PrimaryDomainAlreadyExists = "primary_domain_already_exists",

  // Features
  FeatureNotEnabled = "feature_not_enabled",
  FeatureRequiresOidcProvider = "feature_requires_oidc_provider",
  FeatureRequiresPsu = "feature_requires_progressive_sign_up",
  UnsupportedSubscriptionPlanFeatures = "unsupported_subscription_plan_features",

  // Forms
  FormAlreadyExists = "form_already_exists",
  FormAtLeastOneOptionalParameterMissing = "form_at_least_one_optional_parameter_missing",
  FormDisallowFutureDate = "form_disallow_future_date",
  FormDuplicateParameter = "form_duplicate_parameter",
  FormIdentifierExists = "form_identifier_exists",
  FormInvalidDate = "form_invalid_date",
  FormInvalidEmailAddress = "form_invalid_email_address",
  FormInvalidEmailLocalPart = "form_invalid_email_local_part",
  FormInvalidEncodingParameterValue = "form_invalid_encoding_parameter_value",
  FormInvalidIdentifier = "form_invalid_identifier",
  FormInvalidOrigin = "form_invalid_origin",
  FormInvalidParameterFormat = "form_invalid_parameter_format",
  FormInvalidParameterOnlyOneOfAllowed = "form_invalid_parameter_only_one_of_allowed",
  FormInvalidParameterValue = "form_invalid_parameter_value",
  FormInvalidParameterValueWithAllowed = "form_invalid_parameter_value_with_allowed",
  FormInvalidPasswordLengthTooLong = "form_invalid_password_length_too_long",
  FormInvalidPasswordLengthTooShort = "form_invalid_password_length_too_short",
  FormInvalidPasswordNoLowercase = "form_invalid_password_no_lowercase",
  FormInvalidPasswordNoNumber = "form_invalid_password_no_number",
  FormInvalidPasswordNoSpecialChar = "form_invalid_password_no_special_char",
  FormInvalidPasswordNotStrongEnough = "form_invalid_password_not_strong_enough",
  FormInvalidPasswordNoUppercase = "form_invalid_password_no_uppercase",
  FormInvalidPhoneNumber = "form_invalid_phone_number",
  FormInvalidTime = "form_invalid_time",
  FormInvalidTypeParameter = "form_invalid_type_parameter",

  // Actor Tokens
  ActorTokenCannotBeRevoked = "actor_token_cannot_be_revoked_code",

  // Applications
  AccountlessApplicationNotFound = "resource_not_found",

  // Missing Error Codes from Documentation
  FormInvalidPasswordSizeInBytesExceeded = "form_password_size_in_bytes_exceeded",
  FormInvalidUsernameCharacter = "form_username_invalid_character",
  FormInvalidUsernameLength = "form_username_invalid_length",
  FormInvalidUsernameNeedsNonNumberCharCode = "form_username_needs_non_number_char",
  FormInvalidWeb3WalletAddress = "form_param_format_invalid",
  FormMetadataInvalidType = "form_param_value_invalid",
  FormMissingConditionalParameter = "form_conditional_param_missing",
  FormMissingConditionalParameterOnExistence = "form_conditional_param_missing",
  FormMissingResource = "form_resource_not_found",
  FormNilParameter = "form_param_nil",
  FormNotAllowedToDisableDefaultSecondFactor = "form_disable_default_second_factor_not_allowed",
  FormParameterArraySizeExceeded = "form_param_array_size_exceeded",
  SignInTokenCannotBeRevoked = "sign_in_token_cannot_be_revoked_code",
}

/**
 * Possible, this schema has missing fields. Use with `safeParse` only.
 *
 * @see https://clerk.com/docs/errors/backend-api
 */
export const clerkAPIResponseErrorSchema = z.object({
  status: z.number(),
  clerkTraceId: z.string(),
  clerkError: z.boolean(),
  retryAfter: z.any().optional(),
  errors: z.array(
    z.object({
      code: z.enum(ClerkAPIErrorCodes),
      message: z.string(),
      longMessage: z.string(),
      meta: z
        .object({
          paramName: z.string(),
          sessionId: z.string().optional(),
          emailAddresses: z.any().optional(), // I think this is an Array, but haven't tested
          identifiers: z.any().optional(),
          zxcvbn: z.any().optional(),
          plan: z.string().optional(),
          isPlanUpgradePossible: z.boolean().optional(),
        })
        .optional(),
    })
  ),
});

/** @see https://clerk.com/docs/errors/backend-api */
export type ClerkAPIResponseError = z.infer<typeof clerkAPIResponseErrorSchema>;
