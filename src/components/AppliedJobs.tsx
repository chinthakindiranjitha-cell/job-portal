import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job, JobApplication } from '@/types/job';
import { Building2, MapPin, Calendar, Clock } from 'lucide-react';

interface AppliedJobsProps {
  applications: JobApplication[];
  jobs: Job[];
}

export const AppliedJobs: React.FC<AppliedJobsProps> = ({ applications, jobs }) => {
  const appliedJobs = applications.map(app => ({
    application: app,
    job: jobs.find(job => job.id === app.jobId)
  })).filter(item => item.job);

  if (appliedJobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-jobhub-text-muted mb-4" />
        <h3 className="text-xl font-medium mb-2">No applications yet</h3>
        <p className="text-jobhub-text-muted">
          Start applying to jobs to see your applications here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Applications</h2>
        <p className="text-jobhub-text-muted">{appliedJobs.length} applications submitted</p>
      </div>

      <div className="grid gap-4">
        {appliedJobs.map(({ application, job }) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{job?.title}</CardTitle>
                  <div className="flex items-center text-sm text-jobhub-text-muted mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {job?.company}
                    <MapPin className="h-4 w-4 mr-1 ml-4" />
                    {job?.location}
                  </div>
                </div>
                <Badge 
                  variant={application.status === 'pending' ? 'secondary' : 
                          application.status === 'accepted' ? 'default' : 'destructive'}
                >
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{job?.jobType}</Badge>
                <Badge variant="outline">{job?.experienceLevel}</Badge>
              </div>
              <div className="flex items-center text-sm text-jobhub-text-muted">
                <Calendar className="h-4 w-4 mr-1" />
                Applied on {new Date(application.appliedDate).toLocaleDateString()}
              </div>
              <p className="text-sm text-jobhub-text-muted mt-2 line-clamp-2">
                {job?.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};