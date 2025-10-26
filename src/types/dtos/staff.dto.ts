import { Judge, Runner } from "../api";
import { JudgeVoteEnum } from "../enums/api-enums";

export interface JudgeVoteRequest {
  judgeId: string;
  eventId: string;
  passwordId: string;
  vote: JudgeVoteEnum;
  comments?: string;
}

export interface JudgeVoteResponse {
  id: string;
  judgeId: string;
  eventId: string;
  passwordId: string;
  vote: JudgeVoteEnum;
  comments?: string;
  createdAt: string;
}

export interface EventVotesSummary {
  eventId: string;
  activeJudges: number;
  validVotes: number;
  nullVotes: number;
  tvVotes: number;
  didNotRunVotes: number;
  passwordVotes: PasswordVotes[];
}

export interface PasswordVotes {
  passwordId: string;
  votes: JudgeVoteInfo[];
}

export interface JudgeVoteInfo {
  judgeId: string;
  judgeName: string;
  vote: JudgeVoteEnum;
  votedAt: string;
}

export interface SpeakerEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  status: string;
  bannerUrl?: string;
  judges: Judge[];
  runners: Runner[];
  createdAt: string;
  updatedAt: string;
}

export interface SpeakerEventsResponse {
  events: SpeakerEvent[];
  total: number;
}
