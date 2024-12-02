/**
 * SERVICE: 가용 리전을 조회하는 함수
 * @returns {Array} 가용 리전 정보 배열
 */
import { getEC2Client } from "../aws-client.js";
import { DescribeAvailabilityZonesCommand } from "@aws-sdk/client-ec2";

const listAvailabilityZones = async () => {
  const client = getEC2Client();

  const command = new DescribeAvailabilityZonesCommand();

  try {
    const { AvailabilityZones } = await client.send(command);

    const zones = AvailabilityZones.map((zone) => ({
      ZoneName: zone.ZoneName || "N/A", // 가용 영역 이름
      State: zone.State || "Unknown", // 가용 영역 상태
      ZoneId: zone.ZoneId || "N/A", // 가용 영역 ID
      RegionName: zone.RegionName || "N/A", // 리전 이름
    }));

    return zones;
  } catch (caught) {
    console.error("🚀 ~ listAvailabilityZones ~ caught:", caught);
    return [];
  }
};

export default listAvailabilityZones;
