# configure the S3 backend for storing state. This allows different
# team members to control and update terraform state.
terraform {
  required_version = ">=1.2.7"

  backend "s3" {
    # This must be updated for each unique deployment/stage!
    # should  be of the form services/APP_NAME/STAGE/terraform.tfstate
    # We can't use variables in the key name here, so we need to be extra
    # careful with this!
    key = "services/swodlr-ui/terraform.tfstate"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">=4.56.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = local.default_tags
  }

  ignore_tags {
    key_prefixes = ["gsfc-ngap"]
  }
}

data "aws_caller_identity" "current" {}

locals {
  name        = var.app_name
  environment = var.stage

  # This is the convention we use to know what belongs to each other
  ec2_resources_name = terraform.workspace == "default" ? "podaac-svc-${local.environment}-${local.name}" : "podaac-svc-${local.environment}-${local.name}-${terraform.workspace}"

  # Account ID used for getting the ECR host
  account_id = data.aws_caller_identity.current.account_id

  default_tags = length(var.default_tags) == 0 ? {
    team : "TVA",
    application : local.ec2_resources_name,
    Environment = var.stage
    Version     = var.app_version
  } : var.default_tags
}
