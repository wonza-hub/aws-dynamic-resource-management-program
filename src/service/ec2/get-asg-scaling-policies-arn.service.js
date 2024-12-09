/**
 * SERVICE: ASG의 자동 조정 정책 ARN을 조회
 * @returns {Promise<String>} - 정책 ARN
 */
import { DescribePoliciesCommand } from "@aws-sdk/client-auto-scaling";
import { autoScalingClient } from "../aws-client.js";

const getAsgScalingPolicyArn = async (asgName) => {
  const command = new DescribePoliciesCommand({
    AutoScalingGroupName: asgName,
  });

  try {
    const response = await autoScalingClient.send(command);
    const policy = response.ScalingPolicies[0];
    const policyArn = policy.PolicyARN;

    return policyArn;
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return null;
  }
};

export default getAsgScalingPolicyArn;
