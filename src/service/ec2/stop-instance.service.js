/**
 * SERVICE: 인스턴스를 중지시키는 함수
 * @param {Array<string>} instanceIds - 중지할 인스턴스 ID 배열
 * @returns {Object} - 중지된 인스턴스 상태 정보
 */
import { StopInstancesCommand } from "@aws-sdk/client-ec2";
import ec2Client from "../aws-client.js";

const stopInstances = async (instanceIds) => {
  const input = {
    InstanceIds: instanceIds,
  };
  const command = new StopInstancesCommand(input);

  try {
    const { $metadata, StoppingInstances } = await ec2Client.send(command);

    // 응답 데이터 가공
    const stoppedInstances = StoppingInstances.map((instance) => ({
      InstanceId: instance.InstanceId,
      CurrentState: instance.CurrentState.Name,
      PreviousState: instance.PreviousState.Name,
    }));

    return {
      requestId: $metadata.requestId,
      status: "success",
      stoppedInstances,
    };
  } catch (error) {
    throw new Error(
      "Failed to stop instances. Please check your input and try again."
    );
  }
};

export default stopInstances;
