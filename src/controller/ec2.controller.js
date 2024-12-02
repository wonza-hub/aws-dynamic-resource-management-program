import { ec2Service } from "../service/index.js";

// POST /instances
export const createInstances = async (req, res) => {
  try {
    const { imageId, maxCount, baseName, keyName, securityGroupIds } = req.body;

    // 요청 데이터 검증
    if (!imageId || !baseName || typeof maxCount !== "number") {
      return res.status(400).json({
        status: "error",
        message: "imageId, baseName, and maxCount are required fields",
      });
    }

    if (!keyName) {
      return res.status(400).json({
        status: "error",
        message: "keyName is required",
      });
    }

    // 보안 그룹이 없으면 기본 보안 그룹 사용
    let finalSecurityGroupIds = securityGroupIds;
    if (!Array.isArray(securityGroupIds) || securityGroupIds.length === 0) {
      // 보안 그룹 ID가 없으면 기본 보안 그룹 ID를 찾아서 설정
      const defaultSecurityGroup = await ec2Service.getDefaultSecurityGroup();
      if (!defaultSecurityGroup) {
        return res.status(400).json({
          status: "error",
          message: "No default security group found",
        });
      }
      finalSecurityGroupIds = [defaultSecurityGroup];
    }

    // 서비스 호출
    const result = await ec2Service.createInstances({
      imageId,
      maxCount,
      baseName,
      keyName,
      securityGroupIds: finalSecurityGroupIds,
    });

    // 성공 응답 반환
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in createInstances:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to create instances",
    });
  }
};

// GET /instances
export const listInstances = async (req, res) => {
  try {
    const existingInstances = await ec2Service.listInstances();

    return res.status(200).json(existingInstances);
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

    return res.status(200).json(existingImages);
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

    return res.status(200).json(availabilityRegions);
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

    return res.status(200).json(availabilityZones);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to list availability zones",
    });
  }
};
