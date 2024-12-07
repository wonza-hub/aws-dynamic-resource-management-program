/**
 * SERVICE: 인스턴스 목록을 조회하는 함수
 * @returns {Array} instances - 배열 형태의 인스턴스 정보
 */
import { DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

const listInstances = async () => {
  const command = new DescribeInstancesCommand({});
  try {
    const { Reservations } = await ec2Client.send(command);

    // 인스턴스 정보를 담을 배열
    const instances = [];

    Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        // 필요한 정보만 추출하여 객체 생성
        const instanceInfo = {
          Name:
            instance.Tags?.find((tag) => tag.Key === "Name")?.Value ||
            "No Name",
          InstanceId: instance.InstanceId || "N/A",
          State: instance.State?.Name || "Unknown",
          InstanceType: instance.InstanceType || "N/A",
          StatusCheck: instance.StateReason?.Message || "Unknown",
          // AlarmStatus: "Unknown", // CloudWatch 경보 상태가 필요한 경우 구현 필요
          AvailabilityZone: instance.Placement?.AvailabilityZone || "N/A",
          PublicIPv4DNS: instance.PublicDnsName || "N/A",
          PublicIPv4Address: instance.PublicIpAddress || "N/A",
          // ElasticIP: "N/A", // 탄력적 IP 정보 추가하려면 구현 필요
          IPv6Address:
            instance.NetworkInterfaces?.[0]?.Ipv6Addresses?.[0]?.Ipv6Address ||
            "N/A",
          Monitoring: instance.Monitoring?.State || "Unknown",
          SecurityGroupName:
            instance.SecurityGroups?.map((sg) => sg.GroupName).join(", ") ||
            "N/A",
        };

        // 인스턴스 정보를 배열에 추가
        instances.push(instanceInfo);
      });
    });

    // 추출한 인스턴스 정보 반환
    return instances;
  } catch (caught) {
    console.error("🚀 ~ listInstances ~ caught:", caught);
    return [];
  }
};

export default listInstances;
