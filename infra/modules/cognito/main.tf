# modules/cognito/main.tf
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  default_callback_urls = [
    "https://${var.environment}.${var.custom_domain}/callback",
    "https://${var.environment}.${var.custom_domain}/auth",
    "http://localhost:3000/callback",
    "http://localhost:3000/auth"
  ]
  
  default_logout_urls = [
    "https://${var.environment}.${var.custom_domain}",
    "http://localhost:3000"
  ]

  callback_urls = distinct(concat(local.default_callback_urls, var.additional_callback_urls))
  logout_urls  = distinct(concat(local.default_logout_urls, var.additional_logout_urls))

  default_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}

resource "aws_cognito_user_pool" "pool" {
  name = "${local.name_prefix}-user-pool"

  # Standard attributes configuration
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length                   = 8
    require_lowercase               = true
    require_numbers                 = true
    require_symbols                 = true
    require_uppercase               = true
    temporary_password_validity_days = 7
  }

  # Email verification
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject       = "${title(var.project_name)} - Your verification code"
    email_message       = "Your verification code is {####}"
  }

  # Standard schema attributes
  schema {
    name                = "name"
    attribute_data_type = "String"
    required           = true
    mutable            = true
    
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required           = true
    mutable            = false

    string_attribute_constraints {
      min_length = 3
      max_length = 256
    }
  }

  tags = merge(local.default_tags, var.tags)
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "${local.name_prefix}-client"
  user_pool_id = aws_cognito_user_pool.pool.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  callback_urls = local.callback_urls
  logout_urls  = local.logout_urls
  
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true

  prevent_user_existence_errors = "ENABLED"
  
  refresh_token_validity = 30  # 30 days
  access_token_validity  = 1   # 1 hour
  id_token_validity     = 1    # 1 hour

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
}

# modules/cognito/main.tf
resource "aws_cognito_user_pool_domain" "main" {
  count        = var.custom_domain != null ? 1 : 0
  domain       = replace(lower("${var.environment}-${var.custom_domain}"), ".", "-")
  user_pool_id = aws_cognito_user_pool.pool.id
}