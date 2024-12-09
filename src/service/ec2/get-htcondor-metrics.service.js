/**
 * SERVICE: CloudWatch로 클러스터 메트릭 조회
 * @param {Array} instanceIds 클러스터의 EC2 인스턴스 ID 목록
 * @returns {Promise} 클러스터 메트릭 데이터
 */
import { GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import { cloudWatchClient } from "../aws-client.js";
import { getClusterInstancesByTagAndSG } from "../../utils/get-Instances-by-tag-and-sg.js";
import "dotenv/config";

const getHTCondorMetrics = async () => {
  // HTCondor 클러스터 구성 인스턴스 ID 조회
  const instanceIds = await getClusterInstancesByTagAndSG(
    process.env.HTCondor_SG_ID
  );
  const endTime = new Date(); // 현재 시간
  const startTime = new Date(endTime.getTime() - 900 * 1000);

  const metricQueries = instanceIds.map((instanceId, index) => ({
    Id: `cpuUsage${index}`,
    MetricStat: {
      Metric: {
        Namespace: "AWS/EC2",
        MetricName: "CPUUtilization",
        Dimensions: [
          {
            Name: "InstanceId",
            Value: instanceId,
          },
        ],
      },
      Period: 60,
      Stat: "Average",
    },
    ReturnData: true,
  }));

  const command = new GetMetricDataCommand({
    MetricDataQueries: metricQueries,
    StartTime: startTime,
    EndTime: endTime,
  });

  const { MetricDataResults } = await cloudWatchClient.send(command);

  return MetricDataResults;
};

export default getHTCondorMetrics;
