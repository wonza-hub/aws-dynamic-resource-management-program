// 여러 개의 서비스 함수들을 ec2Service 객체로 통합
import controlInstances from "./control-instances.service.js";
import createInstances from "./create-instances.service.js";
import getCondorQueueStatus from "./get-condor-queue-status.service.js";
import getCondorStatus from "./get-condor-status.service.js";
import getHTCondorMetrics from "./get-htcondor-metrics.service.js";
import listRegions from "./list-availability-regions.service.js";
import listAvailabilityZones from "./list-availability-zones.service.js";
import { listAvailableAMIs } from "./list-available-amis.service.js";
import listImages from "./list-images.service.js";
import listInstances from "./list-instances.service.js";
import { listKeyPairs } from "./list-key-pairs.service.js";
import { listSecurityGroups } from "./list-security-groups.service.js";
import submitCondorJob from "./submit-condor-job.service.js";
import listASGs from "./list-asgs.service.js";
import createASG from "./create-asg.service.js";
import createAsgAutoScalingPolicy from "./create-asg-scaling-policy.service.js";

const ec2Service = {
  createInstances,
  listRegions,
  listAvailabilityZones,
  listImages,
  listAvailableAMIs,
  listInstances,
  listKeyPairs,
  listSecurityGroups,
  getCondorStatus,
  controlInstances,
  createASG,
  getCondorQueueStatus,
  submitCondorJob,
  getCondorQueueStatus,
  getHTCondorMetrics,
  createAsgAutoScalingPolicy,
  listASGs,
};

export default ec2Service;
