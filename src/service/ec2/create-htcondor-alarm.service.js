/**
 * HTCondor의 CPU 과부하에 대한 알람(SNS 포함)을 생성
 */
import { PutMetricAlarmCommand } from "@aws-sdk/client-cloudwatch";
import { cloudWatchClient } from "../aws-client.js";

const createHTCondorAlarm = async ({
  alarmName,
  threshold,
  policyArn,
  snsTopicArn,
}) => {
  const command = new PutMetricAlarmCommand({
    AlarmName: alarmName,
    MetricName: "CPUUtilization",
    Namespace: "AWS/EC2",
    Statistic: "Average",
    Period: 60,
    EvaluationPeriods: 2,
    Threshold: threshold,
    ComparisonOperator: "GreaterThanOrEqualToThreshold",
    AlarmActions: [policyArn, snsTopicArn],
  });

  try {
    return await cloudWatchClient.send(command);
  } catch (error) {
    console.error("🚀 ~ error:", error);
  }
};

export default createHTCondorAlarm;
