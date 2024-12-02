// ROUTER: EC2 인스턴스 관련 라우터
import { Router } from "express";
import {
  createInstances,
  listInstances,
  startInstances,
  rebootInstances,
  stopInstances,
  listImages,
  listAvailabilityRegions,
  listAvailabilityZones,
} from "../controller/ec2.controller.js";

const router = Router();
router.get("/instances", listInstances);
router.get("/images", listImages);
router.get("/availability-regions", listAvailabilityRegions);
router.get("/availability-zones", listAvailabilityZones);

router.post("/instances", createInstances);
router.put("/instances/start", startInstances);
router.put("/instances/reboot", rebootInstances);
router.put("/instances/stop", stopInstances);

export default router;
