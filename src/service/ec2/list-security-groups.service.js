import { DescribeSecurityGroupsCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

export const listSecurityGroups = async () => {
  const command = new DescribeSecurityGroupsCommand({});

  const { SecurityGroups } = await ec2Client.send(command);

  return SecurityGroups.map((sg) => ({
    groupId: sg.GroupId,
    groupName: sg.GroupName,
  }));
};
