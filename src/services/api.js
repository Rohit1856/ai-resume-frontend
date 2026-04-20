import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-powered-resume-analyzer-builder.onrender.com/api",
});

export const fetchDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};

export const analyzeResume = async (formData) => {
  const response = await api.post("/resumes/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const atsCheck = async (formData) => {
  const response = await api.post("/ats/check", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchBuilderSuggestions = async (targetRole) => {
  const response = await api.post("/builder/suggestions", {
    targetRole,
  });
  return response.data;
};

export const prefillResumeBuilder = async (formData) => {
  const response = await api.post("/builder/prefill", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const saveResumeProfile = async (payload) => {
  const response = await api.post("/builder/save", payload);
  return response.data;
};

export default api;
