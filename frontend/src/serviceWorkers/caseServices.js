import axios from "axios";
import { getAccessToken } from "./authServices";

const BASE_URL = "http://127.0.0.1:8000/api/case";

/**
 * Get all cases
 */
export const getAllCases = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Get all cases API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch cases"
    );
  }
};

/**
 * Create a new case
 * @param {Object} caseData - { title, description, status, priority, user, due_date }
 */
export const createCase = async (caseData) => {
  try {
    const response = await axios.post(`${BASE_URL}/`, caseData, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getAccessToken()
    },
    });
    return response;
  } catch (error) {
    console.error("Create case API error:", error);
    throw new Error(
      error.response?.data?.title?.[0] ||
        error.response?.data?.description?.[0] ||
        error.response?.data?.user?.[0] ||
        error.response?.data?.error ||
        "Failed to create case"
    );
  }
};

/**
 * Get cases by user ID
 * @param {number} userId - User ID
 */
export const getCasesByUser = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Get user cases API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch user cases"
    );
  }
};

/**
 * Update a case
 * @param {number} caseId - Case ID
 * @param {number} userId - User ID
 * @param {Object} caseData - Updated case data (partial update supported)
 */
export const updateCase = async (caseId, userId, caseData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update/${caseId}/${userId}/`,
      caseData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error("Update case API error:", error);
    throw new Error(
      error.response?.data?.title?.[0] ||
        error.response?.data?.description?.[0] ||
        error.response?.data?.error ||
        "Failed to update case"
    );
  }
};

/**
 * Update case status
 * @param {number} caseId - Case ID
 * @param {number} statusIndex - Status index (0: new, 1: open, 2: in_progress, 3: resolved, 4: closed, 5: reopened)
 */
export const updateCaseStatus = async (caseId, statusIndex) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/status/${caseId}/${statusIndex}/`,
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response;
  } catch (error) {
    console.error("Update case status API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to update case status"
    );
  }
};

/**
 * Delete a case (soft delete)
 * @param {number} caseId - Case ID
 */
export const deleteCase = async (caseId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${caseId}/`, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    console.error("Delete case API error:", error);
    throw new Error(
      error.response?.data?.error || "Failed to delete case"
    );
  }
};

/**
 * Status mapping helper
 * Convert status string to index for updateCaseStatus
 */
export const STATUS_MAP = {
  new: 0,
  open: 1,
  in_progress: 2,
  resolved: 3,
  closed: 4,
  reopened: 5,
};

/**
 * Priority mapping helper
 */
export const PRIORITY_MAP = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/**
 * Status mapping helper (index to string)
 */
export const STATUS_INDEX_MAP = [
  "new",
  "open",
  "in_progress",
  "resolved",
  "closed",
  "reopened",
];