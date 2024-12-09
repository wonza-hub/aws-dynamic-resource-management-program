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
    AdjustmentType: adjustmentType, // "ChangeInCapacity"
    ScalingAdjustment: scalingAdjustment, // Number of instances to add
    Cooldown: 300, // Cooldown period in seconds
  });

  const response = await autoScalingClient.send(command);

  return response.PolicyARN; // Return the policy ARN to link with CloudWatch alarm
};

export default createAsgScalingPolicy;
