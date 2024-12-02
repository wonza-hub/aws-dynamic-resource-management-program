/**
 * SERVICE: 인스턴스를 시작하는 함수
 * @param {Array<string>} instanceIds - 시작할 인스턴스 ID 배열
 * @returns {Object} - 시작된 인스턴스 상태 정보
 */
import { getEC2Client } from "../aws-client.js";
import { StartInstancesCommand } from "@aws-sdk/client-ec2";

const startInstances = async (instanceIds) => {
  const client = getEC2Client();

  const input = {
    InstanceIds: instanceIds,
  };
  const command = new StartInstancesCommand(input);

  try {
    const { $metadata, StartingInstances } = await client.send(command);

    // 응답 데이터 가공
    const startedInstances = StartingInstances.map((instance) => ({
      InstanceId: instance.InstanceId,
      CurrentState: instance.CurrentState.Name,
      PreviousState: instance.PreviousState.Name,
    }));

    return {
      requestId: $metadata.requestId,
      status: "success",
      startedInstances,
    };
  } catch (error) {
    throw new Error(
      "Failed to start instances. Please check your input and try again."
    );
  }
};

export default startInstances;
