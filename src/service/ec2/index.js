// 여러 개의 서비스 함수들을 ec2Service 객체로 통합
import controlInstances from "./control-instances.service.js";
import createASG from "./create-asg.service.js";
import createInstances from "./create-instances.service.js";
import getCondorQueueStatus from "./get-condor-queue-status.service.js";
import getCondorStatus from "./get-condor-status.service.js";
import getHTCondorMetrics from "./get-htcondor-metrics.service.js";
import listAvailabilityRegions from "./list-availability-regions.service.js";
import listAvailabilityZones from "./list-availability-zones.service.js";
import listImages from "./list-images.service.js";
import listInstances from "./list-instances.service.js";
import submitCondorJob from "./submit-condor-job.service.js";

const ec2Service = {
  createInstances,
  listAvailabilityRegions,
  listAvailabilityZones,
  listImages,
  listInstances,
  getCondorStatus,
  controlInstances,
  createASG,
  getCondorQueueStatus,
  submitCondorJob,
  getCondorQueueStatus,
  getHTCondorMetrics,
};

export default ec2Service;
