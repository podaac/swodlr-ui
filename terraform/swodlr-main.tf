data "aws_cloudfront_origin_access_identity" "cf_oai" {
  id = var.cloudfront_distribution_id
}

data "aws_iam_policy_document" "allow_cloudfront" {
  statement {
    sid    = ""
    effect = "Allow"

    resources = [
      "${aws_s3_bucket.swodlr-site-bucket.arn}/*",
      aws_s3_bucket.swodlr-site-bucket.arn,
    ]

    actions = [
      "s3:GetObject*",
      "s3:ListBucket",
    ]

    principals {
      type        = "AWS"
      identifiers = [data.aws_cloudfront_origin_access_identity.cf_oai.iam_arn]
    }
  }

  dynamic "statement" {
    for_each = { for idx, vpc_id in local.vpc_list: idx => vpc_id}
    content {
      sid    = "Internet-Services-VPC-Access-${format("%02d", statement.key + 1)}"
      effect = "Allow"

      resources = [
        "${aws_s3_bucket.swodlr-site-bucket.arn}/*",
        aws_s3_bucket.swodlr-site-bucket.arn,
      ]

      actions = [
        "s3:GetObject*",
        "s3:ListBucket",
      ]

      condition {
        test     = "StringEquals"
        variable = "aws:sourceVpc"
        values   = [statement.value]
      }

      principals {
        type        = "*"
        identifiers = ["*"]
      }
    }
  }
}

resource "aws_s3_bucket" "swodlr-site-bucket" {
  bucket = local.ec2_resources_name

  tags = local.default_tags
}

resource "aws_s3_bucket_policy" "allow_cloudfront_access" {
  bucket = aws_s3_bucket.swodlr-site-bucket.id
  policy = data.aws_iam_policy_document.allow_cloudfront.json
}

resource "aws_s3_bucket_acl" "private-acl" {
  bucket     = aws_s3_bucket.swodlr-site-bucket.id
  acl        = "private"
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
