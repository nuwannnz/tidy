# PlanIt IaC

This project contains the infrastructure as code for Tidy using Terraform.

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or newer)
- AWS CLI configured with appropriate credentials
- Environment variables set up:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` or `AWS_DEFAULT_REGION`

## Environment Configuration

### Setting Up AWS Credentials

Export your AWS credentials as environment variables:

```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
export AWS_REGION="your_region"
```

### Environment-Specific Configurations

Each environment (dev, staging, prod) has its own directory with specific configurations:

- `main.tf` - Main Terraform configuration
- `variables.tf` - Variable declarations
- `terraform.tfvars` - Environment-specific values

## Usage

1. Navigate to the desired environment directory:
2. Run `terraform init`
3. Run `terraform plan`
4. Run `terraform apply`
