/**
 * HTCondor의 특정 ASG에 대한 CPU 과부하 경보(SNS 포함)를 생성
 */
import { PutMetricAlarmCommand } from "@aws-sdk/client-cloudwatch";
import { cloudWatchClient } from "../aws-client.js";

const createHTCondorAlarm = async ({
  alarmName,
  threshold,
  policyArn,
  snsTopicArn,
  asgName,
}) => {
  const command = new PutMetricAlarmCommand({
    AlarmName: alarmName,
    MetricName: "CPUUtilization",
    Namespace: "AWS/EC2",
    Dimensions: [
      {
        Name: "AutoScalingGroupName",
        Value: asgName, // ASG의 이름
      },
    ],
    Statistic: "Average",
    Period: 300,
    EvaluationPeriods: 1,
    Threshold: threshold,
    ComparisonOperator: "GreaterThanOrEqualToThreshold",
    AlarmActions: [policyArn, snsTopicArn],
  });

  try {
    return await cloudWatchClient.send(command);
  } catch (error) {
    console.error("🚀 ~ error:", error);
    throw error;
  }
};

export default createHTCondorAlarm;
