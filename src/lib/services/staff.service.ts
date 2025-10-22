import { api } from "@/api/api-connection";

export const addJudgeToEvent = async (
  eventId: string,
  judgeId: string
): Promise<void> => {
  const response = await api.post(`/staff/judge/${eventId}/${judgeId}`);
  return response.data;
};

export const addSpeakerToEvent = async (
  eventId: string,
  speakerId: string
): Promise<void> => {
  const response = await api.post(`/staff/speaker/${eventId}/${speakerId}`);
  return response.data;
};

export const listStaffByEvent = async (eventId: string) => {
  const response = await api.get(`/staff/event/${eventId}`);
  return response.data;
};

export const removeJudgeFromEvent = async (
  eventId: string,
  judgeId: string
): Promise<void> => {
  const response = await api.delete(`/staff/judge/${eventId}/${judgeId}`);
  return response.data;
};

export const removeSpeakerFromEvent = async (
  eventId: string,
  speakerId: string
): Promise<void> => {
  const response = await api.delete(`/staff/speaker/${eventId}/${speakerId}`);
  return response.data;
};
