import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { JobType, ExperienceLevel, JobFilters } from '@/types/job';

interface FilterSidebarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  jobCounts: {
    jobTypes: Record<JobType, number>;
    locations: Record<string, number>;
    experienceLevels: Record<ExperienceLevel, number>;
  };
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  jobCounts
}) => {
  const handleJobTypeChange = (jobType: JobType, checked: boolean) => {
    const newJobTypes = checked
      ? [...filters.jobTypes, jobType]
      : filters.jobTypes.filter(type => type !== jobType);
    
    onFiltersChange({
      ...filters,
      jobTypes: newJobTypes
    });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...filters.locations, location]
      : filters.locations.filter(loc => loc !== location);
    
    onFiltersChange({
      ...filters,
      locations: newLocations
    });
  };

  const handleExperienceChange = (experience: ExperienceLevel, checked: boolean) => {
    const newExperienceLevels = checked
      ? [...filters.experienceLevels, experience]
      : filters.experienceLevels.filter(exp => exp !== experience);
    
    onFiltersChange({
      ...filters,
      experienceLevels: newExperienceLevels
    });
  };

  const jobTypes: JobType[] = ['Full Time', 'Part Time', 'Contract', 'Remote'];
  const locations = ['San Francisco', 'New York', 'London', 'Berlin'];
  const experienceLevels: ExperienceLevel[] = ['Entry Level', 'Mid Level', 'Senior Level'];

  return (
    <div className="w-64 bg-white border-r border-jobhub-border-light p-6 space-y-8">
      {/* Job Type Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Job Type</h3>
        <div className="space-y-3">
          {jobTypes.map((jobType) => (
            <div key={jobType} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`jobtype-${jobType}`}
                  checked={filters.jobTypes.includes(jobType)}
                  onCheckedChange={(checked) => 
                    handleJobTypeChange(jobType, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`jobtype-${jobType}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {jobType}
                </Label>
              </div>
              <span className="text-sm text-jobhub-text-muted">
                ({jobCounts.jobTypes[jobType] || 0})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Location</h3>
        <div className="space-y-3">
          {locations.map((location) => (
            <div key={location} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) => 
                    handleLocationChange(location, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`location-${location}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {location}
                </Label>
              </div>
              <span className="text-sm text-jobhub-text-muted">
                ({jobCounts.locations[location] || 0})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Experience Level</h3>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`experience-${level}`}
                  checked={filters.experienceLevels.includes(level)}
                  onCheckedChange={(checked) => 
                    handleExperienceChange(level, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`experience-${level}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {level}
                </Label>
              </div>
              <span className="text-sm text-jobhub-text-muted">
                ({jobCounts.experienceLevels[level] || 0})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};