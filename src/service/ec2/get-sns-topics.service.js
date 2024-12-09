/**
 * SNS Topics 조회
 * @returns {Promise<Array>} - SNS Topic ARN 목록
 */
import { ListTopicsCommand } from "@aws-sdk/client-sns";
import { snsClient } from "../aws-client.js";

const getSNSTopics = async () => {
  const command = new ListTopicsCommand({});

  try {
    const { Topics } = await snsClient.send(command);

    return Topics.map((topic) => topic.TopicArn);
  } catch (error) {
    console.error("🚀 ~ getSNSTopics ~ error:", error);
    throw new Error("SNS Topics 조회 중 오류 발생");
  }
};

export default getSNSTopics;
