import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Job, JobType, ExperienceLevel } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Building2, MapPin } from 'lucide-react';

interface JobManagementProps {
  jobs: Job[];
  onAddJob: (job: Omit<Job, 'id' | 'postedDate'>) => void;
  onUpdateJob: (id: string, job: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
}

export const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: 'Full Time' as JobType,
    experienceLevel: 'Mid Level' as ExperienceLevel,
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: '',
    skills: ''
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      jobType: 'Full Time',
      experienceLevel: 'Mid Level',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: '',
      benefits: '',
      skills: ''
    });
    setEditingJob(null);
  };

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salary.min.toString(),
        salaryMax: job.salary.max.toString(),
        description: job.description,
        requirements: job.requirements.join('\n'),
        benefits: job.benefits.join('\n'),
        skills: job.skills.join(', ')
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      jobType: formData.jobType,
      experienceLevel: formData.experienceLevel,
      salary: {
        min: parseInt(formData.salaryMin),
        max: parseInt(formData.salaryMax),
        currency: '$',
        period: 'per year'
      },
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      benefits: formData.benefits.split('\n').filter(benefit => benefit.trim()),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    if (editingJob) {
      onUpdateJob(editingJob.id, jobData);
      toast({
        title: 'Success',
        description: 'Job updated successfully'
      });
    } else {
      onAddJob(jobData);
      toast({
        title: 'Success',
        description: 'Job posted successfully'
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      onDeleteJob(jobId);
      toast({
        title: 'Success',
        description: 'Job deleted successfully'
      });
    }
  };

  // Only show jobs that the recruiter created (managedJobs), not API jobs
  const userJobs = jobs.filter(job => job.id.startsWith('managed-') || job.company === 'TechCorp Inc.' || job.company === 'InnovateLabs');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Jobs</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      <div className="grid gap-4">
        {userJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center text-sm text-jobhub-text-muted mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    {job.company}
                    <MapPin className="h-4 w-4 mr-1 ml-4" />
                    {job.location}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{job.jobType}</Badge>
                <Badge variant="outline">{job.experienceLevel}</Badge>
              </div>
              <p className="text-sm text-jobhub-text-muted line-clamp-2">
                {job.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? 'Edit Job' : 'Post New Job'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => 
                  setFormData({ ...formData, jobType: value as JobType })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={formData.experienceLevel} onValueChange={(value) =>
                  setFormData({ ...formData, experienceLevel: value as ExperienceLevel })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry Level">Entry Level</SelectItem>
                    <SelectItem value="Mid Level">Mid Level</SelectItem>
                    <SelectItem value="Senior Level">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salaryMin">Min Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salaryMax">Max Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                placeholder="5+ years of experience&#10;Strong technical skills&#10;Team collaboration"
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits (one per line)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
                placeholder="Competitive salary&#10;Health insurance&#10;Flexible work arrangements"
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit">
                {editingJob ? 'Update Job' : 'Post Job'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};