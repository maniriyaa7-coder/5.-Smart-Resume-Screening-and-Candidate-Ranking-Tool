const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class RecruiterAPI {
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

  async getCandidates(): Promise<{
    success: boolean;
    data: {
      candidates: any[];
      count: number;
    };
  }> {
    const response = await fetch(`${API_URL}/auth/recruiter/candidates`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getCandidateDetails(id: string): Promise<{
    success: boolean;
    data: {
      candidate: any;
      resume: any;
      parsedResume: any;
      atsScore: any;
      aiAnalysis: any;
    };
  }> {
    const response = await fetch(`${API_URL}/auth/recruiter/candidates/${id}`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async updateStatus(id: string, status: string): Promise<{ success: boolean; data: { candidate: any } }> {
    const response = await fetch(`${API_URL}/auth/recruiter/candidates/${id}/status`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async updateNotes(
    id: string,
    notes: { recruiterNotes?: string; interviewNotes?: string; communicationMessage?: string }
  ): Promise<{ success: boolean; data: { candidate: any } }> {
    const response = await fetch(`${API_URL}/auth/recruiter/candidates/${id}/notes`, {
      method: 'PATCH',
      headers: this.getHeaders(true),
      body: JSON.stringify(notes),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async getAnalytics(): Promise<{
    success: boolean;
    data: {
      totalCandidates: number;
      shortlistedCandidates: number;
      rejectedCandidates: number;
      interviewedCandidates: number;
      offeredCandidates: number;
      statusBreakdown: {
        applied: number;
        shortlisted: number;
        rejected: number;
        interviewed: number;
        offered: number;
      };
      monthlyTrend: { name: string; candidates: number; hired: number }[];
    };
  }> {
    const response = await fetch(`${API_URL}/auth/recruiter/analytics`, {
      method: 'GET',
      headers: this.getHeaders(true),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }

  async importCandidates(candidates: any[]): Promise<{ success: boolean; data: { imported: any[] } }> {
    const response = await fetch(`${API_URL}/auth/recruiter/candidates/import`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ candidates }),
      credentials: 'include',
    });
    return this.handleResponse(response);
  }
}

export const recruiterAPI = new RecruiterAPI();
