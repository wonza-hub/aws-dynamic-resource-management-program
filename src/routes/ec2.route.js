// ROUTER: EC2 인스턴스 관련 라우터
import { Router } from "express";
import {
  createInstances,
  listInstances,
  listImages,
  listAvailabilityRegions,
  listAvailabilityZones,
  renderInstancesCreation,
  handleInstanceAction,
  createAutoScalingGroup,
  createCondorJob,
  renderCondorJobForm,
  getCondorDashboard,
} from "../controller/ec2.controller.js";
import multer from "multer";

const router = Router();
router.get("/instances", listInstances);
router.get("/images", listImages);
router.get("/availability-regions", listAvailabilityRegions);
router.get("/availability-zones", listAvailabilityZones);
router.get("/instances/create", renderInstancesCreation);
router.get("/htcondor/job-form", renderCondorJobForm);
router.get("/htcondor/dashboard", getCondorDashboard);

router.post("/instances", createInstances);
router.post("/asg", createAutoScalingGroup);

const upload = multer({ dest: "uploads/" });
router.post(
  "/htcondor/submit-job",
  upload.single("scriptFile"),
  createCondorJob
);

router.put("/instances/action", handleInstanceAction);

export default router;
