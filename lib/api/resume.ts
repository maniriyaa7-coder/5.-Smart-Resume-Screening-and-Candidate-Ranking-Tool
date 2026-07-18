const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Resume {
  _id: string;
  userId: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedResume {
  _id: string;
  userId: string;
  resumeId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  projects: {
    name: string;
    description: string;
  }[];
  certifications: string[];
  isParsed: boolean;
  parseError: string | null;
  parsedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeResponse {
  success: boolean;
  message?: string;
  data?: {
    resume: Resume;
  };
  isParsing?: boolean;
}

export interface ParsedResumeResponse {
  success: boolean;
  message?: string;
  data?: {
    resume?: Resume;
    parsedResume: ParsedResume;
  };
  isParsing?: boolean;
}

export interface ResumesResponse {
  success: boolean;
  data?: {
    resumes: Resume[];
    count: number;
  };
}

class ResumeAPI {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {};

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

  async upload(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ResumeResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || 'Upload failed'));
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('resume', file);

      // Send request
      const token = localStorage.getItem('accessToken');
      xhr.open('POST', `${API_URL}/resume/upload`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }

  async replace(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ResumeResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.message || 'Replace failed'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('accessToken');
      xhr.open('PUT', `${API_URL}/resume/replace`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }

  async getResume(): Promise<ResumeResponse> {
    const response = await fetch(`${API_URL}/resume`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ResumeResponse>(response);
  }

  async getAllResumes(): Promise<ResumesResponse> {
    const response = await fetch(`${API_URL}/resume/all`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ResumesResponse>(response);
  }

  async getParsedResume(resumeId?: string): Promise<ParsedResumeResponse> {
    const endpoint = resumeId 
      ? `${API_URL}/resume/parsed/${resumeId}`
      : `${API_URL}/resume/parsed`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse<ParsedResumeResponse>(response);
  }

  async deleteResume(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/resume/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
      credentials: 'include',
    });

    return this.handleResponse(response);
  }

  getDownloadUrl(filename: string): string {
    const token = localStorage.getItem('accessToken');
    return `${API_URL}/resume/download/${filename}?token=${token}`;
  }

  getPreviewUrl(filename: string): string {
    const token = localStorage.getItem('accessToken');
    return `${API_URL}/resume/preview/${filename}?token=${token}`;
  }

  downloadResume(filename: string, originalName: string) {
    const token = localStorage.getItem('accessToken');
    const url = `${API_URL}/resume/download/${filename}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Download error:', error);
      });
  }

  async analyze(): Promise<{ success: boolean; data: { atsScore: any; aiAnalysis: any } }> {
    const response = await fetch(`${API_URL}/resume/analyze`, {
      method: 'POST',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getATSScore(): Promise<{ success: boolean; data: { atsScore: any } }> {
    const response = await fetch(`${API_URL}/resume/ats-score`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getAIAnalysis(): Promise<{ success: boolean; data: { aiAnalysis: any } }> {
    const response = await fetch(`${API_URL}/resume/ai-analysis`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getJobMatches(): Promise<{ success: boolean; data: { jobMatches: any[] } }> {
    const response = await fetch(`${API_URL}/resume/job-matches`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async matchJob(jobDescription: string, jobTitle?: string): Promise<{ success: boolean; data: { jobMatch: any } }> {
    const response = await fetch(`${API_URL}/resume/job-match`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(true),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobDescription, jobTitle }),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getDashboard(): Promise<{
    success: boolean;
    data: {
      resume: any;
      parsedResume: any;
      atsScore: any;
      aiAnalysis: any;
      recentJobMatches: any[];
      needsAnalysis: boolean;
    };
  }> {
    const response = await fetch(`${API_URL}/resume/dashboard`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }
}


export const resumeAPI = new ResumeAPI();
