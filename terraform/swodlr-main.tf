resource "aws_s3_bucket" "swodlr-site-bucket" {
  bucket = local.ec2_resources_name

  tags = local.default_tags
}

resource "aws_s3_bucket_acl" "private-acl" {
   bucket = aws_s3_bucket.swodlr-site-bucket.id
   acl = "private"
   depends_on = [aws_s3_bucket_ownership_controls.private_acl_ownership]
}

resource "aws_s3_bucket_ownership_controls" "private_acl_ownership" {
   bucket = aws_s3_bucket.swodlr-site-bucket.id
   rule {
     object_ownership = "ObjectWriter"
   }
}



output "swodlr-bucket-name" {
  value = aws_s3_bucket.swodlr-site-bucket.id
}
