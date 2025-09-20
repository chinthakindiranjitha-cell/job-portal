import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Star,
  Calendar
} from 'lucide-react';
import { Job } from '@/types/job';
import { formatSalary, formatJobType, getTimeAgo } from '@/lib/jobUtils';
import { useAuth } from '@/contexts/AuthContext';

interface JobDetailProps {
  job: Job | null;
  onApply: (jobId: string) => void;
  hasApplied: boolean;
}

export const JobDetail: React.FC<JobDetailProps> = ({ job, onApply, hasApplied }) => {
  const { user, isAuthenticated } = useAuth();

  if (!job) {
    return (
      <div className="w-96 bg-white border-l border-jobhub-border-light p-6">
        <div className="flex items-center justify-center h-64 text-jobhub-text-muted">
          <div className="text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a job to view details</p>
          </div>
        </div>
      </div>
    );
  }

  const canApply = isAuthenticated && user?.role === 'jobseeker' && !hasApplied;

  return (
    <div className="w-96 bg-white border-l border-jobhub-border-light p-6 overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">{job.title}</h1>
        <div className="flex items-center text-primary font-medium mb-4">
          <Building2 className="h-5 w-5 mr-2" />
          {job.company}
        </div>

        {/* Salary Highlight */}
        <div className="bg-accent p-4 rounded-lg mb-4">
          <div className="text-2xl font-bold text-primary mb-1">
            {formatSalary(job.salary)}
          </div>
          <div className="text-sm text-jobhub-text-muted">per year</div>
        </div>
      </div>

      {/* Job Meta Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm">
          <MapPin className="h-4 w-4 mr-2 text-jobhub-text-muted" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-jobhub-text-muted" />
          <span>{formatJobType(job.jobType)}</span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-jobhub-text-muted" />
          <span>Posted {getTimeAgo(job.postedDate)}</span>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Job Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Job Description</h2>
        <p className="text-sm text-jobhub-text-muted leading-relaxed">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Requirements</h2>
        <ul className="space-y-2">
          {job.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              <span className="text-jobhub-text-muted">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Benefits</h2>
        <ul className="space-y-2">
          {job.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start text-sm">
              <Star className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
              <span className="text-jobhub-text-muted">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Apply Button */}
      <div className="sticky bottom-0 bg-white pt-4 border-t border-jobhub-border-light">
        {hasApplied ? (
          <Button disabled className="w-full" size="lg">
            <CheckCircle className="h-4 w-4 mr-2" />
            Applied
          </Button>
        ) : canApply ? (
          <Button 
            onClick={() => onApply(job.id)} 
            className="w-full" 
            size="lg"
          >
            Apply for this Position
          </Button>
        ) : !isAuthenticated ? (
          <Button disabled className="w-full" size="lg">
            Sign in to Apply
          </Button>
        ) : user?.role === 'recruiter' ? (
          <Button disabled className="w-full" size="lg">
            Recruiters cannot apply
          </Button>
        ) : (
          <Button disabled className="w-full" size="lg">
            Apply for this Position
          </Button>
        )}
      </div>
    </div>
  );
};