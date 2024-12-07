import { ec2Service } from "../service/index.js";

// POST /instances
export const createInstances = async (req, res) => {
  try {
    const { imageId, maxCount, baseName, keyName, securityGroupIds } = req.body;
    const sgIds = [securityGroupIds];

    await ec2Service.createInstances({
      imageId,
      maxCount,
      baseName,
      keyName,
      securityGroupIds: sgIds,
    });

    return res.redirect("/ec2/instances");
  } catch (error) {
    console.error("Error in createInstances:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create instances",
    });
  }
};

// GET /instances/create
export const renderInstancesCreation = async (req, res) => {
  return res.render("ec2/instances-creation");
};

// PUT /instances/action
export const handleInstanceAction = async (req, res) => {
  try {
    const { action, instanceIds } = req.body;

    if (!action || !Array.isArray(instanceIds) || instanceIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid request. Action and instanceIds are required.",
      });
    }

    const result = await ec2Service.controlInstances(action, instanceIds);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in handleInstanceAction:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /instances
export const listInstances = async (req, res) => {
  try {
    const existingInstances = await ec2Service.listInstances();

    return res.render("ec2/instances", { instances: existingInstances });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list instances",
    });
  }
};

// PUT /instances/start
export const startInstances = async (req, res) => {
  try {
    const { instanceIds } = req.body;

    // 요청 데이터 검증
    if (!Array.isArray(instanceIds) || instanceIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "instanceIds must be a non-empty array",
      });
    }

    const result = await ec2Service.startInstances(instanceIds);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to start instances",
    });
  }
};

// PUT /instances/reboot
export const rebootInstances = async (req, res) => {
  try {
    const { instanceIds } = req.body;

    // 요청 데이터 검증
    if (!Array.isArray(instanceIds) || instanceIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "instanceIds must be a non-empty array",
      });
    }

    const result = await ec2Service.rebootInstances(instanceIds);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to reboot instances",
    });
  }
};

// PUT /instances/stop
export const stopInstances = async (req, res) => {
  try {
    const { instanceIds } = req.body;

    // 요청 데이터 검증
    if (!Array.isArray(instanceIds) || instanceIds.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "instanceIds must be a non-empty array",
      });
    }

    const result = await ec2Service.stopInstances(instanceIds);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to stop instances",
    });
  }
};

// GET /images
export const listImages = async (req, res) => {
  try {
    const existingImages = await ec2Service.listImages();

    return res.render("ec2/images", { images: existingImages });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list images",
    });
  }
};

// GET /availability-regions
export const listAvailabilityRegions = async (req, res) => {
  try {
    const availabilityRegions = await ec2Service.listAvailabilityRegions();

    return res.render("ec2/availability-regions", { availabilityRegions });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list availability regions",
    });
  }
};

// GET /availability-zones
export const listAvailabilityZones = async (req, res) => {
  try {
    const availabilityZones = await ec2Service.listAvailabilityZones();

    return res.render("ec2/availability-zones", { availabilityZones });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list availability zones",
    });
  }
};

// GET /htcondor/status
export const getCondorStatus = async (req, res) => {
  try {
    const { instanceIp } = req.query;
    const data = await ec2Service.getCondorStatus(instanceIp);

    // condor_status의 결과를 라인 단위로 나누기
    const statusLines = data.split("\n").filter((line) => line.trim() !== "");
    // 구분 인덱스를 기준으로 두 배열로 분리
    const separatorIndex = statusLines.findIndex((line) =>
      line.includes("Machines")
    );
    const nodeData = statusLines.slice(1, separatorIndex);
    const summaryData = statusLines.slice(separatorIndex + 1);
    // 클러스터 구성 인스턴스 정보
    const clusterNodes = nodeData.map((line) => {
      const columns = line.trim().split(/\s+/);
      return {
        name: columns[0],
        os: columns[1],
        architecture: columns[2],
        state: columns[3],
        activity: columns[4],
        loadAverage: columns[5],
        memory: columns[6],
        activityTime: columns[7],
      };
    });
    // 클러스터 정보
    const clusterSummary = summaryData.map((line) => {
      const columns = line.trim().split(/\s+/);
      return {
        architecture: columns[0],
        total: columns[1],
        owner: columns[2],
        claimed: columns[3],
        unclaimed: columns[4],
        matched: columns[5],
        preempting: columns[6],
        draining: columns[7],
      };
    });

    return res.render("ec2/htcondor", { clusterNodes, clusterSummary });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list htcondor status",
    });
  }
};

// POST /asg
export const createAutoScalingGroup = async (req, res) => {
  try {
    const {
      autoScalingGroupName,
      launchTemplateName,
      minSize,
      maxSize,
      desiredCapacity,
      vpcZoneIdentifiers,
      availabilityZones,
    } = req.body;

    // 요청 데이터 검증
    if (!launchTemplateName) {
      return res.status(400).json({
        status: "error",
        message: "launchTemplateName is required.",
      });
    }

    // 서비스 호출
    const asgResponse = await ec2Service.createASG({
      autoScalingGroupName,
      launchTemplateName,
      minSize,
      maxSize,
      desiredCapacity,
      vpcZoneIdentifiers,
      availabilityZones,
    });

    return res.status(201).json({
      status: "success",
      message: "Auto Scaling Group created successfully.",
      data: asgResponse,
    });
  } catch (error) {
    console.error("Error creating ASG:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create Auto Scaling Group.",
    });
  }
};

// post /htcondor/submit-job
export const createCondorJob = async (req, res) => {
  const { controlNodeIp, args = "" } = req.body;
  const scriptFile = req.file;
  if (!scriptFile) {
    return res
      .status(400)
      .json({ message: "스크립트 파일이 업로드되지 않았습니다." });
  }
  try {
    const jobId = await ec2Service.submitCondorJob(
      controlNodeIp,
      args,
      scriptFile,
      res
    );
    res.render("ec2/htcondor-submit-job", {
      jobStatus: `작업이 큐에 추가되었습니다. Job ID: ${jobId}`,
    });
  } catch (error) {
    res.render("ec2/htcondor-submit-job", {
      jobStatus: `작업 제출에 실패했습니다. ${error.message}`,
    });
  }
};
