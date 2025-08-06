# Backend API errors

An index of Clerk Backend API errors.

## Actor Tokens

`ActorTokenCannotBeRevoked`
Status Code: 400

```json
{
  "shortMessage": "cannot revoke",
  "longMessage": "Actor token cannot be revoked because its status is <status>. Only pending tokens can be revoked.",
  "code": "actor_token_cannot_be_revoked_code"
}
```

## Allowlist Identifiers

`AllowlistIdentifierNotFound`
Status Code: 404

```json
{
  "shortMessage": "Identifier not found",
  "longMessage": "No identifier was found with id <identifierID>",
  "code": "resource_not_found"
}
```

`DuplicateAllowlistIdentifier`
Status Code: 400

```json
{
  "shortMessage": "duplicate allowlist identifier",
  "longMessage": "the identifier <identifier> already exists",
  "code": "duplicate_record"
}
```

## Applications

`AccountlessApplicationNotFound`
AccountlessApplicationNotFound signifies an error when no application with the given claim token could be found

Status Code: 404

```json
{
  "shortMessage": "Application not found",
  "longMessage": "No application was found with the given claim token.",
  "code": "resource_not_found"
}
```

## Auth

`CouldNotAuthenticateRequest`
Status Code: 401

```json
{
  "shortMessage": "Could not authenticate request.",
  "longMessage": "Could not authenticate request.",
  "code": "could_not_authenticate_request"
}
```

`FailedToVerifyInternalMigrationJWT`
Status Code: 401

```json
{
  "shortMessage": "Failed to verify internal migration JWT.",
  "longMessage": "Failed to verify internal migration JWT.",
  "code": "failed_to_verify_internal_migration_jwt"
}
```

`IdentificationExists`
IdentificationExists signifies an error when the identifier already exists

Status Code: 400

```json
{
  "shortMessage": "already exists",
  "longMessage": "This <identifier> already exists.",
  "code": ""
}
```

`InternalMigrationJWTMissingInstanceID`
Status Code: 401

```json
{
  "shortMessage": "The provided internal migration JWT is missing the instance ID.",
  "longMessage": "The provided internal migration JWT is missing the instance ID.",
  "code": "internal_migration_jwt_missing_instance_id"
}
```

`InvalidAuthentication`
InvalidAuthentication signifies an error when the request is not authenticated

Status Code: 401

```json
{
  "shortMessage": "Invalid authentication",
  "longMessage": "Unable to authenticate the request, you need to supply an active session",
  "code": "authentication_invalid"
}
```

`InvalidAuthorization`
InvalidAuthorization signifies an error when the request is not authorized to perform the given operation

Status Code: 403

```json
{
  "shortMessage": "Unauthorized request",
  "longMessage": "You are not authorized to perform this request",
  "code": "authorization_invalid"
}
```

`InvalidAuthorizationHeaderFormat`
InvalidAuthorizationHeaderFormat signifies an error when the Authorization header has no proper format.

Status Code: 401

```json
{
  "shortMessage": "Invalid Authorization header format",
  "longMessage": "Invalid Authorization header format. Must be 'Bearer <YOUR_API_KEY>'",
  "code": "authorization_header_format_invalid"
}
```

`InvalidClerkSecretKey`
InvalidClerkSecretKey signifies an error when the supplied client key is invalid

Status Code: 401

```json
{
  "shortMessage": "The provided Clerk Secret Key is invalid. Make sure that your Clerk Secret Key is correct.",
  "longMessage": "The provided Clerk Secret Key is invalid. Make sure that your Clerk Secret Key is correct.",
  "code": "clerk_key_invalid"
}
```

`InvalidRequestForEnvironment`
InvalidRequestForEnvironment signifies an error when the incoming request is invalid for given environment(s)

Status Code: 400

```json
{
  "shortMessage": "Invalid request for environment",
  "longMessage": "Request only valid for <envTypes> instances.",
  "code": "request_invalid_for_environment"
}
```

`RequestInvalidForInstance`
RequestInvalidForInstance signifies an error when the incoming request is invalid for the given instance, due to the auth_config

Status Code: 400

```json
{
  "shortMessage": "Invalid request for instance",
  "longMessage": "This request is not valid for your instance. Modify your instance settings to use this request.",
  "code": "request_invalid_for_instance"
}
```

`UnsupportedCountry`
Status Code: 403

```json
{
  "shortMessage": "Unsupported country code",
  "longMessage": "Phone numbers from this country (<countryName>) are currently not supported. For more information, please contact <support>.",
  "code": "unsupported_country_code",
  "meta": "{\"formParameter\": {\"Name\": \"param\"}, \"Alpha2\": alpha2, \"CountryCode\": countryCode}"
}
```

## Billing

`UnsupportedSubscriptionPlanFeatures`
Status Code: 402

```json
{
  "shortMessage": "Unsupported plan features",
  "longMessage": "Some features are not supported in your current plan. Upgrade your subscription to unlock them.",
  "code": "unsupported_subscription_plan_features",
  "meta": {
    "unsupportedfeatures": "unsupportedfeatures"
  }
}
```

Blocklist Identifiers
`BlocklistIdentifierNotFound`
Status Code: 404

```json
{
  "shortMessage": "Identifier not found",
  "longMessage": "No identifier was found with id <identifierID>",
  "code": "resource_not_found"
}
```

`DuplicateBlocklistIdentifier`
Status Code: 400

```json
{
  "shortMessage": "duplicate blocklist identifier",
  "longMessage": "the identifier <identifier> already exists",
  "code": "duplicate_record"
}
```

## Clients

`ClientNotFound`
ClientNotFound signifies an error when no client is found with clientID

Status Code: 404

```json
{
  "shortMessage": "Client not found",
  "longMessage": "No client was found with id <clientID>",
  "code": "resource_not_found"
}
```

`ClientNotFoundInRequest`
ClientNotFoundInRequest signifies an error when no client is found in an incoming request

Status Code: 400

```json
{
  "shortMessage": "No client found",
  "longMessage": "This request is expecting a client and did not find one",
  "code": "client_not_found"
}
```

## Cookie

`InvalidCookie`
InvalidCookie signifies an error when cookie is invalid

Status Code: 400

```json
{
  "shortMessage": "",
  "code": "cookie_invalid"
}
```

`InvalidRotatingToken`
InvalidRotatingToken signifies an error when rotating token does not match the client's rotating token

Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "The client's rotating key does not match the given one <token>",
  "code": "cookie_invalid"
}
```

`MissingClaims`
MissingClaims signifies an error when token is missing claim

Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "The token is missing the following claims: <claims>",
  "code": "cookie_invalid"
}
```

## Deprecation

`APIEndpointDeprecated`
Status Code: 410

```json
{
  "shortMessage": "endpoint is deprecated and pending removal",
  "longMessage": "endpoint is deprecated and pending removal",
  "code": "operation_deprecated"
}
```

## Domains

`DomainUpdateForbidden`
DomainUpdateForbidden signifies an error when trying to update an non production instance domain

Status Code: 400

```json
{
  "shortMessage": "Domain update was forbidden",
  "longMessage": "Domain can be only updated for production instances",
  "code": "domain_update_forbidden"
}
```

`InvalidProxyConfiguration`
Status Code: 422

```json
{
  "shortMessage": "",
  "longMessage": "Clerk Frontend API cannot be accessed through the proxy URL. Make sure your proxy is configured correctly.",
  "code": "invalid_proxy_configuration",
  "meta": {
    "name": "proxy_url"
  }
}
```

`OperationNotAllowedOnPrimaryDomain`
Status Code: 403

```json
{
  "shortMessage": "operation not allowed",
  "longMessage": "This operation is not allowed on a primary domain. Try again with a satellite domain of the instance.",
  "code": "operation_not_allowed_on_primary_domain"
}
```

`PrimaryDomainAlreadyExists`
PrimaryDomainAlreadyExists signifies an error when a new domain is added as primary when there is already once in the instance. Currently, we only support a single primary domain per instance.

Status Code: 422

```json
{
  "shortMessage": "primary domain already exists",
  "longMessage": "Currently, only a single primary domain is supported and the current instance already has one. All new domains need to be set a satellites.",
  "code": "primary_domain_already_exists",
  "meta": {
    "name": "is_satellite"
  }
}
```

## Features

`FeatureNotEnabled`
Status Code: 403

```json
{
  "shortMessage": "not enabled",
  "longMessage": "This feature is not enabled on this instance",
  "code": "feature_not_enabled"
}
```

`FeatureRequiresOIDCProvider`
Status Code: 422

```json
{
  "shortMessage": "not an OIDC provider",
  "longMessage": "You are using the legacy OAuth 2.0 provider. Please migrate to the new OIDC compatible provider to use this feature",
  "code": "feature_requires_oidc_provider"
}
```

`FeatureRequiresPSU`
Status Code: 422

```json
{
  "shortMessage": "not a Progressive Sign Up instance",
  "longMessage": "<feature> can only be used in instances that migrated to Progressive Sign Up (<https://clerk.com/docs/upgrade-guides/progressive-sign-up>)",
  "code": "feature_requires_progressive_sign_up"
}
```

## Forms

`FormAlreadyExists`
FormAlreadyExists signifies an error when given resource already exists

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_already_exists",
  "meta": {
    "name": "param"
  }
}
```

`FormAtLeastOneOptionalParameterMissing`
FormAtLeastOneOptionalParameterMissing signifies an error when at least one optional parameter must be provided

Status Code: 422

```json
{
  "shortMessage": "at least one parameter must be provided",
  "longMessage": "at least one of `<parameters>` must be provided",
  "code": "form_param_missing",
  "meta": {
    "names": "paramnames"
  }
}
```

`FormDisallowFutureDate`
Status Code: 422

```json
{
  "shortMessage": "Date values must not be in the future.",
  "longMessage": "Date values must not be in the future.",
  "code": "form_disallow_future_date",
  "meta": {
    "name": "param"
  }
}
```

`FormDuplicateParameter`
FormDuplicateParameter signifies an error when a duplicate parameter is found in a form

Status Code: 422

```json
{
  "shortMessage": "is duplicate",
  "longMessage": "<param> included multiple times. There should only be one.",
  "code": "form_param_duplicate",
  "meta": {
    "name": "param"
  }
}
```

`FormIdentifierExists`
FormIdentifierExists signifies an error when given identifier already exists

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_identifier_exists",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidDate`
Status Code: 422

```json
{
  "shortMessage": "Date values must be given in Unix millisecond timestamp format.",
  "longMessage": "Date values must be given in Unix millisecond timestamp format.",
  "code": "form_param_invalid_date",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidEmailAddress`
Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be a valid email address.",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidEmailLocalPart`
Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be a valid email address local part.",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidEncodingParameterValue`
FormInvalidEncodingParameterValue signifies an error when the given parameter has an invalid encoding

Status Code: 422

```json
{
  "shortMessage": "invalid character encoding",
  "longMessage": "<param> contains invalid UTF-8 characters",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidIdentifier`
Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be either a valid email address, a valid phone number according to E.164 international standard or a valid web3 wallet.",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidOrigin`
FormInvalidOrigin signifies an error when the given origin is http/https

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be a valid origin such as my-app://localhost, chrome-extension://mnhbilbfebpbokpjjamapdecdgieldho, or capacitor://localhost:3000",
  "code": "form_invalid_origin",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidParameterFormat`
FormInvalidParameterFormat signifies an error when the given parameter has an invalid format

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidParameterOnlyOneOfAllowed`
Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> is invalid. Only one of the following parameter values is allowed: <allowedValues>",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidParameterValue`
FormInvalidParameterValue signifies an error when the given parameter has an invalid value

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<value> does not match one of the allowed values for parameter <param>",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidParameterValueWithAllowed`
FormInvalidParameterValueWithAllowed signifies an error when the given parameter has an invalid value. The difference with FormInvalidParameterValue is that this error also includes the allowed values

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<value> does not match the allowed values for parameter <param>. Allowed values: <allowedValues>",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordLengthTooLong`
FormInvalidPasswordLengthTooLong signifies an error when the password is invalid because of its length

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_password_length_too_long",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordLengthTooShort`
FormInvalidPasswordLengthTooShort signifies an error when the password is invalid because of its length

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_password_length_too_short",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordNoLowercase`
Status Code: 422

```json
{
  "shortMessage": "Passwords must contain at least one lowercase character.",
  "longMessage": "Passwords must contain at least one lowercase character.",
  "code": "form_password_no_lowercase",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordNoNumber`
Status Code: 422

```json
{
  "shortMessage": "Passwords must contain at least one number.",
  "longMessage": "Passwords must contain at least one number.",
  "code": "form_password_no_number",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordNoSpecialChar`
Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_password_no_special_char",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordNotStrongEnough`
Status Code: 422

```json
{
  "shortMessage": "Given password is not strong enough.",
  "longMessage": "Given password is not strong enough.",
  "code": "form_password_not_strong_enough"
}
```

`FormInvalidPasswordNoUppercase`
Status Code: 422

```json
{
  "shortMessage": "Passwords must contain at least one uppercase character.",
  "longMessage": "Passwords must contain at least one uppercase character.",
  "code": "form_password_no_uppercase",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPasswordSizeInBytesExceeded`
FormInvalidPasswordSizeInBytesExceeded signifies that the size in bytes was exceeded. Note that the maximum character length constraint may fail to detect this case, if multi-byte characters are included in the password. For example, bcrypt limit <https://cs.opensource.google/go/x/crypto/+/refs/tags/v0.8.0:bcrypt/bcrypt.go;l=87>

Status Code: 422

```json
{
  "shortMessage": "Your password has exceeded the maximum number of bytes allowed, please shorten it or remove some special characters.",
  "longMessage": "Your password has exceeded the maximum number of bytes allowed, please shorten it or remove some special characters.",
  "code": "form_password_size_in_bytes_exceeded",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidPhoneNumber`
Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be a valid phone number according to E.164 international standard.",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidTime`
Status Code: 422

```json
{
  "shortMessage": "invalid format",
  "longMessage": "<param> must contain a datetime specified in RFC3339 format (e.g. `2022-10-20T10:00:27.645Z`).",
  "code": "form_param_invalid_time",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidTypeParameter`
FormInvalidTypeParameter signifies an error when a form parameter has the wrong type

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "`<param>` must be a `<paramType>`.",
  "code": "form_param_type_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidUsernameCharacter`
FormInvalidUsernameCharacter signifies an error when the given username does not match username regex

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_username_invalid_character",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidUsernameLength`
FormInvalidUsernameLength signifies an error when the given username does not have required length

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_username_invalid_length",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidUsernameNeedsNonNumberCharCode`
FormInvalidUsernameNeedsNonNumberCharCode signifies an error when the given username does not match username regex

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_username_needs_non_number_char",
  "meta": {
    "name": "param"
  }
}
```

`FormInvalidWeb3WalletAddress`
FormInvalidWeb3Wallet signifies an error when the given web3 wallet address is invalid

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<param> must be a valid web3 wallet address that starts with 0x and contains 40 hexadecimal characters.",
  "code": "form_param_format_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormMetadataInvalidType`
FormMetadataInvalidType signifies an error when the given metadata is not a valid key-value object

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "param"
  }
}
```

`FormMissingConditionalParameter`
FormMissingConditionalParameter signifies an error when required parameter based on conditions is missing

Status Code: 422

```json
{
  "shortMessage": "is missing",
  "longMessage": "`<param>` is required when `<leftCondition>` is `<rightCondition>`.",
  "code": "form_conditional_param_missing"
}
```

`FormMissingConditionalParameterOnExistence`
FormMissingConditionalParameterOnExistence signifies an error when parameter is required because of the existence of another

Status Code: 422

```json
{
  "shortMessage": "is missing",
  "longMessage": "`<missingParam>` is required when `<conditionalParam>` is present.",
  "code": "form_conditional_param_missing",
  "meta": {
    "name": "missingparam"
  }
}
```

`FormMissingParameter`
FormMissingParameter signifies an error when an expected form parameter is missing

Status Code: 422

```json
{
  "shortMessage": "is missing",
  "longMessage": "<param> must be included.",
  "code": "form_param_missing",
  "meta": {
    "name": "param"
  }
}
```

`FormMissingResource`
FormMissingResource signifies an error when the form parameter is referring to a missing resource

Status Code: 422

```json
{
  "shortMessage": "is missing",
  "longMessage": "The resource associated with the supplied <param> was not found.",
  "code": "form_resource_not_found",
  "meta": {
    "name": "param"
  }
}
```

`FormNilParameter`
FormNilParameter signifies an error when a nil parameter is found in a form

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_param_nil",
  "meta": {
    "name": "param"
  }
}
```

`FormNotAllowedToDisableDefaultSecondFactor`
FormNotAllowedToDisableDefaultSecondFactor signifies an error when trying to disable the default flag from a second-factor

Status Code: 422

```json
{
  "shortMessage": "The default second factor method can only be changed by assigning another method as the default.",
  "longMessage": "The default second factor method can only be changed by assigning another method as the default.",
  "code": "form_disable_default_second_factor_not_allowed",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterArraySizeExceeded`
FormParameterArraySizeExceeded signifies an error when the given array exceeds the maximum allowed size

Status Code: 422

```json
{
  "shortMessage": "exceeds maximum size",
  "longMessage": "<parameter> should not exceed %d items.",
  "code": "form_param_array_size_exceeded",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterMaxLengthExceeded`
FormParameterMaxLengthExceeded signifies an error when the given param value exceeds the maximum allowed length

Status Code: 422

```json
{
  "shortMessage": "exceeds maximum length",
  "longMessage": "<parameter> should not exceed %d characters.",
  "code": "form_param_max_length_exceeded",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterMinLengthExceeded`
FormParameterMinLengthExceeded signifies an error when the given param value is less than the minimum allowed length

Status Code: 422

```json
{
  "shortMessage": "does not reach minimum length",
  "longMessage": "<parameter> must be at least %d characters long.",
  "code": "form_param_min_length_exceeded",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterNotAllowedConditionally`
FormParameterNotAllowedConditionally signifies an error when parameter is not allowed based on condition

Status Code: 422

```json
{
  "shortMessage": "is not allowed",
  "longMessage": "`<param>` isn't allowed when `<leftCondition>` is <rightCondition>.",
  "code": "form_conditional_param_disallowed",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterNotAllowedIfAnotherParameterIsPresent`
FormParameterNotAllowedIfAnotherParameterIsPresent signifies an error when a parameter is present but is not allowed because another parameter is also present

Status Code: 422

```json
{
  "shortMessage": "is not allowed",
  "longMessage": "`<notAllowedParam>` isn't allowed when `<existingParam>` is present.",
  "code": "form_conditional_param_disallowed",
  "meta": {
    "name": "notallowedparam"
  }
}
```

`FormParameterSizeTooLarge`
FormParameterSizeTooLarge signifies an error when a parameter exceeds the max allowed size

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_param_exceeds_allowed_size",
  "meta": {
    "name": "param"
  }
}
```

`FormParameterValueTooLarge`
Status Code: 422

```json
{
  "shortMessage": "Value too large",
  "longMessage": "The value of <param> can't be greater than %d",
  "code": "form_param_value_too_large",
  "meta": {
    "name": "param"
  }
}
```

`FormPasswordDigestInvalid`
FormPasswordDigestInvalid signifies an error when the provided password_digest is not valid for the provided password_hasher

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_password_digest_invalid_code",
  "meta": {
    "name": "param"
  }
}
```

`FormPasswordValidationFailed`
FormPasswordValidationFailed signifies a generic error when the password validation failed

Status Code: 422

```json
{
  "shortMessage": "Incorrect password. Please try again.",
  "longMessage": "Incorrect password. Please try again.",
  "code": "form_password_validation_failed",
  "meta": {
    "name": "param"
  }
}
```

`FormPwnedPassword`
FormPwnedPassword signifies an error when the chosen password has been found in the pwned list

Status Code: 422

```json
{
  "shortMessage": "",
  "code": "form_password_pwned",
  "meta": {
    "name": "param"
  }
}
```

`FormUnknownParameter`
FormUnknownParameter signifies an error when an unexpected parameter is found in a form

Status Code: 422

```json
{
  "shortMessage": "is unknown",
  "longMessage": "<param> is not a valid parameter for this request.",
  "code": "form_param_unknown",
  "meta": {
    "name": "param"
  }
}
```

`FormValidationFailed`
FormValidationFailed converts validator.ValidationErrors to Error.

Status Code: 422

```json
{
  "shortMessage": "is invalid",
  "longMessage": "<sanitizedField> is invalid",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "sanitizedfield"
  }
}
```

Home Url
`HomeURLTaken`
HomeURLTaken signifies an error when the root domain of the provided home_url already in use by another application

Status Code: 422

```json
{
  "shortMessage": "Domain already in use",
  "longMessage": "The <homeURL> root domain is already in use by another application.",
  "code": "home_url_taken",
  "meta": {
    "name": "paramname"
  }
}
```

`KnownHostingDomain`
KnownHostingDomain signifies an error when the domain extracted from the provided home_url belongs to a known hosting service and cannot be used to deploy production apps

Status Code: 422

```json
{
  "shortMessage": "Known hosting domain",
  "longMessage": "The <domain> domain cannot be used to deploy production apps.",
  "code": "known_hosting_domain",
  "meta": {
    "name": "paramname"
  }
}
```

`ReservedDomain`
ReservedDomain signifies an error when the domain extracted from the provided home_url is reserved by Clerk

Status Code: 422

```json
{
  "shortMessage": "Domain reserved by Clerk",
  "longMessage": "The <domain> domain is reserved by Clerk.",
  "code": "reserved_domain",
  "meta": {
    "name": "paramname"
  }
}
```

`ReservedSubdomain`
ReservedSubdomain signifies an error when the subdomain extracted from the provided home_url is reserved by Clerk

Status Code: 422

```json
{
  "shortMessage": "Reserved subdomain",
  "longMessage": "The <subdomain> subdomain is reserved by Clerk.",
  "code": "reserved_subdomain",
  "meta": {
    "name": "paramname"
  }
}
```

## Identifications

`CreateSecondFactorUnverified`
Status Code: 400

```json
{
  "shortMessage": "Create failed",
  "longMessage": "Unverified identifications cannot be a second factor",
  "code": "identification_create_second_factor_unverified"
}
```

`IdentificationNotFound`
IdentificationNotFound signifies an error when comm is not found

Status Code: 404

```json
{
  "shortMessage": "Resource not found",
  "longMessage": "Resource not found",
  "code": "resource_not_found"
}
```

`LastIdentificationSetFor2FAFailed`
Status Code: 400

```json
{
  "shortMessage": "Update failed",
  "longMessage": "You cannot set your last identification as second factor.",
  "code": "identification_update_failed"
}
```

`UpdateSecondFactorUnverified`
Status Code: 400

```json
{
  "shortMessage": "Update failed",
  "longMessage": "Cannot update second factor attributes for unverified identification",
  "code": "identification_update_second_factor_unverified"
}
```

## Images

`ImageNotFound`
Status Code: 404

```json
{
  "shortMessage": "Image not found",
  "longMessage": "Image not found",
  "code": "image_not_found"
}
```

`RequestWithoutImage`
RequestWithoutImage signifies an error when no image was present in the request.

Status Code: 400

```json
{
  "shortMessage": "Image file missing",
  "longMessage": "There was no image file present in the request",
  "code": "form_param_missing"
}
```

Instance Settings
`EnhancedEmailDeliverabilityProhibited`
Status Code: 422

```json
{
  "shortMessage": "Enhanced email deliverability mode is only compatible with email codes (OTP)",
  "longMessage": "Ensure that either enhanced email deliverability is disabled or you only have email codes (OTP) enabled.",
  "code": "enhanced_email_deliverability_prohibited"
}
```

## Instances

## BreaksInstanceInvariant

`BreaksInstanceInvariantCode`

Status Code: 400

```json
{
  "shortMessage": "Breaks instance invariant",
  "longMessage": "%v - This invariant is determined by your user settings",
  "code": "breaks_instance_invariant"
}
```

`InstanceNotFound`
InstanceNotFound signifies an error when no instance with given instanceID was found

Status Code: 404

```json
{
  "shortMessage": "Instance not found",
  "longMessage": "No instance was found with id <instanceID>",
  "code": "resource_not_found"
}
```

## Internal

`BadRequest`
Status Code: 400

```json
{
  "shortMessage": "Bad request",
  "longMessage": "Bad request",
  "code": "bad_request"
}
```

`QuotaExceeded`
403 - quota exceeded

Status Code: 403

```json
{
  "shortMessage": "Quota exceeded",
  "longMessage": "Quota exceeded, you have reached your limit.",
  "code": "quota_exceeded"
}
```

`Unexpected`
Unexpected is used for all unexpected errors

Status Code: 500

```json
{
  "shortMessage": "Oops, an unexpected error occurred",
  "longMessage": "There was an internal error on our servers. We've been notified and are working on fixing it.",
  "code": "internal_clerk_error"
}
```

## Invitations

`DuplicateInvitations`
DuplicateInvitations denotes an error when there are already invitations for the given email addresses

Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "There are already pending invitations for the following email addresses: <emails>",
  "code": "duplicate_record",
  "meta": {
    "emailaddresses": "emailaddresses"
  }
}
```

`InvitationAlreadyAccepted`
InvitationAlreadyAccepted denotes an error when someone tries to use an invitation which is already accepted.

Status Code: 400

```json
{
  "shortMessage": "Invitation is already accepted, try signing in instead.",
  "longMessage": "Invitation is already accepted, try signing in instead.",
  "code": "invitation_already_accepted"
}
```

`InvitationAlreadyRevoked`
InvitationAlreadyRevoked denotes an error when someone tries to revoke an invitation which is already revoked.

Status Code: 400

```json
{
  "shortMessage": "Invitation is already revoked.",
  "longMessage": "Invitation is already revoked.",
  "code": "invitation_already_revoked"
}
```

`InvitationNotFound`
InvitationNotFound denotes an error when there is no invitation with the given id

Status Code: 404

```json
{
  "shortMessage": "not found",
  "longMessage": "No invitation was found with id <invitationID>.",
  "code": "resource_not_found"
}
```

`InvitationsNotSupportedInInstance`
InvitationsNotSupportedInInstance denotes an error when user is trying to create an invitation on an instance that doesn't support it

Status Code: 400

```json
{
  "shortMessage": "Invitations are only supported on instances that accept email addresses.",
  "longMessage": "Invitations are only supported on instances that accept email addresses.",
  "code": "invitations_not_supported"
}
```

Jwt Templates
`JWTTemplateNotFound`
JWTTemplateNotFound signifies an error when a JWT template was not found by the provided attribute

Status Code: 404

```json
{
  "shortMessage": "JWT template not found",
  "longMessage": "No JWT template exists with <attribute>: <val>",
  "code": "resource_not_found"
}
```

`JWTTemplateReservedClaim`
JWTTemplateReservedClaim denotes an error when the provided template contains a reserved claim.

Status Code: 400

```json
{
  "shortMessage": "reserved claim used",
  "longMessage": "You can't use the reserved claim: '<claim>'",
  "code": "jwt_template_reserved_claim",
  "meta": {
    "name": "param"
  }
}
```

`SessionTokenTemplateNotDeletable`
Status Code: 403

```json
{
  "shortMessage": "session token template cannot be deleted",
  "longMessage": "This template cannot be deleted because it's a session token template",
  "code": "session_token_jwt_template"
}
```

Machine Token
`MachineTokenReservedClaim`
MachineTokenReservedClaim denotes an error when the provided machine token claims object contains a reserved claim.

Status Code: 400

```json
{
  "shortMessage": "reserved claim used",
  "longMessage": "You can't use the reserved claim: '<claim>'",
  "code": "machine_token_reserved_claim",
  "meta": {
    "name": "param"
  }
}
```

## Maintenance

`SystemUnderMaintenance`
Status Code: 503

```json
{
  "shortMessage": "System under maintenance",
  "longMessage": "We are currently undergoing maintenance and only essential operations are permitted. We will be back shortly.",
  "code": "maintenance_mode"
}
```

## Management

`DuplicateListItemsNotAllowed`
Status Code: 422

```json
{
  "shortMessage": "duplicate list items not allowed",
  "longMessage": "duplicate list items not allowed: <param>",
  "code": "duplicate_list_items_not_allowed"
}
```

`InvalidEnvironmentType`
Status Code: 400

```json
{
  "shortMessage": "invalid environment type",
  "longMessage": "invalid environment types: <envTypes>",
  "code": "invalid_environment_type"
}
```

## Oauth

`OAuthMissingAccessToken`
Status Code: 422

```json
{
  "shortMessage": "Missing OAuth access token",
  "longMessage": "OAuth access token is missing",
  "code": "oauth_missing_access_token"
}
```

`OAuthMissingRefreshToken`
Status Code: 422

```json
{
  "shortMessage": "Cannot refresh OAuth access token",
  "longMessage": "The current access token has expired and we cannot refresh it, because the authorization server hasn't provided us with a refresh token",
  "code": "oauth_missing_refresh_token"
}
```

`OAuthTokenProviderNotEnabled`
Status Code: 404

```json
{
  "shortMessage": "OAuth provider not enabled",
  "longMessage": "Single-sign on for this OAuth provider is not enabled in the instance settings.",
  "code": "oauth_token_provider_not_enabled"
}
```

`OAuthTokenRetrievalError`
Status Code: 400

```json
{
  "shortMessage": "Token retrieval failed",
  "longMessage": "Failed to retrieve a new access token from the OAuth provider",
  "code": "oauth_token_retrieval_error"
}
```

`UnsupportedOauthProvider`
UnsupportedOauthProvider signifies an error when an instance tries to enable an OAuth external provider which is not supported.

Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "%v OAuth is not supported. Please contact us if you think this error should not appear.",
  "code": "oauth_unsupported_provider"
}
```

Oauth Application
`DuplicateOAuthRedirectURI`
Status Code: 400

```json
{
  "shortMessage": "duplicate redirect URI",
  "longMessage": "the redirect URI already exists",
  "code": "duplicate_record"
}
```

`OAuthApplicationConsentScreenCannotBeDisabled`
Status Code: 422

```json
{
  "shortMessage": "consent screen cannot be disabled",
  "longMessage": "Consent screen cannot be disabled for a dynamically registered OAuth Application",
  "code": "oauth_application_consent_screen_cannot_be_disabled"
}
```

## Organizations

`MissingOrganizationPermission`
Status Code: 403

```json
{
  "shortMessage": "missing permission",
  "longMessage": "Current user is missing an organization permission.",
  "code": "missing_organization_permission",
  "meta": {
    "permissions": "permissions"
  }
}
```

`NotAMemberInOrganization`
403 - Only for organization members Deprecated: This error reveals the existence of an organization to an unauthorized user. Use OrganizationNotFoundOrUnauthorized instead, and ensure other pathways that error when the organization isn't found also use OrganizationNotFoundOrUnauthorized

Status Code: 403

```json
{
  "shortMessage": "not a member",
  "longMessage": "Current user is not a member of the organization. Only organization members can perform this action.",
  "code": "not_a_member_in_organization"
}
```

`OrganizationAlreadyHasSSOConnection`
Status Code: 422

```json
{
  "shortMessage": "this organization already has an SSO connection",
  "longMessage": "This organization already has an SSO connection.",
  "code": "organization_already_has_sso_connection",
  "meta": {
    "name": "organization_id"
  }
}
```

`OrganizationCreatorNotFound`
400 - Creator doesn't exist

Status Code: 400

```json
{
  "shortMessage": "creator not found",
  "longMessage": "No users found with id <userID>.",
  "code": "organization_creator_not_found"
}
```

`OrganizationDomainAlreadyExists`
Status Code: 422

```json
{
  "shortMessage": "organizaton domain already exists",
  "longMessage": "This domain is already used by another organization.",
  "code": "organization_domain_already_exists",
  "meta": {
    "name": "param"
  }
}
```

`OrganizationDomainBlocked`
Status Code: 422

```json
{
  "shortMessage": "blocked email domain",
  "longMessage": "This is a blocked email provider domain. Please use a different one.",
  "code": "organization_domain_blocked",
  "meta": {
    "name": "param"
  }
}
```

`OrganizationDomainCommon`
Status Code: 422

```json
{
  "shortMessage": "common email domain",
  "longMessage": "This is a common email provider domain. Please use a different one.",
  "code": "organization_domain_common",
  "meta": {
    "name": "param"
  }
}
```

`OrganizationDomainEnrollmentModeNotEnabled`
Status Code: 403

```json
{
  "shortMessage": "organization enrollment mode not enabled",
  "longMessage": "Enrollment mode <enrollmentMode> is not enabled for this instances's organizations.",
  "code": "organization_domain_enrollment_mode_not_enabled"
}
```

`OrganizationDomainQuotaExceeded`
Status Code: 403

```json
{
  "shortMessage": "organization domains quota exceeded",
  "longMessage": "You have reached your limit of %d domains per organization.",
  "code": "organization_domain_quota_exceeded"
}
```

`OrganizationInvitationNotUnique`
Status Code: 400

```json
{
  "shortMessage": "organization invitation not unique",
  "longMessage": "Organizations cannot have duplicate pending invitations for an email address.",
  "code": "organization_invitation_not_unique"
}
```

`OrganizationMissingCreatorRolePermissions`
Status Code: 422

```json
{
  "shortMessage": "missing permissions for creator role",
  "longMessage": "The creator role must contain the following permissions: <permissionKeys>",
  "code": "organization_missing_creator_role_permissions"
}
```

`OrganizationNameInvalid`
Status Code: 422

```json
{
  "shortMessage": "invalid organization name",
  "longMessage": "The organization name %q is invalid: <name>",
  "code": "form_param_value_invalid",
  "meta": {
    "name": "name"
  }
}
```

`OrganizationNotEnabledInInstance`
Status Code: 403

```json
{
  "shortMessage": "access denied",
  "longMessage": "The organizations feature is not enabled for this instance. You can enable it at <https://dashboard.clerk.com>.",
  "code": "organization_not_enabled_in_instance"
}
```

`OrganizationNotFound`
404 - Organization not found WARNING: This is safe to use for endpoints where the caller is authorized to be aware of every organization. But if the endpoint errors if the caller is not authorized on the organization, do not use this, because it leaks the existence of the organization! Use OrganizationNotFoundOrUnauthorized instead.

Status Code: 404

```json
{
  "shortMessage": "not found",
  "longMessage": "Given organization not found.",
  "code": "resource_not_found"
}
```

`OrganizationNotFoundOrUnauthorized`
404 - Used for any case

Status Code: 404

```json
{
  "shortMessage": "not found or unauthorized",
  "longMessage": "Given organization not found, or you don't have permission to access the organization",
  "code": "organization_not_found_or_unauthorized"
}
```

`OrganizationRoleNotFound`
Status Code: 404

```json
{
  "shortMessage": "not found",
  "longMessage": "Organization role not found",
  "code": "resource_not_found",
  "meta": {
    "name": "paramname"
  }
}
```

`OrganizationsDisableNotAllowed`
Status Code: 400

```json
{
  "shortMessage": "cannot disable organizations",
  "longMessage": "Cannot disable organizations because <reason>.",
  "code": "organizations_disable_not_allowed"
}
```

Redirect Urls
`RedirectURLNotFound`
RedirectURLNotFound signifies an error when a RedirectURL was not found by the provided attribute

Status Code: 404

```json
{
  "shortMessage": "Redirect url not found",
  "longMessage": "No RedirectURL exists with <attribute>: <val>",
  "code": "resource_not_found"
}
```

## Requests

`BulkSizeExceeded`
Status Code: 400

```json
{
  "shortMessage": "bulk size exceeded",
  "longMessage": "Parameters exceed the maximum allowed bulk processing size of %d.",
  "code": "bulk_size_exceeded"
}
```

`InvalidQueryParameterValue`
Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "<value> does not match one of the allowed values for parameter <param>",
  "code": "invalid_query_parameter_value"
}
```

`InvalidRequestBody`
InvalidRequestBody signifies an error when the body of the request does not conform to the expected format

Status Code: 400

```json
{
  "shortMessage": "Request body invalid",
  "longMessage": "The request body is invalid. Please consult the API documentation for more information.",
  "code": "request_body_invalid"
}
```

`MalformedPublishableKey`
Status Code: 400

```json
{
  "shortMessage": "Malformed publishable key",
  "longMessage": "Ensure the provided publishable key (<key>) is the one displayed in Dashboard",
  "code": "malformed_publishable_key"
}
```

`MalformedRequestParameters`
MalformedRequestParameters signifies an error when the request parameters are malformed and result in parsing errors

Status Code: 400

```json
{
  "shortMessage": "Malformed request parameters",
  "longMessage": "The request parameters are malformed and could not be parsed",
  "code": "malformed_request_parameters"
}
```

`MissingOneOfQueryParameters`
Status Code: 400

```json
{
  "shortMessage": "Missing query parameter",
  "longMessage": "Either of the following query parameters must be provided: <parameters>.",
  "code": "missing_query_parameter"
}
```

`MissingQueryParameter`
MissingQueryParameter denotes that the required query parameter, param, was not provided by the request.

Status Code: 400

```json
{
  "shortMessage": "",
  "longMessage": "The query parameter '<param>' is missing from the request. Please consult the API documentation for more information.",
  "code": "missing_query_parameter"
}
```

`UnsupportedContentType`
UnsupportedContentType signifies an error when provided content type is unsupported

Status Code: 415

```json
{
  "shortMessage": "Content-Type is unsupported",
  "longMessage": "Content-Type <actual> is unsupported. You should use <expected> instead.",
  "code": "unsupported_content_type"
}
```

## Saml

`SAMLConnectionCantBeActivated`
Status Code: 422

```json
{
  "shortMessage": "SAML Connection can't be activated",
  "longMessage": "You have to provide the <fields> before you are able to activate this connection.",
  "code": "saml_connection_cant_be_activated"
}
```

`SAMLFailedToFetchIDPMetadata`
Status Code: 400

```json
{
  "shortMessage": "Failed to fetch IdP metadata",
  "longMessage": "We failed to fetch the IdP metadata. If the error persists, please provide the IdP configuration data explicitly.",
  "code": "saml_failed_to_fetch_idp_metadata"
}
```

`SAMLFailedToParseIDPMetadata`
Status Code: 422

```json
{
  "shortMessage": "Failed to parse IdP metadata",
  "longMessage": "We failed to parse the IdP metadata. If the error persists, please provide the IdP configuration data explicitly.",
  "code": "saml_failed_to_parse_idp_metadata"
}
```

Session Refresh
`SessionRefreshConsumedExpiredSessionToken`
Status Code: 401

```json
{
  "shortMessage": "expired session token consumed",
  "longMessage": "The provided expired session token was already consumed in a previous refresh request",
  "code": "session_refresh_expired_session_token_consumed"
}
```

`SessionRefreshExpiredSessionTokenInvalid`
Status Code: 401

```json
{
  "shortMessage": "Invalid expired_token param",
  "longMessage": "The session token provided could not be successfully verified",
  "code": "expired_session_token_invalid"
}
```

`SessionRefreshExpiredSessionTokenTooOld`
Status Code: 401

```json
{
  "shortMessage": "session token too old",
  "longMessage": "The provided expired session token is too old",
  "code": "session_refresh_expired_session_token_too_old"
}
```

`SessionRefreshInactiveSession`
Status Code: 401

```json
{
  "shortMessage": "session inactive",
  "longMessage": "The provided session is not active",
  "code": "session_refresh_inactive_session"
}
```

`SessionRefreshIneligibleToken`
Status Code: 401

```json
{
  "shortMessage": "expired session token ineligible",
  "longMessage": "The provided expired session token is not eligible for refresh",
  "code": "session_refresh_session_token_ineligible"
}
```

`SessionRefreshInvalidRequestOrigin`
Status Code: 401

```json
{
  "shortMessage": "Request origin is invalid",
  "longMessage": "The request_origin parameter could not be parsed",
  "code": "refresh_request_origin_invalid"
}
```

`SessionRefreshMissingAZP`
Status Code: 401

```json
{
  "shortMessage": "missing 'azp' claim",
  "longMessage": "No 'azp' claim present in the provided expired session token",
  "code": "expired_session_token_missing_azp"
}
```

`SessionRefreshMissingIAT`
Status Code: 401

```json
{
  "shortMessage": "missing 'iat' claim",
  "longMessage": "No 'iat' claim present in the provided expired session token",
  "code": "session_refresh_expired_session_token_missing_iat"
}
```

`SessionRefreshMissingSID`
Status Code: 401

```json
{
  "shortMessage": "missing 'sid' claim",
  "longMessage": "No 'sid' claim present in the provided expired session token",
  "code": "expired_session_token_missing_sid"
}
```

`SessionRefreshNotEnabled`
Status Code: 401

```json
{
  "shortMessage": "not enabled",
  "longMessage": "This feature is not enabled in your instance",
  "code": "feature_not_enabled"
}
```

`SessionRefreshRequestOriginAZPMismatch`
Status Code: 401

```json
{
  "shortMessage": "Request origin does not match azp claim",
  "longMessage": "The request_origin parameter does not match the 'azp' claim of expired_token",
  "code": "refresh_request_origin_azp_mismatch"
}
```

`SessionRefreshSessionNotFound`
Status Code: 401

```json
{
  "shortMessage": "Session not found",
  "longMessage": "No session was found with id <sessionID>",
  "code": "session_refresh_session_not_found"
}
```

`SessionRefreshSIDMismatch`
Status Code: 401

```json
{
  "shortMessage": "Session ID does not match the 'sid' claim",
  "longMessage": "The 'sid' claim of the provided expired session token does not match the session ID provided in the request path",
  "code": "refresh_sid_mismatch"
}
```

`SessionRefreshTokenNotFound`
Status Code: 401

```json
{
  "shortMessage": "Refresh token not found",
  "longMessage": "The provided refresh token was not found",
  "code": "refresh_token_not_found"
}
```

`SessionRefreshUserNotFound`
Status Code: 401

```json
{
  "shortMessage": "user not found",
  "longMessage": "The provided user was not found",
  "code": "session_refresh_user_not_found"
}
```

## Sessions

`Deprovisioned`
Status Code: 401

```json
{
  "shortMessage": "account deprovisioned",
  "longMessage": "Your account is deprovisioned",
  "code": "deprovisioned"
}
```

`DeprovisionedBadRequest`
Status Code: 400

```json
{
  "shortMessage": "account deprovisioned",
  "longMessage": "The target user's account has been deprovisioned according to their external identity provider",
  "code": "deprovisioned"
}
```

`InvalidSessionToken`
Status Code: 400

```json
{
  "shortMessage": "Invalid session token",
  "longMessage": "The token provided could not be successfully verified",
  "code": "invalid_session_token"
}
```

`SessionNotFound`
SessionNotFound signifies an error when no session with given sessionID was found

Status Code: 404

```json
{
  "shortMessage": "Session not found",
  "longMessage": "No session was found with id <sessionID>",
  "code": "resource_not_found"
}
```

Sign In
`IdentificationClaimed`
IdentificationClaimed signifies an error when the requested identification is already claimed by another user

Status Code: 400

```json
{
  "shortMessage": "Identification claimed by another user",
  "longMessage": "One or more identifiers on this sign up have since been connected to a different User. Please sign up again.",
  "code": "identification_claimed"
}
```

Sign In Tokens
`SignInTokenCannotBeRevoked`
Status Code: 400

```json
{
  "shortMessage": "cannot revoke",
  "longMessage": "Sign in token cannot be revoked because its status is <status>. Only pending tokens can be revoked.",
  "code": "sign_in_token_cannot_be_revoked_code"
}
```

Sign Up
`InvalidValueForSignUpMode`
Status Code: 422

```json
{
  "shortMessage": "is not allowed",
  "longMessage": "`<param>` isn't allowed to be `%v` when sign-up mode is set to <value>",
  "code": "sign_up_mode_restricted_invalid_value",
  "meta": {
    "name": "param"
  }
}
```

`SignUpCannotBeUpdated`
Status Code: 403

```json
{
  "shortMessage": "Sign up cannot be updated",
  "longMessage": "This sign up has reached a terminal state and cannot be updated",
  "code": "sign_up_cannot_be_updated"
}
```

Signing Keys
`SigningKeyNotFound`
SigningKeyNotFound signifies an error when no signing key with a given signingKeyID was found

Status Code: 404

```json
{
  "shortMessage": "Signing key not found",
  "longMessage": "No signing key was found with id <signingKeyID>",
  "code": "resource_not_found"
}
```

Subscription Plans
`ProductNotSupportedBySubscriptionPlan`
Status Code: 400

```json
{
  "shortMessage": "Product not supported by subscription plan",
  "longMessage": "The product <productID> is not compatible with the current subscription plan",
  "code": "product_not_supported_by_subscription_plan"
}
```

## Templates

`InvalidTemplateBody`
Status Code: 422

```json
{
  "shortMessage": "Invalid template body",
  "longMessage": "This template body is invalid and cannot be rendered successfully, please check for syntax errors",
  "code": "invalid_template_body",
  "meta": {
    "name": "body"
  }
}
```

`RequiredVariableMissing`
Status Code: 422

```json
{
  "shortMessage": "",
  "longMessage": "Body should contain the {{<requiredVariable>}} variable",
  "code": "required_variable_missing",
  "meta": {
    "name": "body"
  }
}
```

`TemplateBodyModificationNotAllowed`
Status Code: 400

```json
{
  "shortMessage": "Template body cannot be modified",
  "longMessage": "The body of template with slug <slug> can't be modified",
  "code": "template_body_modification_restricted"
}
```

`TemplateDeletionRestricted`
TemplateDeletionRestricted signifies an error when a deletion is attempted for a built-in (non-custom) template

Status Code: 400

```json
{
  "shortMessage": "Template deletion restricted",
  "longMessage": "Template with slug <slug> can't be deleted",
  "code": "template_deletion_restricted"
}
```

`TemplateNotFound`
TemplateNotFound signifies an error when no template with given slug was found

Status Code: 404

```json
{
  "shortMessage": "Template not found",
  "longMessage": "No template was found with slug <slug>",
  "code": "resource_not_found"
}
```

`TemplateRevertRestricted`
TemplateRevertRestricted signifies an error when a custom template is attempted to be reverted

Status Code: 400

```json
{
  "shortMessage": "Template revert restricted",
  "longMessage": "Template with slug <slug> can't be reverted",
  "code": "template_revert_error"
}
```

`TemplateTypeUnsupported`
TemplateTypeUnsupported signifies an error when an invalid template type is provided

Status Code: 400

```json
{
  "shortMessage": "Template type not supported",
  "longMessage": "Template type <templateType> is not supported",
  "code": "template_type_unsupported"
}
```

## Totp

`InvalidTOTPSecret`
Status Code: 422

```json
{
  "shortMessage": "invalid TOTP secret",
  "longMessage": "The TOTP secret is invalid, please provide a valid one base32 encoded",
  "code": "invalid_totp_secret_code"
}
```

## Url

`URLNotFound`
Status Code: 404

```json
{
  "shortMessage": "URL not found",
  "longMessage": "The URL was not found",
  "code": "resource_not_found"
}
```

User Settings
`ResourceForbidden`
Status Code: 403

```json
{
  "shortMessage": "forbidden",
  "longMessage": "Resource forbidden",
  "code": "resource_forbidden"
}
```

`ResourceNotFound`
Status Code: 404

```json
{
  "shortMessage": "not found",
  "longMessage": "Resource not found",
  "code": "resource_not_found"
}
```

## Users

`IncorrectPassword`
Status Code: 422

```json
{
  "shortMessage": "incorrect password",
  "longMessage": "The provided password is not the one the user has set",
  "code": "incorrect_password"
}
```

`IncorrectTOTP`
Status Code: 422

```json
{
  "shortMessage": "incorrect TOTP",
  "longMessage": "The provided TOTP code is incorrect",
  "code": "totp_incorrect_code"
}
```

`InvalidLengthTOTP`
Status Code: 422

```json
{
  "shortMessage": "invalid length",
  "longMessage": "The provided TOTP code must be 6 characters long.",
  "code": "totp_invalid_length"
}
```

`NoPasswordSet`
Status Code: 400

```json
{
  "shortMessage": "no password set",
  "longMessage": "This user does not have a password set for their account",
  "code": "no_password_set"
}
```

`TOTPDisabled`
Status Code: 400

```json
{
  "shortMessage": "TOTP is disabled",
  "longMessage": "This user does not have TOTP enabled in their account",
  "code": "totp_disabled"
}
```

`UserBanned`
UserBanned signifies an error when a user is banned

Status Code: 403

```json
{
  "shortMessage": "User banned",
  "longMessage": "You have been banned. If you think this was by mistake, please contact support.",
  "code": "user_banned"
}
```

`UserDataMissing`
Status Code: 422

```json
{
  "shortMessage": "missing data",
  "longMessage": "%q data doesn't match user requirements set for this instance",
  "code": "form_data_missing",
  "meta": {
    "names": "missingparams"
  }
}
```

`UserNotFound`
UserNotFound signifies an error when no user is found with userID

Status Code: 404

```json
{
  "shortMessage": "not found",
  "longMessage": "No user was found with id <userID>",
  "code": "resource_not_found"
}
```

`UserQuotaExceeded`
Status Code: 403

```json
{
  "shortMessage": "user quota exceeded",
  "longMessage": "You have reached your limit of %d users. <maxAllowed>",
  "code": "user_quota_exceeded"
}
```

## Webhooks

`SvixAppMissing`
Status Code: 400

```json
{
  "shortMessage": "No Svix apps are associated with the current instance.",
  "longMessage": "No Svix apps are associated with the current instance.",
  "code": "svix_app_missing"
}
```
