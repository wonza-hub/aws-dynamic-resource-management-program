import { DescribeImagesCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

export const listAvailableAMIs = async () => {
  const command = new DescribeImagesCommand({
    Owners: ["self"],
  });

  const { Images } = await ec2Client.send(command);

  return Images.map((image) => ({
    imageId: image.ImageId,
    name: image.Name || "Unnamed AMI",
  }));
};
