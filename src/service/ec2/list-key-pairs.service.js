import { DescribeKeyPairsCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

export const listKeyPairs = async () => {
  const command = new DescribeKeyPairsCommand({});

  const { KeyPairs } = await ec2Client.send(command);

  return KeyPairs.map((keyPair) => ({
    keyName: keyPair.KeyName,
  }));
};
