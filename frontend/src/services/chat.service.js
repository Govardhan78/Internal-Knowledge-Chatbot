import api from "../api/axios";

export const askQuestion = async (message) => {
  const response = await api.post("/chat", {
    message,
  });

  return response.data;
};