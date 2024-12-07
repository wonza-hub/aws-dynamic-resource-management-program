/**
 * SERVICE: 가용 영역을 조회하는 함수
 * @returns {Array} 가용 영역 정보를 담은 배열
 */
import { DescribeAvailabilityZonesCommand } from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

const listAvailabilityZones = async () => {
  const command = new DescribeAvailabilityZonesCommand();

  try {
    const { AvailabilityZones } = await ec2Client.send(command);

    const zones = AvailabilityZones.map((zone) => ({
      ZoneName: zone.ZoneName || "N/A", // 가용 영역 이름
      State: zone.State || "Unknown", // 가용 영역 상태
      RegionName: zone.RegionName || "N/A", // 리전 이름
      GroupName: zone.GroupName || "N/A", // 그룹 이름
    }));

    return zones;
  } catch (caught) {
    console.error("🚀 ~ listAvailabilityZones ~ caught:", caught);
    return [];
  }
};

export default listAvailabilityZones;
