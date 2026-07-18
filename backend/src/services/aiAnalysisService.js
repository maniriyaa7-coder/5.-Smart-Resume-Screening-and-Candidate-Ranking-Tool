import Groq from 'groq-sdk';

// ─── Groq Client (lazy init so missing key doesn't crash server) ──────────────
let groqClient = null;

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey.trim() === '') {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

// ─── Build Resume Prompt ──────────────────────────────────────────────────────
const buildResumePrompt = (parsedResume) => {
  const skills = parsedResume.skills?.join(', ') || 'Not specified';
  const expSummary = (parsedResume.experience || [])
    .slice(0, 3)
    .map((e) => `${e.position} at ${e.company} (${e.duration}): ${e.description}`)
    .join('\n');
  const eduSummary = (parsedResume.education || [])
    .slice(0, 2)
    .map((e) => `${e.degree} from ${e.institution} (${e.year})`)
    .join('\n');
  const projects = (parsedResume.projects || [])
    .slice(0, 3)
    .map((p) => `${p.name}: ${p.description}`)
    .join('\n');
  const certifications = (parsedResume.certifications || []).join(', ') || 'None listed';

  return `You are an expert technical recruiter and career advisor. Analyze this candidate's resume data and return a JSON object with your analysis.

CANDIDATE RESUME DATA:
Name: ${parsedResume.name || 'Not provided'}
Skills: ${skills}
Experience:
${expSummary || 'No experience listed'}
Education:
${eduSummary || 'No education listed'}
Projects:
${projects || 'No projects listed'}
Certifications: ${certifications}

Return ONLY a valid JSON object with EXACTLY this structure (no markdown, no explanation, just raw JSON):
{
  "summary": "2-3 sentence professional summary based on their actual background",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "missingSkills": ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"],
  "suggestedImprovements": ["improvement 1", "improvement 2", "improvement 3", "improvement 4"],
  "recommendedTechnologies": ["tech 1", "tech 2", "tech 3", "tech 4"],
  "careerSuggestions": ["role 1", "role 2", "role 3"],
  "interviewPreparationTips": ["tip 1", "tip 2", "tip 3"],
  "industryInsights": ["insight 1", "insight 2"],
  "experienceLevel": "fresher|junior|mid|senior|lead",
  "estimatedSalaryRange": { "min": 50000, "max": 90000, "currency": "USD" },
  "topSkills": ["top skill 1", "top skill 2", "top skill 3", "top skill 4", "top skill 5"],
  "improvementPriority": [
    { "area": "area name", "priority": "high|medium|low", "suggestion": "specific suggestion" },
    { "area": "area name", "priority": "high|medium|low", "suggestion": "specific suggestion" }
  ],
  "aiModel": "groq-llama3-8b"
}`;
};

const buildJobMatchPrompt = (parsedResume, jobDescription, jobTitle) => {
  const skills = parsedResume.skills?.join(', ') || 'Not specified';
  return `You are an expert ATS recruiter. Analyze this candidate's match for the job role.

CANDIDATE SKILLS: ${skills}
CANDIDATE EXPERIENCE YEARS: ${parsedResume.experience?.length > 0 ? parsedResume.experience.length + '+ roles' : 'No experience'}
JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription?.slice(0, 800) || 'Not provided'}

Return ONLY valid JSON (no markdown):
{
  "matchPercentage": 75,
  "matchingSkills": ["skill 1", "skill 2"],
  "missingKeywords": ["keyword 1", "keyword 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "skillGaps": [
    { "skill": "skill name", "importance": "critical|important|nice-to-have" }
  ],
  "strengthAreas": ["strength 1", "strength 2"],
  "improvementAreas": ["improvement 1", "improvement 2"],
  "fitScore": { "technical": 80, "experience": 70, "education": 85 }
}`;
};

// ─── Call Groq ────────────────────────────────────────────────────────────────
const callGroq = async (prompt) => {
  const client = getGroqClient();
  if (!client) return null;

  try {
    const completion = await client.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const content = completion.choices?.[0]?.message?.content || '';
    // Strip any markdown code fences if Groq wraps in ```json
    const clean = content.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('Groq API error:', err.message);
    return null;
  }
};

// ─── Smart Fallback (rule-based, derived from parsed resume) ──────────────────
const buildFallbackAnalysis = (parsedResume) => {
  const skills = parsedResume.skills || [];
  const expCount = parsedResume.experience?.length || 0;
  const hasDegree = parsedResume.education?.length > 0;

  // Experience level heuristic
  let experienceLevel = 'fresher';
  if (expCount >= 4) experienceLevel = 'senior';
  else if (expCount >= 2) experienceLevel = 'mid';
  else if (expCount >= 1) experienceLevel = 'junior';

  // Salary estimation based on level
  const salaryMap = {
    fresher: { min: 35000, max: 55000 },
    junior:  { min: 55000, max: 80000 },
    mid:     { min: 80000, max: 120000 },
    senior:  { min: 120000, max: 170000 },
    lead:    { min: 160000, max: 220000 },
  };
  const salary = salaryMap[experienceLevel];

  // Identify missing common skills
  const coreSkills = ['TypeScript', 'Docker', 'AWS', 'PostgreSQL', 'GraphQL', 'Redis', 'Kubernetes', 'CI/CD'];
  const missingSkills = coreSkills.filter((s) => !skills.some((sk) => sk.toLowerCase() === s.toLowerCase())).slice(0, 5);

  // Top skills (use what they have, max 5)
  const topSkills = skills.slice(0, 5);

  // Career suggestions based on skill profile
  const careerSuggestions = [];
  if (skills.some((s) => /react|vue|angular|frontend/i.test(s))) careerSuggestions.push('Frontend Engineer');
  if (skills.some((s) => /node|express|django|backend/i.test(s))) careerSuggestions.push('Backend Engineer');
  if (skills.some((s) => /react|vue|node|express|mongo/i.test(s))) careerSuggestions.push('Full Stack Developer');
  if (skills.some((s) => /python|ml|tensorflow|pytorch|data/i.test(s))) careerSuggestions.push('ML Engineer / Data Scientist');
  if (skills.some((s) => /docker|kubernetes|aws|devops|ci/i.test(s))) careerSuggestions.push('DevOps / Platform Engineer');
  if (careerSuggestions.length === 0) careerSuggestions.push('Software Engineer', 'Junior Developer');

  const hasName = parsedResume.name || 'this candidate';

  return {
    summary: `${hasName} has a background in ${topSkills.slice(0, 3).join(', ')} with ${expCount} role(s) of recorded professional experience. ${hasDegree ? 'Holds formal educational qualifications.' : 'Self-taught or bootcamp background.'} ${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)}-level profile based on resume depth.`,
    strengths: [
      topSkills.length > 0 ? `Proficient in ${topSkills.slice(0, 2).join(' and ')}` : 'Self-motivated learner',
      expCount > 0 ? `${expCount} professional role(s) demonstrating hands-on experience` : 'Fresh perspective and eagerness to grow',
      hasDegree ? 'Formal academic foundation in their discipline' : 'Practical, project-driven learning approach',
      parsedResume.projects?.length > 0 ? `${parsedResume.projects.length} portfolio project(s) showing initiative` : 'Strong foundational knowledge',
    ].filter(Boolean),
    weaknesses: [
      missingSkills.length > 0 ? `Limited exposure to: ${missingSkills.slice(0, 3).join(', ')}` : 'Resume could include more quantified achievements',
      experienceLevel === 'fresher' ? 'No professional work experience listed yet' : 'Could benefit from broader technology exposure',
      'Resume depth could be improved with measurable impact metrics',
    ],
    missingSkills,
    suggestedImprovements: [
      `Add quantified impact metrics to experience descriptions (e.g. "reduced load time by 40%")`,
      missingSkills[0] ? `Learn ${missingSkills[0]} to strengthen your profile` : 'Contribute to open source to build credibility',
      `Build and deploy a project that showcases ${topSkills[0] || 'your core skills'} end-to-end`,
      'Add a professional summary section at the top of your resume',
    ],
    recommendedTechnologies: missingSkills.slice(0, 4),
    careerSuggestions: careerSuggestions.slice(0, 3),
    interviewPreparationTips: [
      `Be ready to deep-dive on your ${topSkills[0] || 'primary'} experience with code examples`,
      'Practice system design questions appropriate for your experience level',
      'Prepare STAR-format stories for each project and role listed',
    ],
    industryInsights: [
      'Demand for full-stack engineers with cloud experience remains very high in 2024-25',
      'TypeScript adoption has crossed 80% in professional JavaScript projects',
    ],
    experienceLevel,
    estimatedSalaryRange: { ...salary, currency: 'USD' },
    topSkills,
    improvementPriority: [
      {
        area: 'Resume Impact',
        priority: 'high',
        suggestion: 'Add numbers and outcomes to every bullet point in experience section',
      },
      missingSkills[0] && {
        area: missingSkills[0],
        priority: 'high',
        suggestion: `${missingSkills[0]} is frequently requested in job descriptions for your target roles`,
      },
    ].filter(Boolean),
    aiModel: 'rule-based-fallback',
  };
};

// ─── Main Exports ─────────────────────────────────────────────────────────────
export const generateResumeAnalysis = async (parsedResume) => {
  const prompt = buildResumePrompt(parsedResume);

  console.log('🤖 Running AI resume analysis...');
  const groqResult = await callGroq(prompt);

  if (groqResult) {
    console.log('✅ Groq LLaMA analysis complete');
    groqResult.aiModel = 'groq-llama3-8b';
    return groqResult;
  }

  console.log('⚠️  Groq unavailable — using smart rule-based fallback');
  return buildFallbackAnalysis(parsedResume);
};

export const generateJobMatchAnalysis = async (parsedResume, jobDescription, jobTitle) => {
  const prompt = buildJobMatchPrompt(parsedResume, jobDescription, jobTitle);

  console.log('🤖 Running job match analysis...');
  const groqResult = await callGroq(prompt);

  if (groqResult) {
    console.log('✅ Groq job match analysis complete');
    return groqResult;
  }

  // Fallback: keyword-based matching
  const skills = parsedResume.skills || [];
  const descWords = (jobDescription || '').toLowerCase().split(/\W+/);
  const matchingSkills = skills.filter((s) => descWords.includes(s.toLowerCase()));
  const matchPercentage = skills.length > 0
    ? Math.min(95, Math.round((matchingSkills.length / Math.min(skills.length, 10)) * 100))
    : 40;

  return {
    matchPercentage,
    matchingSkills,
    missingKeywords: ['TypeScript', 'Docker', 'AWS'].filter(
      (k) => !skills.some((s) => s.toLowerCase() === k.toLowerCase())
    ),
    suggestions: [
      'Tailor your resume summary to explicitly mention the job title',
      'Add keywords from the job description that match your actual experience',
    ],
    skillGaps: [{ skill: 'TypeScript', importance: 'important' }],
    strengthAreas: matchingSkills.length > 0
      ? [`Strong alignment on: ${matchingSkills.slice(0, 3).join(', ')}`]
      : ['Resume shows general software engineering capability'],
    improvementAreas: ['Quantify achievements with specific metrics', 'Highlight relevant project work'],
    fitScore: {
      technical: Math.min(95, matchPercentage + 5),
      experience: parsedResume.experience?.length > 1 ? 80 : 55,
      education: parsedResume.education?.length > 0 ? 85 : 60,
    },
  };
};
