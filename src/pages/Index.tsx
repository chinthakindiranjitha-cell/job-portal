import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { FilterSidebar } from '@/components/FilterSidebar';
import { JobCard } from '@/components/JobCard';
import { JobDetail } from '@/components/JobDetail';
import { JobManagement } from '@/components/JobManagement';
import { AppliedJobs } from '@/components/AppliedJobs';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import { Job, JobFilters, JobApplication } from '@/types/job';
import { calculateJobCounts } from '@/lib/jobUtils';
import { useToast } from '@/hooks/use-toast';
import { SlidersHorizontal, Briefcase, FileText } from 'lucide-react';

const JobPortalContent: React.FC = () => {
  const { jobs, loading, error, refetch, filterJobs, sortJobs } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    locations: [],
    experienceLevels: [],
    searchQuery: ''
  });

  const [sortBy, setSortBy] = useState<'date' | 'salary' | 'title'>('date');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [managedJobs, setManagedJobs] = useState<Job[]>([]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    const allJobs = [...jobs, ...managedJobs];
    const filtered = filterJobs(allJobs, filters);
    return sortJobs(filtered, sortBy);
  }, [jobs, managedJobs, filters, sortBy, filterJobs, sortJobs]);

  // Calculate filter counts
  const jobCounts = useMemo(() => {
    const allJobs = [...jobs, ...managedJobs];
    return calculateJobCounts(allJobs);
  }, [jobs, managedJobs]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleApplyToJob = (jobId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply for jobs',
        variant: 'destructive'
      });
      return;
    }

    if (user.role !== 'jobseeker') {
      toast({
        title: 'Access Denied',
        description: 'Only job seekers can apply for jobs',
        variant: 'destructive'
      });
      return;
    }

    const newApplication: JobApplication = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      userId: user.id,
      appliedDate: new Date().toISOString(),
      status: 'pending'
    };

    setApplications(prev => [...prev, newApplication]);
    toast({
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully!'
    });
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId && app.userId === user?.id);
  };

  // Job management functions for recruiters
  const handleAddJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    const newJob: Job = {
      ...jobData,
      id: 'managed-' + Math.random().toString(36).substr(2, 9),
      postedDate: new Date().toISOString()
    };
    setManagedJobs(prev => [newJob, ...prev]);
  };

  const handleUpdateJob = (id: string, updates: Partial<Job>) => {
    setManagedJobs(prev => prev.map(job => 
      job.id === id ? { ...job, ...updates } : job
    ));
  };

  const handleDeleteJob = (id: string) => {
    setManagedJobs(prev => prev.filter(job => job.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-jobhub-text-muted">Loading amazing opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearchChange={handleSearchChange} searchQuery={filters.searchQuery} />

      {user?.role === 'recruiter' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="manage" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manage">
                <Briefcase className="h-4 w-4 mr-2" />
                Manage Jobs
              </TabsTrigger>
              <TabsTrigger value="browse">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Browse Jobs
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manage" className="mt-6">
              <JobManagement
                jobs={managedJobs}
                onAddJob={handleAddJob}
                onUpdateJob={handleUpdateJob}
                onDeleteJob={handleDeleteJob}
              />
            </TabsContent>
            
            <TabsContent value="browse" className="mt-6">
              <div className="flex gap-6">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  jobCounts={jobCounts}
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Latest Job Openings</h2>
                      <p className="text-jobhub-text-muted">{filteredJobs.length} jobs found</p>
                    </div>
                    
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Latest First</SelectItem>
                        <SelectItem value="salary">Highest Salary</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                        onApply={handleApplyToJob}
                        canApply={false} // Recruiters can't apply
                      />
                    ))}
                  </div>
                </div>

                <JobDetail
                  job={selectedJob}
                  onApply={handleApplyToJob}
                  hasApplied={selectedJob ? hasApplied(selectedJob.id) : false}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </TabsTrigger>
              <TabsTrigger value="applications">
                <FileText className="h-4 w-4 mr-2" />
                My Applications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-6">
              <div className="flex gap-6">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  jobCounts={jobCounts}
                />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Latest Job Openings</h2>
                      <p className="text-jobhub-text-muted">{filteredJobs.length} jobs found</p>
                    </div>
                    
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Latest First</SelectItem>
                        <SelectItem value="salary">Highest Salary</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    {filteredJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                        onApply={handleApplyToJob}
                        canApply={isAuthenticated && user?.role === 'jobseeker'}
                      />
                    ))}
                  </div>

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto text-jobhub-text-muted mb-4" />
                      <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                      <p className="text-jobhub-text-muted">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                  )}
                </div>

                <JobDetail
                  job={selectedJob}
                  onApply={handleApplyToJob}
                  hasApplied={selectedJob ? hasApplied(selectedJob.id) : false}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              <AppliedJobs 
                applications={applications} 
                jobs={[...jobs, ...managedJobs]} 
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

// Main App Component with Auth Provider
const Index: React.FC = () => {
  return (
    <AuthProvider>
      <JobPortalContent />
    </AuthProvider>
  );
};

export default Index;
