import mongoose from 'mongoose';
import Job from '../models/Job.js';

import User from '../models/User.js';
import Resume from '../models/Resume.js';
import ParsedResume from '../models/ParsedResume.js';
import ATSScore from '../models/ATSScore.js';

/**
 * Create a new job posting (Recruiters only)
 */
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, requirements, benefits } = req.body;

    const company = req.user.companyName || req.user.company || 'RecruitAI Partner';

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      type,
      requirements,
      benefits,
      company,
      postedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: { job: job.toSafeObject() },
    });
  } catch (error) {
    console.error('Create job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating job',
    });
  }
};

/**
 * Edit an existing job posting (Recruiters only)
 */
export const editJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, salary, type, requirements, benefits, status } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Verify ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this job posting',
      });
    }

    // Update fields
    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (type) job.type = type;
    if (requirements) job.requirements = requirements;
    if (benefits) job.benefits = benefits;
    if (status) job.status = status;

    await job.save();

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: { job: job.toSafeObject() },
    });
  } catch (error) {
    console.error('Edit job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating job',
    });
  }
};

/**
 * Delete a job posting (Recruiters only)
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Verify ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting',
      });
    }

    await Job.findByIdAndDelete(id);

    // Also pull job from any users' saved or applied lists
    await User.updateMany(
      { savedJobs: id },
      { $pull: { savedJobs: id } }
    );
    await User.updateMany(
      { 'appliedJobs.jobId': id },
      { $pull: { appliedJobs: { jobId: id } } }
    );

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting job',
    });
  }
};

/**
 * Get all job postings with optional filters
 */
export const getJobs = async (req, res) => {
  try {
    const { search, type, location, status } = req.query;

    // Check if jobs exist, if not seed some mock jobs for immediate visual presentation
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      let recruiter = await User.findOne({ role: 'recruiter' });
      if (!recruiter) {
        // Create a dummy recruiter if none exists to own the jobs
        recruiter = await User.create({
          name: 'Jane Recruiter',
          fullName: 'Jane Recruiter',
          email: 'recruiter@recruitai.com',
          password: 'Password123!',
          role: 'recruiter',
          companyName: 'TechCorp Industries',
          companyLocation: 'San Francisco, CA',
        });
      }

      await Job.create([
        {
          title: 'Senior Frontend Engineer',
          company: recruiter.companyName || 'TechCorp Industries',
          location: 'San Francisco, CA',
          salary: '$150,000 - $185,000',
          type: 'Full-time',
          status: 'Open',
          description: 'We are looking for a Senior Frontend Engineer with expert level knowledge of React, Next.js and Tailwind CSS to design and build our next-generation web applications. You will collaborate closely with product managers, UX designers, and backend teams.',
          requirements: ['5+ years React experience', 'Strong TypeScript knowledge', 'Experience with Next.js App Router', 'CSS-in-JS and tailwind layout experience'],
          benefits: ['Health, Dental, Vision insurance', '401(k) matching', 'Flexible Remote work option', 'Annual learning budget'],
          postedBy: recruiter._id,
        },
        {
          title: 'Full Stack Web Developer',
          company: 'CloudScale Systems',
          location: 'Remote',
          salary: '$110,000 - $140,000',
          type: 'Remote',
          status: 'Open',
          description: 'Join our team to work on state of the art MERN stack products. You will own features end-to-end, writing responsive react applications, scalable node/express APIs, and managing mongo collections.',
          requirements: ['Node.js and Express development', 'React/Next.js frontend development', 'MongoDB schema design', 'RESTful API modeling'],
          benefits: ['100% remote workspace allowance', 'Unlimited PTO policy', 'Performance bonus options'],
          postedBy: recruiter._id,
        },
        {
          title: 'Product Manager',
          company: recruiter.companyName || 'TechCorp Industries',
          location: 'New York, NY',
          salary: '$130,000 - $160,000',
          type: 'Full-time',
          status: 'Open',
          description: 'Lead product design, market analysis, and feature roadmap for our core analytics software. Work with engineer teams to define and refine requirements.',
          requirements: ['3+ years Software PM experience', 'Data and metrics driven mindset', 'Agile/Scrum certifications', 'Excellent communication skills'],
          benefits: ['Premium healthcare package', 'Equity options share options', 'Commuter benefits'],
          postedBy: recruiter._id,
        },
        {
          title: 'DevOps Cloud Architect',
          company: 'Nexus Networks',
          location: 'Remote',
          salary: '$160,000 - $210,000',
          type: 'Remote',
          status: 'Open',
          description: 'Optimize and manage AWS cluster instances, Kubernetes, CI/CD pipeline automations, and database clustering.',
          requirements: ['AWS certified Solutions Architect', 'Terraform and Ansible proficiency', 'Kubernetes management in production', 'Docker and shell scripting'],
          benefits: ['Top-tier salary package', 'Fully funded conferences and education', 'Home office budget'],
          postedBy: recruiter._id,
        }
      ]);
    }

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (type && type !== 'All') {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        jobs: jobs.map(j => j.toSafeObject()),
        count: jobs.length,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching jobs',
    });
  }
};


/**
 * Get single job details
 */
export const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { job: job.toSafeObject() },
    });
  } catch (error) {
    console.error('Get job details error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching job details',
    });
  }
};

/**
 * Apply to a job posting (Candidates only)
 */
export const applyJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is closed',
      });
    }

    // Check if already applied in Job applicants
    const hasApplied = job.applicants.some(
      (app) => app.userId.toString() === req.user._id.toString()
    );

    if (hasApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job',
      });
    }

    // Update job applicants
    job.applicants.push({
      userId: req.user._id,
      status: 'applied',
    });
    await job.save();

    // Update candidate appliedJobs list
    const candidate = await User.findById(req.user._id);
    candidate.appliedJobs.push({
      jobId: id,
      status: 'applied',
    });
    await candidate.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully applied to job',
      data: { job: job.toSafeObject() },
    });
  } catch (error) {
    console.error('Apply job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error applying to job',
    });
  }
};

/**
 * Withdraw from a job posting (Candidates only)
 */
export const withdrawJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Remove from Job applicants
    job.applicants = job.applicants.filter(
      (app) => app.userId.toString() !== req.user._id.toString()
    );
    await job.save();

    // Remove from Candidate appliedJobs
    const candidate = await User.findById(req.user._id);
    candidate.appliedJobs = candidate.appliedJobs.filter(
      (app) => app.jobId.toString() !== id.toString()
    );
    await candidate.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully withdrew application',
      data: { job: job.toSafeObject() },
    });
  } catch (error) {
    console.error('Withdraw job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error withdrawing application',
    });
  }
};

/**
 * Save / Bookmark a job posting (Candidates only)
 */
export const saveJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    const candidate = await User.findById(req.user._id);
    const isSaved = candidate.savedJobs.includes(id);

    if (isSaved) {
      // Unsave/Remove
      candidate.savedJobs = candidate.savedJobs.filter((jId) => jId.toString() !== id.toString());
      await candidate.save();
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved jobs',
        isSaved: false,
      });
    } else {
      // Save/Add
      candidate.savedJobs.push(id);
      await candidate.save();
      return res.status(200).json({
        success: true,
        message: 'Job saved successfully',
        isSaved: true,
      });
    }
  } catch (error) {
    console.error('Save job error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error toggling saved job',
    });
  }
};

/**
 * Get job analytics & applicants list (Recruiters only)
 */
export const getJobAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this job',
      });
    }

    // Populate applicants details
    const applicantUserIds = job.applicants.map((a) => a.userId);
    const users = await User.find({ _id: { $in: applicantUserIds } });
    
    // Fetch resumes, parsed data, and ATS scores for all applicants
    const resumes = await Resume.find({ userId: { $in: applicantUserIds }, isActive: true });
    const parsedResumes = await ParsedResume.find({ userId: { $in: applicantUserIds } });
    const atsScores = await ATSScore.find({ userId: { $in: applicantUserIds } });

    const populatedApplicants = job.applicants.map((app) => {
      const user = users.find((u) => u._id.toString() === app.userId.toString());
      const resume = resumes.find((r) => r.userId.toString() === app.userId.toString());
      const parsed = parsedResumes.find((pr) => pr.userId.toString() === app.userId.toString());
      const ats = atsScores.find((score) => score.userId.toString() === app.userId.toString());

      return {
        _id: app._id,
        appliedAt: app.appliedAt,
        status: app.status,
        user: user ? user.toSafeObject() : null,
        resume: resume ? resume.toSafeObject() : null,
        parsedResume: parsed ? parsed.toSafeObject() : null,
        atsScore: ats ? ats.toSafeObject() : null,
      };
    });

    // Compute status breakdown
    const statusBreakdown = {
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      interviewed: 0,
      offered: 0,
    };

    job.applicants.forEach((app) => {
      if (statusBreakdown[app.status] !== undefined) {
        statusBreakdown[app.status]++;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        job: job.toSafeObject(),
        applicants: populatedApplicants,
        statusBreakdown,
        totalApplicants: job.applicants.length,
      },
    });
  } catch (error) {
    console.error('Job analytics error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching job analytics',
    });
  }
};
