import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

export const resendOtp = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });
  return response.data;
};

export const resetPassword = async (email, password) => {
  const response = await api.post("/auth/reset-password", {
    email,
    password,
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};
