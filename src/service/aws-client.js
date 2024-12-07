import "dotenv/config";
import { EC2Client } from "@aws-sdk/client-ec2";
import { AutoScalingClient } from "@aws-sdk/client-auto-scaling";
import {
  autoScalingClientConfig,
  ec2ClientConfig,
} from "../config/ec2-config.js";

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
