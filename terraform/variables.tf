variable "stage" {}
variable "credentials" {}
variable "profile" {}
variable "app_version" {}
variable "region" {
  default = "us-west-2"
}
variable "app_name" {
  default = "swodlr"
}
variable "default_tags" {
  type    = map(string)
  default = {}
}
