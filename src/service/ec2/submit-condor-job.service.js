/**
 * SERVICE: HTCondor 작업 제출
 */
import fs from "fs";
import path from "path";
import { Client } from "ssh2";

// CRLF를 LF로 변환하는 함수
const convertToUnixStyle = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const unixContent = content.replace(/\r\n/g, "\n");
  fs.writeFileSync(filePath, unixContent, "utf-8");
};

const submitCondorJob = (controlNodeIp, args, scriptFile) => {
  return new Promise((resolve, reject) => {
    const privateKeyPath = path.join(process.cwd(), "private-key.pem");
    const privateKey = fs.readFileSync(privateKeyPath, "utf-8");

    const conn = new Client();

    // 업로드된 파일 경로
    const uploadedFilePath = path.join(
      process.cwd(),
      "uploads",
      scriptFile.filename
    );

    if (!fs.existsSync(uploadedFilePath)) {
      return reject(new Error("업로드된 파일을 찾을 수 없습니다."));
    }

    // 파일을 Unix 스타일로 변환
    convertToUnixStyle(uploadedFilePath);

    // EC2 상의 경로
    const remoteScriptPath = `/home/ec2-user/condor/scripts/${scriptFile.originalname}`;
    const remoteJdsPath = `/home/ec2-user/condor/scripts/${scriptFile.originalname}.jds`;

    conn
      .on("ready", () => {
        conn.sftp((err, sftp) => {
          if (err) {
            return reject(new Error("SFTP 연결 중 오류가 발생했습니다."));
          }

          // 스크립트 파일 전송
          const remoteStream = sftp.createWriteStream(remoteScriptPath);
          const localStream = fs.createReadStream(uploadedFilePath);

          localStream.pipe(remoteStream);

          remoteStream.on("close", () => {
            // 스크립트에 실행 권한 부여
            conn.exec(`chmod +x ${remoteScriptPath}`, (err) => {
              if (err) {
                conn.end();
                throw new Error("스크립트 실행 권한 설정 실패");
              }
            });
            // JDS 파일 생성
            const jdsContent = `
executable = ${remoteScriptPath}
arguments = ${args ? args.join(" ") : ""}
output = /home/ec2-user/condor/logs/${scriptFile.originalname}.out
error = /home/ec2-user/condor/logs/${scriptFile.originalname}.err
log = /home/ec2-user/condor/logs/${scriptFile.originalname}.log
queue
`;
            const localJdsPath = path.join(
              process.cwd(),
              "uploads",
              `${scriptFile.originalname}.jds`
            );
            fs.writeFileSync(localJdsPath, jdsContent);

            // JDS 파일을 Unix 스타일로 변환 후 전송
            convertToUnixStyle(localJdsPath);
            const remoteJdsStream = sftp.createWriteStream(remoteJdsPath);
            const localJdsStream = fs.createReadStream(localJdsPath);

            localJdsStream.pipe(remoteJdsStream);

            remoteJdsStream.on("close", () => {
              // condor_submit 실행
              conn.exec(`condor_submit ${remoteJdsPath}`, (err, stream) => {
                if (err) {
                  return reject(
                    new Error("condor_submit 실행 중 오류가 발생했습니다.")
                  );
                }

                let output = "";
                stream.on("data", (data) => {
                  output += data.toString();
                });

                stream.on("close", (code) => {
                  conn.end(); // 연결 종료
                  if (code === 0) {
                    console.log("HTCondor 작업 제출 성공:", output);
                    const jobIdMatch = output.match(/cluster (\d+)/);
                    const jobId = jobIdMatch ? jobIdMatch[1] : null;
                    resolve(jobId || "알 수 없는 작업 ID");
                  } else {
                    reject(new Error(`condor_submit 실행 실패: ${output}`));
                  }
                });
              });
            });

            remoteJdsStream.on("error", (err) => {
              reject(new Error("JDS 파일 전송 중 오류가 발생했습니다."));
            });
          });

          remoteStream.on("error", (err) => {
            reject(new Error("스크립트 파일 전송 중 오류가 발생했습니다."));
          });
        });
      })
      .connect({
        host: controlNodeIp,
        port: 22,
        username: "ec2-user",
        privateKey: privateKey,
      });
  });
};

export default submitCondorJob;
