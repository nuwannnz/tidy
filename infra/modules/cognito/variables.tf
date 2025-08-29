# modules/cognito/variables.tf
variable "environment" {
  type        = string
  description = "Environment name (e.g., dev, staging, prod)"
}

variable "project_name" {
  type        = string
  description = "Project name to be used as prefix"
  default     = "planit"
}

variable "custom_domain" {
  type        = string
  description = "Base domain for the environment (e.g., planit.dev)"
  default     = null
}

variable "additional_callback_urls" {
  type        = list(string)
  description = "Additional callback URLs besides the default ones"
  default     = []
}

variable "additional_logout_urls" {
  type        = list(string)
  description = "Additional logout URLs besides the default ones"
  default     = []
}

variable "tags" {
  type        = map(string)
  description = "Additional tags to apply to resources"
  default     = {}
}