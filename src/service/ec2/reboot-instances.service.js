/**
 * SERVICE: 인스턴스를 재부팅하는 함수
 * @param {Array<string>} instanceIds - 재부팅할 인스턴스 ID 배열
 * @returns {Object} - 요청 ID와 상태 메시지
 */
import { getEC2Client } from "../aws-client.js";
import { RebootInstancesCommand } from "@aws-sdk/client-ec2";

const rebootInstances = async (instanceIds) => {
  const client = getEC2Client();

  const input = {
    InstanceIds: instanceIds,
  };
  const command = new RebootInstancesCommand(input);

  try {
    const { $metadata } = await client.send(command);

    // 응답 데이터 가공
    return {
      requestId: $metadata.requestId,
      status: "success",
      message: "Instances rebooted successfully",
    };
  } catch (error) {
    // 예외를 던져 컨트롤러에서 처리하도록 전달
    throw new Error("Failed to reboot instances");
  }
};

export default rebootInstances;
