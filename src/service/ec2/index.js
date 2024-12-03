// 여러 개의 서비스 함수들을 ec2Service 객체로 통합
import controlInstances from "./control-instances.service.js";
import createInstances from "./create-instances.service.js";
import getCondorStatus from "./get-condor-status.service.js";
import listAvailabilityRegions from "./list-availability-regions.service.js";
import listAvailabilityZones from "./list-availability-zones.service.js";
import listImages from "./list-images.service.js";
import listInstances from "./list-instances.service.js";
import rebootInstances from "./reboot-instances.service.js";
import startInstances from "./start-instances.service.js";
import stopInstances from "./stop-instance.service.js";

const ec2Service = {
  createInstances,
  listAvailabilityRegions,
  listAvailabilityZones,
  listImages,
  listInstances,
  rebootInstances,
  startInstances,
  stopInstances,
  getCondorStatus,
  controlInstances,
};

export default ec2Service;
