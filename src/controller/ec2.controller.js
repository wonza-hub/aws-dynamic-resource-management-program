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
  try {
    const availableAMIs = await ec2Service.listAvailableAMIs();
    const keyPairs = await ec2Service.listKeyPairs();
    const securityGroups = await ec2Service.listSecurityGroups();

    return res.render("ec2/instances-creation", {
      availableAMIs,
      keyPairs,
      securityGroups,
    });
  } catch (error) {
    console.error("Error fetching instance creation data:", error);
    return res.status(500).send("Failed to load instance creation page.");
  }
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
    const regions = await ec2Service.listRegions();

    return res.render("ec2/regions", { regions });
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

// GET /asg
export const listAutoScalingGroup = async (req, res) => {
  try {
    const asgList = await ec2Service.listASGs();

    res.render("ec2/asg", { asgList, errorMessage: null });
  } catch (error) {
    console.error("ASG 조회 실패:", error);
    res.render("ec2/asg", {
      asgList: [],
      errorMessage: "ASG 정보를 가져오는 데 실패했습니다.",
    });
  }
};
// GET /asg/create
export const renderAutoScalingGroupForm = async (req, res) => {
  res.render("ec2/asg-create-form");
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
    await ec2Service.createASG({
      autoScalingGroupName,
      launchTemplateName,
      minSize: parseInt(minSize),
      maxSize: parseInt(maxSize),
      desiredCapacity: parseInt(desiredCapacity),
      vpcZoneIdentifiers: vpcZoneIdentifiers.split(","),
      availabilityZones: availabilityZones.split(","),
    });

    return res.redirect("/ec2/asg");
  } catch (error) {
    console.error("Error creating ASG:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create Auto Scaling Group.",
    });
  }
};

// GET /asg/scaling-policy/create
export const renderAsgScalingPolicyForm = async (req, res) => {
  res.render("ec2/asg-scaling-policy-form");
};
// POST /asg/scaling-policy
export const createAsgScalingPolicy = async (req, res) => {
  try {
    const { asgName, policyName, adjustmentType, scalingAdjustment } = req.body;

    // 서비스 호출
    const response = await ec2Service.createAsgAutoScalingPolicy({
      asgName,
      policyName,
      adjustmentType,
      scalingAdjustment,
    });

    return res.redirect("/ec2/asg");
  } catch (error) {
    console.error("Error creating ASG:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create Auto Scaling Group.",
    });
  }
};

// GET /cloudwatch-alarm/create
export const renderCloudWatchAlarmForm = async (req, res) => {
  const { asgName } = req.query;
  const policyArn = await ec2Service.getAsgScalingPolicyArn(asgName);
  const snsTopics = await ec2Service.getSNSTopics();

  res.render("cloud-watch/alarm-form", {
    asgName,
    policyArn,
    snsTopics,
  });
};
// POST /cloudwatch-alarm
export const createCloudWatchAlarm = async (req, res) => {
  try {
    const { asgName, alarmName, threshold, policyArn, snsTopicArn } = req.body;

    // 서비스 호출
    await ec2Service.createHTCondorAlarm({
      asgName,
      alarmName,
      threshold: parseFloat(threshold),
      policyArn,
      snsTopicArn,
    });

    return res.redirect("/ec2/asg");
  } catch (error) {
    console.error("Error creating ASG:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create CloudWatch Alarm.",
    });
  }
};

// POST /htcondor/submit-job
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

    return res.status(201).json({
      status: "success",
      message: "Job submitted successfully.",
      data: jobId,
    });
  } catch (error) {
    console.error("🚀 ~ createCondorJob ~ error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to submit job.",
    });
  }
};

// GET /htcondor/dashboard
export const getCondorDashboard = async (req, res) => {
  try {
    const { instanceIp } = req.query;

    // 받아올 데이터
    const dashboardData = {
      clusterNodes: [],
      clusterSummary: [],
      queue: [],
      totalStatus: [],
      metrics: [],
      errorMessage: null,
    };

    // condor_status
    try {
      const condorStatusData = await ec2Service.getCondorStatus(instanceIp);
      const statusLines = condorStatusData
        .split("\n")
        .filter((line) => line.trim() !== "");
      const separatorIndex = statusLines.findIndex((line) =>
        line.includes("Machines")
      );
      const nodeData = statusLines.slice(1, separatorIndex);
      const summaryData = statusLines.slice(separatorIndex + 1);

      dashboardData.clusterNodes = nodeData.map((line) => {
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

      dashboardData.clusterSummary = summaryData.map((line) => {
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
    } catch (error) {
      console.error("condor_status 데이터 가져오기 오류:", error.message);
      dashboardData.errorMessage =
        "클러스터 상태를 가져오는 데 실패했습니다. " + error.message;
    }

    // condor_q
    try {
      const condorQueueData = await ec2Service.getCondorQueueStatus(instanceIp);
      const queueStatusLines = condorQueueData
        .split("\n")
        .filter((line) => line.trim() !== "");

      dashboardData.queue = queueStatusLines.slice(1, -3);
      dashboardData.totalStatus = queueStatusLines.slice(-3);
    } catch (error) {
      console.error("condor_q 데이터 가져오기 오류:", error.message);
      dashboardData.errorMessage =
        "큐 상태를 가져오는 데 실패했습니다. " + error.message;
    }

    // cloudwatch metrics
    try {
      const condorMetrics = await ec2Service.getHTCondorMetrics();
      dashboardData.metrics = condorMetrics;
    } catch (error) {
      console.log("🚀 ~ getCondorDashboard ~ error:", error);
      dashboardData.errorMessage =
        "메트릭 정보를 가져오는 데 실패했습니다. " + error.message;
    }

    res.render("ec2/htcondor-dashboard", dashboardData);
  } catch (error) {
    console.error("HTCondor 대시보드 렌더링 오류:", error);
    res.render("ec2/htcondor-dashboard", {
      clusterNodes: [],
      clusterSummary: [],
      queue: [],
      totalStatus: [],
      errorMessage:
        error.message || "대시보드를 불러오는 중 오류가 발생했습니다.",
    });
  }
};
