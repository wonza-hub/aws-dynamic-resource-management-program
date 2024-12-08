/**
 * SERVICE: 리전을 조회하는 함수
 * @returns {Array} 리전 정보 배열
 */
import { DescribeRegionsCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

const listRegions = async () => {
  const command = new DescribeRegionsCommand();

  try {
    const { Regions } = await ec2Client.send(command);

    return Regions;
  } catch (error) {
    console.error("🚀 ~ listRegions ~ error:", error);
    return [];
  }
};

export default listRegions;
