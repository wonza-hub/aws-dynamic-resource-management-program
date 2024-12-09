/**
 * SERVICE: ASG의 자동 조정 정책을 생성하는 함수
 * @returns {Promise<String>} - 정책 ARN
 */
import { PutScalingPolicyCommand } from "@aws-sdk/client-auto-scaling";
import { autoScalingClient } from "../aws-client.js";

const createAsgScalingPolicy = async ({
  asgName,
  policyName,
  adjustmentType,
  scalingAdjustment,
}) => {
  const command = new PutScalingPolicyCommand({
    AutoScalingGroupName: asgName,
    PolicyName: policyName,
    AdjustmentType: adjustmentType,
    ScalingAdjustment: scalingAdjustment,
    Cooldown: 60,
  });

  const { PolicyARN } = await autoScalingClient.send(command);

  return PolicyARN;
};

export default createAsgScalingPolicy;
