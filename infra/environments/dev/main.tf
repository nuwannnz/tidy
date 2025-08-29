terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Using a recent stable version
    }
  }

  backend "s3" {
    bucket = "planit-iac-state-dev"
    key    = "dev/terraform.tfstate"
    region = "ap-south-1"
    # dynamodb_table = "terraform-locks"
    encrypt = true
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "ap-south-1"
}

module "cognito" {
  source = "../../modules/cognito"

  environment   = "dev"
  custom_domain = "planit"
}