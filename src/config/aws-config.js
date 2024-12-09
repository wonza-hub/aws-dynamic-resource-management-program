import "dotenv/config";

// CONFIG: EC2 클라이언트 객체
export const ec2ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// CONFIG: Auto Scaling 클라이언트 객체
export const autoScalingClientConfig = {
  region: process.env.AWS_REGION,
};

// CONFIG: Cloud Watch 클라이언트 객체
export const cloudWatchClientConfig = {
  region: process.env.AWS_REGION,
};

// CONFIG: SNS 클라이언트 객체
export const snsClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};
