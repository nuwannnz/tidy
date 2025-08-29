# modules/cognito/outputs.tf

# User Pool Outputs
output "user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.pool.id
}

output "user_pool_arn" {
  description = "ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.pool.arn
}

output "user_pool_endpoint" {
  description = "Endpoint name of the User Pool"
  value       = aws_cognito_user_pool.pool.endpoint
}

# Client Outputs
output "client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.client.id
}

output "client_secret" {
  description = "Secret of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.client.client_secret
  sensitive   = true
}

output "client_name" {
  description = "Name of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.client.name
}

# Domain Outputs
output "domain" {
  description = "Domain string for the Cognito User Pool"
  value       = var.custom_domain != null ? "${var.environment}.${var.custom_domain}" : null
}

output "domain_aws_account_id" {
  description = "The AWS account ID for the User Pool owner"
  value       = var.custom_domain != null ? aws_cognito_user_pool_domain.main[0].aws_account_id : null
}

output "domain_cloudfront_distribution" {
  description = "The ARN of the CloudFront distribution for the domain"
  value       = var.custom_domain != null ? aws_cognito_user_pool_domain.main[0].cloudfront_distribution_arn : null
}

# Configuration Outputs
output "callback_urls" {
  description = "List of allowed callback URLs for the client"
  value       = local.callback_urls
}

output "logout_urls" {
  description = "List of allowed logout URLs for the client"
  value       = local.logout_urls
}

# Auth Configuration
output "auth_flows" {
  description = "List of enabled authentication flows"
  value       = aws_cognito_user_pool_client.client.explicit_auth_flows
}

output "oauth_flows" {
  description = "List of allowed OAuth flows"
  value       = aws_cognito_user_pool_client.client.allowed_oauth_flows
}

output "oauth_scopes" {
  description = "List of allowed OAuth scopes"
  value       = aws_cognito_user_pool_client.client.allowed_oauth_scopes
}

# Token Configuration
output "token_validity" {
  description = "Token validity timeframes"
  value = {
    access_token  = "${aws_cognito_user_pool_client.client.access_token_validity} hours"
    id_token      = "${aws_cognito_user_pool_client.client.id_token_validity} hours"
    refresh_token = "${aws_cognito_user_pool_client.client.refresh_token_validity} days"
  }
}

# Additional Information
output "creation_date" {
  description = "Date the User Pool was created"
  value       = aws_cognito_user_pool.pool.creation_date
}

output "last_modified_date" {
  description = "Date the User Pool was last modified"
  value       = aws_cognito_user_pool.pool.last_modified_date
}

# Complete Configuration
output "complete_configuration" {
  description = "Complete configuration details for reference"
  value = {
    environment     = var.environment
    project_name    = var.project_name
    user_pool_name  = aws_cognito_user_pool.pool.name
    client_name     = aws_cognito_user_pool_client.client.name
    domain          = var.custom_domain != null ? "${var.environment}.${var.custom_domain}" : null
    callback_urls   = local.callback_urls
    logout_urls     = local.logout_urls
    tags           = merge(local.default_tags, var.tags)
  }
}