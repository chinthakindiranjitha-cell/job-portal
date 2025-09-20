import { useState, useEffect } from 'react';
import { Job, JobFilters } from '@/types/job';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'https://jsonfakery.com/jobs';

// Transform API data to match our Job interface
const transformJobData = (apiJob: any): Job => ({
  id: apiJob.id || Math.random().toString(36).substr(2, 9),
  title: apiJob.job_title || apiJob.title || 'Software Engineer',
  company: apiJob.company || 'Tech Company',
  location: apiJob.location || 'San Francisco, CA',
  jobType: apiJob.job_type || 'Full Time',
  experienceLevel: apiJob.experience_level || 'Mid Level',
  salary: {
    min: apiJob.salary_min || 80000,
    max: apiJob.salary_max || 120000,
    currency: '$',
    period: 'per year'
  },
  description: apiJob.description || 'We are looking for a talented professional to join our dynamic team.',
  requirements: apiJob.requirements || [
    '3+ years of experience',
    'Strong technical skills',
    'Team collaboration experience'
  ],
  benefits: apiJob.benefits || [
    'Competitive salary and equity package',
    'Health, dental, and vision insurance',
    'Flexible work arrangements',
    'Professional development budget'
  ],
  skills: apiJob.skills || ['JavaScript', 'React', 'Node.js'],
  postedDate: apiJob.posted_date || new Date().toISOString(),
  applyUrl: apiJob.apply_url
});

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      const jobsArray = Array.isArray(data) ? data : (data.jobs || [data]);
      const transformedJobs = jobsArray.map(transformJobData);
      
      // Add some mock jobs if API doesn't return enough data
      const mockJobs: Job[] = [
        {
          id: 'mock-1',
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          jobType: 'Full Time',
          experienceLevel: 'Senior Level',
          salary: { min: 120000, max: 180000, currency: '$', period: 'per year' },
          description: "We're looking for a skilled Senior Frontend Developer to join our dynamic team. You'll be responsible for building cutting-edge web applications using modern technologies and best practices.",
          requirements: [
            '5+ years of experience with React and modern JavaScript',
            'Strong knowledge of TypeScript and Next.js',
            'Experience with state management (Redux, Zustand)',
            'Familiarity with testing frameworks (Jest, Cypress)',
            'Understanding of web performance optimization'
          ],
          benefits: [
            'Competitive salary and equity package',
            'Health, dental, and vision insurance',
            'Flexible work arrangements',
            'Professional development budget',
            'Unlimited PTO policy'
          ],
          skills: ['React', 'TypeScript', 'Next.js'],
          postedDate: '2024-01-15T00:00:00Z'
        },
        {
          id: 'mock-2',
          title: 'Product Manager',
          company: 'InnovateLabs',
          location: 'New York, NY',
          jobType: 'Full Time',
          experienceLevel: 'Mid Level',
          salary: { min: 130000, max: 200000, currency: '$', period: 'per year' },
          description: 'Join our product team to drive innovation and shape the future of our platform.',
          requirements: [
            '3+ years of product management experience',
            'Strong analytical and problem-solving skills',
            'Experience with agile development'
          ],
          benefits: [
            'Competitive salary',
            'Stock options',
            'Health insurance',
            'Flexible hours'
          ],
          skills: ['Strategy', 'Analytics', 'Leadership'],
          postedDate: '2024-01-14T00:00:00Z'
        }
      ];
      
      setJobs([...transformedJobs, ...mockJobs]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filterJobs = (jobs: Job[], filters: JobFilters): Job[] => {
    return jobs.filter(job => {
      const matchesJobType = filters.jobTypes.length === 0 || filters.jobTypes.includes(job.jobType);
      const matchesLocation = filters.locations.length === 0 || filters.locations.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      );
      const matchesExperience = filters.experienceLevels.length === 0 || 
        filters.experienceLevels.includes(job.experienceLevel);
      const matchesSearch = !filters.searchQuery || 
        job.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(filters.searchQuery.toLowerCase()));

      return matchesJobType && matchesLocation && matchesExperience && matchesSearch;
    });
  };

  const sortJobs = (jobs: Job[], sortBy: 'date' | 'salary' | 'title'): Job[] => {
    return [...jobs].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'salary':
          return b.salary.max - a.salary.max;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
    filterJobs,
    sortJobs
  };
};