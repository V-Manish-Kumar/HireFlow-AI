export type Role = 'RECRUITER' | 'ADMIN' | 'HIRING_MANAGER' | 'INTERVIEWER';

export type JobStatus = 'DRAFT' | 'OPEN' | 'CLOSED';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';

export type ApplicationStage =
  | 'APPLIED'
  | 'SCREENING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type NotificationType = 'STAGE_CHANGE' | 'NEW_APPLICATION' | 'MATCH_READY' | 'SYSTEM';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  company?: string;
  createdAt: string;
}

export interface AdminCreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  role: Role;
  company?: string;
}

export interface AdminUpdateUserRequest {
  fullName: string;
  email: string;
  role: Role;
  company?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities?: string;
  requiredSkills: string;
  preferredSkills?: string;
  minExperienceYears: number;
  status: JobStatus;
  recruiterId: number;
  recruiterName: string;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobRequest {
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  description: string;
  responsibilities?: string;
  requiredSkills: string;
  preferredSkills?: string;
  minExperienceYears: number;
  status?: JobStatus;
}

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  yearsOfExperience: number;
  skillsSummary?: string;
  resumeFilePath?: string;
  resumeOriginalFilename?: string;
  resumeText?: string;
  recruiterId: number;
  recruiterName: string;
  applicationCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  yearsOfExperience: number;
  skillsSummary?: string;
  resumeText?: string;
}

export interface Application {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  candidateTitle?: string;
  candidateExperience: number;
  candidateSkills?: string;
  jobId: number;
  jobTitle: string;
  jobDepartment: string;
  jobLocation: string;
  jobRequiredSkills: string;
  recruiterId: number;
  recruiterName: string;
  stage: ApplicationStage;
  interviewDate?: string;
  notes?: string;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationHistoryItem {
  id: number;
  fromStage?: ApplicationStage;
  toStage: ApplicationStage;
  changedByName: string;
  comments?: string;
  createdAt: string;
}

export interface MatchResult {
  id: number;
  applicationId: number;
  candidateId: number;
  jobId: number;
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  matchingRequiredSkills: string[];
  missingRequiredSkills: string[];
  matchingPreferredSkills: string[];
  summary: string;
  interviewQuestions: string[];
  provider: string;
  algorithmVersion: string;
  disclaimer: string;
  createdAt: string;
}

export interface DashboardStats {
  totalActiveJobs: number;
  totalCandidates: number;
  totalApplications: number;
  interviewsScheduled: number;
  hiringConversionRate: number;
  applicationsByStage: Record<string, number>;
  recentApplications: Application[];
  recentActivity: AuditEvent[];
}

export interface PipelineFunnelItem {
  stage: ApplicationStage;
  count: number;
  percentage: number;
}

export interface ApplicationTrendItem {
  period: string;
  total: number;
  hired: number;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: number;
  userId?: number;
  userName?: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: number;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
