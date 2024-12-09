import "dotenv/config";
import { EC2Client } from "@aws-sdk/client-ec2";
import { AutoScalingClient } from "@aws-sdk/client-auto-scaling";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { SNSClient } from "@aws-sdk/client-sns";
import {
  autoScalingClientConfig,
  cloudWatchClientConfig,
  ec2ClientConfig,
  snsClientConfig,
} from "../config/aws-config.js";

/**
 * EC2 Client 생성
 * @returns EC2Client
 */
export const ec2Client = new EC2Client(ec2ClientConfig);

/**
 * Auto Scaling Client 생성
 * @returns AutoScalingClient
 */
export const autoScalingClient = new AutoScalingClient(autoScalingClientConfig);

/**
 * CloudWatch Client 생성
 * @returns CloudWatchClient
 */
export const cloudWatchClient = new CloudWatchClient(cloudWatchClientConfig);

/**
 * SNS Client 생성
 * @returns SNSClient
 */
export const snsClient = new SNSClient(snsClientConfig);
