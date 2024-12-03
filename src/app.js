import express from "express";
import { ec2Router } from "./routes/index.js";

const app = express();

//미들웨어 설정
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSON 데이터 파싱

// 뷰 설정
app.set("view engine", "ejs");
app.set("views", `${process.cwd()}/views`);

// 정적 리소스 경로 설정
app.use(express.static(`${process.cwd()}/public`));
//라우터 설정
app.use("/ec2", ec2Router);

export default app;
