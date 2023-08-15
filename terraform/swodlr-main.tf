resource "aws_s3_bucket" "swodlr-site-bucket" {
  bucket = local.ec2_resources_name
  acl    = "private"

  tags = local.default_tags
}

output "swodlr-bucket-name" {
  value = aws_s3_bucket.swodlr-site-bucket.id
}