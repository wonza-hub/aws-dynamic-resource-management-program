/**
 * SERVICE: EC2 인스턴스를 제어하는 함수
 * @param {string} action - 실행할 작업 ('reboot', 'start', 'stop')
 * @param {Array<string>} instanceIds - 제어할 인스턴스 ID 배열
 * @returns {Object} - 결과 정보
 */

import {
  RebootInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
} from "@aws-sdk/client-ec2";
import { ec2Client } from "../aws-client.js";

const controlInstances = async (action, instanceIds) => {
  const input = { InstanceIds: instanceIds };
  let command;

  switch (action) {
    case "reboot":
      command = new RebootInstancesCommand(input);
      break;
    case "start":
      command = new StartInstancesCommand(input);
      break;
    case "stop":
      command = new StopInstancesCommand(input);
      break;
    default:
      throw new Error(
        "Invalid action. Allowed actions are: reboot, start, stop."
      );
  }

  try {
    const response = await ec2Client.send(command);

    // 작업별 응답 처리
    if (action === "reboot") {
      return {
        requestId: response.$metadata.requestId,
        status: "success",
        message: "Instances rebooted successfully",
      };
    }

    const instancesKey =
      action === "start" ? "StartingInstances" : "StoppingInstances";
    const instances = response[instancesKey]?.map((instance) => ({
      InstanceId: instance.InstanceId,
      CurrentState: instance.CurrentState.Name,
      PreviousState: instance.PreviousState.Name,
    }));

    return {
      requestId: response.$metadata.requestId,
      status: "success",
      instances,
    };
  } catch (error) {
    throw new Error(
      `Failed to ${action} instances. Please check your input and try again.`
    );
  }
};

export default controlInstances;
