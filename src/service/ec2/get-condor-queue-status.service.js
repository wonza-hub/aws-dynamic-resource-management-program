/**
 * SERVICE: HTCondor 큐 상태를 조회
 * @returns {Promise}
 */
import { Client } from "ssh2";
import "dotenv/config";
import fs from "fs";
import path from "path";

const getCondorQueueStatus = async (instanceIp, username = "ec2-user") => {
  const privateKey = fs.readFileSync(
    path.join(process.cwd(), "private-key.pem"),
    "utf-8"
  );
  // SSH 접속을 위한 연결 클라이언트 객체 생성
  const conn = new Client();

  return new Promise((resolve, reject) => {
    conn
      .on("ready", () => {
        conn.exec("condor_q", (err, stream) => {
          if (err) {
            reject(err);
            return;
          }

          let output = "";
          stream.on("data", (data) => {
            output += data;
          });

          stream.on("close", (code, signal) => {
            if (code === 0) {
              resolve(output);
            } else {
              reject(new Error("condor_q 실행 실패"));
            }
            conn.end();
          });
        });
      })
      .connect({
        host: instanceIp,
        port: 22,
        username: username,
        privateKey: privateKey,
      });
  });
};

export default getCondorQueueStatus;
