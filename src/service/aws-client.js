import "dotenv/config";
import { EC2Client } from "@aws-sdk/client-ec2";
import { ec2ClientConfig } from "../config/ec2-client-config.js";

/**
 * EC2Client 생성 함수
 * @returns EC2Client
 */
export const getEC2Client = () => {
  return new EC2Client(ec2ClientConfig);
};
