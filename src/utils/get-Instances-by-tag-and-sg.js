/**
 * 태그 키 및 접두사와 보안 그룹 기반으로 EC2 인스턴스 ID를 가져오는 함수
 * @param {string} securityGroupId - 보안 그룹 ID
 * @returns {Promise<string[]>} 인스턴스 ID 목록
 */
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../service/aws-client.js";

// 환경 변수 또는 설정 파일에서 태그 키 및 접두사 로드
const TAG_KEY = process.env.HTCONDOR_TAG_KEY || "Name";
const TAG_PREFIX = process.env.HTCONDOR_TAG_PREFIX || "HTCondor_";

export const getClusterInstancesByTagAndSG = async (securityGroupId) => {
  const command = new DescribeInstancesCommand({
    Filters: [
      {
        Name: "instance.group-id",
        Values: [securityGroupId], // 보안 그룹 필터
      },
    ],
  });

  const response = await ec2Client.send(command);

  const instanceIds = [];

  response.Reservations.forEach((reservation) => {
    reservation.Instances.forEach((instance) => {
      // 태그에서 키와 접두사가 일치하는 경우만 필터링
      const hasMatchingTag = instance.Tags?.some(
        (tag) => tag.Key === TAG_KEY && tag.Value.startsWith(TAG_PREFIX)
      );

      // 실행 중인 인스턴스인지 확인
      const isRunning = instance.State?.Name === "running";

      if (hasMatchingTag && isRunning) {
        instanceIds.push(instance.InstanceId);
      }
    });
  });

  return instanceIds;
};
