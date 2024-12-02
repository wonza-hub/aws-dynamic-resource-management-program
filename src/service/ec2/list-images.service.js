/**
 * SERVICE: 이미지 목록을 조회하는 함수
 * @returns {Array} 이미지 정보를 담은 배열
 */
import { getEC2Client } from "../aws-client.js";
import { DescribeImagesCommand } from "@aws-sdk/client-ec2";

const listImages = async () => {
  const client = getEC2Client();

  const command = new DescribeImagesCommand({ Owners: ["self"] });

  try {
    const { Images } = await client.send(command);

    const imageList = Images.map((image) => ({
      ImageId: image.ImageId || "N/A", // 이미지 ID
      Name: image.Name || "No Name", // 이미지 이름
      State: image.State || "Unknown", // 이미지 상태
      Architecture: image.Architecture || "Unknown", // 아키텍처
      CreationDate: image.CreationDate || "N/A", // 생성 날짜
      Description: image.Description || "No Description", // 이미지 설명
      RootDeviceType: image.RootDeviceType || "N/A", // 루트 디바이스 타입
      VirtualizationType: image.VirtualizationType || "N/A", // 가상화 타입
      OwnerId: image.OwnerId || "N/A", // 소유자 ID
      SourceInstanceId: image.SourceInstanceId || "N/A", // 원본 인스턴스 ID
    }));

    return imageList;
  } catch (caught) {
    console.error("🚀 ~ listImages ~ caught:", caught);
    return [];
  }
};

export default listImages;
