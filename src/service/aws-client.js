import "dotenv/config";
import { EC2Client } from "@aws-sdk/client-ec2";
import { ec2ClientConfig } from "../config/ec2-client-config.js";

/**
 * EC2Client 생성
 * @returns EC2Client
 */
const ec2Client = new EC2Client(ec2ClientConfig);

export default ec2Client;
