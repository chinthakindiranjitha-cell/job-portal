import { Job, JobType } from '@/types/job';

export const formatSalary = (salary: Job['salary']): string => {
  const { min, max, currency, period } = salary;
  
  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${Math.round(amount / 1000)}k`;
    }
    return amount.toLocaleString();
  };

  return `${currency}${formatAmount(min)} - ${currency}${formatAmount(max)} ${period}`;
};

export const formatJobType = (jobType: JobType): string => {
  return jobType;
};

export const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return '1 day ago';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

export const calculateJobCounts = (jobs: Job[]) => {
  const jobTypes: Record<JobType, number> = {
    'Full Time': 0,
    'Part Time': 0,
    'Contract': 0,
    'Remote': 0
  };

  const locations: Record<string, number> = {};
  const experienceLevels: Record<string, number> = {
    'Entry Level': 0,
    'Mid Level': 0,
    'Senior Level': 0
  };

  jobs.forEach(job => {
    // Count job types
    jobTypes[job.jobType] = (jobTypes[job.jobType] || 0) + 1;

    // Count locations (extract city from location)
    const city = job.location.split(',')[0].trim();
    locations[city] = (locations[city] || 0) + 1;

    // Count experience levels
    experienceLevels[job.experienceLevel] = (experienceLevels[job.experienceLevel] || 0) + 1;
  });

  return { jobTypes, locations, experienceLevels };
};