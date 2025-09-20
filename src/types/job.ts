export type JobType = 'Full Time' | 'Part Time' | 'Contract' | 'Remote';
export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level';
export type UserRole = 'recruiter' | 'jobseeker';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salary: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string;
  applyUrl?: string;
}

export interface JobFilters {
  jobTypes: JobType[];
  locations: string[];
  experienceLevels: ExperienceLevel[];
  searchQuery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  appliedDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}