import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Clock, DollarSign } from 'lucide-react';
import { Job } from '@/types/job';
import { formatSalary, formatJobType, getTimeAgo } from '@/lib/jobUtils';

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onClick: () => void;
  onApply: (jobId: string) => void;
  canApply: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected = false,
  onClick,
  onApply,
  canApply
}) => {
  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection when clicking apply
    onApply(job.id);
  };

  return (
    <div
      className={`p-6 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected 
          ? 'bg-accent border-primary shadow-sm' 
          : 'bg-white border-jobhub-border-light hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      {/* Job Title and Company */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
          {job.title}
        </h3>
        <div className="flex items-center text-sm text-primary font-medium">
          <Building2 className="h-4 w-4 mr-1" />
          {job.company}
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-jobhub-text-muted">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatJobType(job.jobType)}
        </div>
        <div className="flex items-center text-salary font-medium">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatSalary(job.salary)}
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{job.skills.length - 3} more
          </Badge>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-jobhub-text-muted">
          {getTimeAgo(job.postedDate)}
        </span>
        {canApply && (
          <Button 
            size="sm" 
            onClick={handleApplyClick}
            className="ml-auto"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};