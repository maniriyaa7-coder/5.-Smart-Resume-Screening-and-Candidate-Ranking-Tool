export const calculateATSScore = (parsedResume) => {
  return {
    overallScore: 85,
    breakdown: {
      skillsMatch: { score: 80, weight: 30 },
      experience: { score: 90, weight: 25 },
      education: { score: 85, weight: 20 },
      formatting: { score: 90, weight: 15 },
      keywords: { score: 80, weight: 10 }
    },
    missingSkills: ['TypeScript', 'GraphQL'],
    recommendations: ['Add TypeScript to your skills list', 'Include more metrics in experience descriptions'],
    strengths: ['Strong technical skill set matching core requirements', 'Good experience structure'],
    weaknesses: ['Missing keywords related to TypeScript', 'No clear project achievements listed']
  };
};
