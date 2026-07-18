const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  status: 'Open' | 'Closed';
  description: string;
  requirements: string[];
  benefits: string[];
  postedBy: string;
  applicants: {
    userId: string;
    appliedAt: string;
    status: 'applied' | 'shortlisted' | 'rejected' | 'interviewed' | 'offered';
  }[];
  createdAt: string;
  updatedAt: string;
}

class JobsAPI {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async getJobs(params?: { search?: string; type?: string; location?: string }): Promise<{
    success: boolean;
    data: { jobs: Job[]; count: number };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.location) queryParams.append('location', params.location);

    const response = await fetch(`${API_URL}/jobs?${queryParams.toString()}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });
    return this.handleResponse(response);
  }

  async getJobDetails(id: string): Promise<{ success: boolean; data: { job: Job } }> {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'GET',
      headers: this.getHeaders(false),
    });
    return this.handleResponse(response);
  }

  async createJob(jobData: Partial<Job>): Promise<{ success: boolean; data: { job: Job } }> {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(jobData),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async editJob(id: string, jobData: Partial<Job>): Promise<{ success: boolean; data: { job: Job } }> {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(jobData),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async deleteJob(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async applyJob(id: string): Promise<{ success: boolean; message: string; data: { job: Job } }> {
    const response = await fetch(`${API_URL}/jobs/${id}/apply`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async withdrawJob(id: string): Promise<{ success: boolean; message: string; data: { job: Job } }> {
    const response = await fetch(`${API_URL}/jobs/${id}/withdraw`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async saveJob(id: string): Promise<{ success: boolean; message: string; isSaved: boolean }> {
    const response = await fetch(`${API_URL}/jobs/${id}/save`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getJobAnalytics(id: string): Promise<{
    success: boolean;
    data: {
      job: Job;
      applicants: any[];
      statusBreakdown: {
        applied: number;
        shortlisted: number;
        rejected: number;
        interviewed: number;
        offered: number;
      };
      totalApplicants: number;
    };
  }> {
    const response = await fetch(`${API_URL}/jobs/${id}/analytics`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }
}

export const jobsAPI = new JobsAPI();
