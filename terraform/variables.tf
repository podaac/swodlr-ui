variable "stage" {}
variable "credentials" {}
variable "profile" {}
variable "app_version" {}
variable "cloudfront_distribution_id" {
  type = string
  description = "ID of the Cloudfront distribution routing public traffic to this app"
  sensitive   = true
}
variable "cloudfront_allow_vpcs" {
  type = string
  description = "List of VPC ids which will be given read access to S3 bucket. Primarily for use if cloudfront traffic is coming from a different VPC."
# Cannot be marked sensitive because it is used in a for_each https://github.com/hashicorp/terraform/issues/29744
}
variable "region" {
  default = "us-west-2"
}
variable "app_name" {
  default = "swodlr-ui"
}
variable "default_tags" {
  type    = map(string)
  default = {}
}
