/**
 * SERVICE: 인스턴스를 생성하는 함수
 * @param {string} imageId - 생성할 인스턴스에 사용할 이미지 ID
 * @param {number} maxCount - 생성할 인스턴스 수
 * @param {string} baseName - 인스턴스 이름의 기본 값
 * @returns {Object} - 생성된 인스턴스 및 요청 정보
 */
import { getEC2Client } from "../aws-client.js";
import {
  RunInstancesCommand,
  DescribeSubnetsCommand,
  CreateTagsCommand,
} from "@aws-sdk/client-ec2";
import { v4 as uuidv4 } from "uuid";

const createInstances = async ({ imageId, maxCount, baseName }) => {
  const client = getEC2Client();

  const describeSubnetsCommand = new DescribeSubnetsCommand({});

  try {
    // 서브넷 ID 조회
    const subnetsData = await client.send(describeSubnetsCommand);
    const subnetId = subnetsData.Subnets[0]?.SubnetId;

    if (!subnetId) {
      throw new Error("No subnet found. Please create a subnet in your VPC.");
    }

    // 인스턴스 생성 입력
    const input = {
      MaxCount: maxCount,
      MinCount: 1,
      ImageId: imageId,
      InstanceType: "t2.micro",
      SubnetId: subnetId,
    };

    const command = new RunInstancesCommand(input);

    // 인스턴스 생성 명령 실행
    const { $metadata, Instances } = await client.send(command);

    // 생성된 인스턴스 정보 가공
    const createdInstances = Instances.map((instance) => {
      const uniqueId = uuidv4().split("-")[0]; // 고유 ID 생성
      const name = `${baseName}_${uniqueId}`;
      return {
        InstanceId: instance.InstanceId,
        Name: name,
        State: instance.State.Name,
        PrivateIpAddress: instance.PrivateIpAddress,
        PublicDnsName: instance.PublicDnsName || "N/A",
        ImageId: instance.ImageId,
        InstanceType: instance.InstanceType,
        LaunchTime: instance.LaunchTime,
        AvailabilityZone: instance.Placement.AvailabilityZone,
      };
    });

    // 각 인스턴스에 고유한 이름 태그 추가
    for (const instance of createdInstances) {
      const tagCommand = new CreateTagsCommand({
        Resources: [instance.InstanceId],
        Tags: [
          {
            Key: "Name",
            Value: instance.Name,
          },
        ],
      });

      await client.send(tagCommand); // 태그 추가 요청
    }

    return {
      requestId: $metadata.requestId,
      status: "success",
      createdInstances,
    };
  } catch (error) {
    throw new Error(
      "Failed to create instances. Please check your input and try again."
    );
  }
};

export default createInstances;
