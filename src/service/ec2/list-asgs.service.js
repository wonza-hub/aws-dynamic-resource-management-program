/**
 * 모든 ASG를 조회하는 서비스
 * @returns {Promise<Array>} ASG 목록
 */
import { DescribeAutoScalingGroupsCommand } from "@aws-sdk/client-auto-scaling";
import { autoScalingClient } from "../aws-client.js";

const listASGs = async () => {
  const command = new DescribeAutoScalingGroupsCommand({});
  const response = await autoScalingClient.send(command);

  // ASG 목록 반환
  return response.AutoScalingGroups.map((asg) => ({
    name: asg.AutoScalingGroupName,
    minSize: asg.MinSize,
    maxSize: asg.MaxSize,
    desiredCapacity: asg.DesiredCapacity,
    launchTemplate: asg.LaunchTemplate?.LaunchTemplateName || "N/A",
    instances: asg.Instances.map((instance) => ({
      id: instance.InstanceId,
      lifecycleState: instance.LifecycleState,
    })),
  }));
};

export default listASGs;
