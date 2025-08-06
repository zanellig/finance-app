import z from "zod";

export enum ClerkAPIErrorCodes {
  // Auth
  CouldNotAuthenticateRequest = "could_not_authenticate_request",
  FailedToVerifyInternalMigrationJwt = "failed_to_verify_internal_migration_jwt",
  IdentificationExists = "identification_exists",
  InternalMigrationJwtMissingInstanceId = "internal_migration_jwt_missing_instance_id",
  InvalidAuthentication = "invalid_authentication",
  InvalidAuthorization = "invalid_authorization",
  InvalidAuthorizationHeaderFormat = "invalid_authorization_header_format",
  InvalidClerkSecretKey = "invalid_clerk_secret_key",
  InvalidRequestForEnvironment = "invalid_request_for_environment",
  RequestInvalidForInstance = "request_invalid_for_instance",
  UnsupportedCountry = "unsupported_country",

  // Allowlist
  AllowlistIdentifierNotFound = "allowlist_identifier_not_found",
  DuplicateAllowlistIdentifier = "duplicate_allowlist_identifier",

  // Blocklist
  BlocklistIdentifierNotFound = "blocklist_identifier_not_found",
  DuplicateBlocklistIdentifier = "duplicate_blocklist_identifier",

  // Clients
  ClientNotFound = "client_not_found",
  ClientNotFoundInRequest = "client_not_found_in_request",

  // Cookie
  InvalidCookie = "invalid_cookie",
  InvalidRotatingToken = "invalid_rotating_token",
  MissingClaims = "missing_claims",

  // Deprecation
  ApiEndpointDeprecated = "api_endpoint_deprecated",

  // Domains
  DomainUpdateForbidden = "domain_update_forbidden",
  InvalidProxyConfiguration = "invalid_proxy_configuration",
  OperationNotAllowedOnPrimaryDomain = "operation_not_allowed_on_primary_domain",
  PrimaryDomainAlreadyExists = "primary_domain_already_exists",

  // Features
  FeatureNotEnabled = "feature_not_enabled",
  FeatureRequiresOidcProvider = "feature_requires_oidc_provider",
  FeatureRequiresPsu = "feature_requires_psu",
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
  ActorTokenCannotBeRevoked = "actor_token_cannot_be_revoked",

  // Applications
  AccountlessApplicationNotFound = "accountless_application_not_found",
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
      meta: z.object({
        paramName: z.string(),
        sessionId: z.string().optional(),
        emailAddresses: z.any().optional(), // I think this is an Array, but haven't tested
        identifiers: z.any().optional(),
        zxcvbn: z.any().optional(),
        plan: z.string().optional(),
        isPlanUpgradePossible: z.boolean().optional(),
      }),
    })
  ),
});

/** @see https://clerk.com/docs/errors/backend-api */
export type ClerkAPIResponseError = z.infer<typeof clerkAPIResponseErrorSchema>;
