/**
 * Data 노드 Auto Scaling Group(ASG) 생성
 * @param {Object} params - 요청 파라미터
 * @param {string} params.launchTemplateName - 시작 템플릿 이름
 * @param {number} params.minSize - 최소 인스턴스 수
 * @param {number} params.maxSize - 최대 인스턴스 수
 * @param {number} params.desiredCapacity - 원하는 인스턴스 수
 * @param {string} params.vpcZoneIdentifier - VPC 서브넷 ID
 * @returns {Object} - ASG 생성 결과
 */
import { CreateAutoScalingGroupCommand } from "@aws-sdk/client-auto-scaling";
import { autoScalingClient } from "../aws-client.js";

const createASG = async ({
  autoScalingGroupName,
  launchTemplateName,
  minSize,
  maxSize,
  desiredCapacity,
  vpcZoneIdentifiers,
  availabilityZones,
}) => {
  const command = new CreateAutoScalingGroupCommand({
    AutoScalingGroupName: autoScalingGroupName,
    LaunchTemplate: {
      LaunchTemplateName: launchTemplateName,
      Version: "$Latest",
    },
    MinSize: minSize || 1,
    MaxSize: maxSize || 2,
    DesiredCapacity: desiredCapacity || 2,
    VPCZoneIdentifier: vpcZoneIdentifiers.join(","),
    AvailabilityZones: availabilityZones,
    HealthCheckType: "EC2",
    HealthCheckGracePeriod: 300,
  });

  const response = await autoScalingClient.send(command);

  return response;
};

export default createASG;
