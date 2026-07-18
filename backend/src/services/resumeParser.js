import fs from 'fs';
import path from 'path';

// ─── Tech Skills Master List (for keyword matching) ───────────────────────────
const TECH_SKILLS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart', 'Lua',
  'Perl', 'Haskell', 'Elixir', 'Clojure', 'Groovy', 'Assembly', 'COBOL',
  // Frontend
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'HTML', 'CSS', 'SCSS', 'SASS',
  'Tailwind', 'Bootstrap', 'Material UI', 'Chakra UI', 'Framer Motion', 'Redux',
  'Zustand', 'MobX', 'Recoil', 'React Query', 'SWR', 'GraphQL', 'Apollo',
  'Webpack', 'Vite', 'Babel', 'ESLint', 'Prettier',
  // Backend
  'Node.js', 'Express', 'Fastify', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'Spring Boot', 'Laravel', 'Rails', 'ASP.NET', 'Gin', 'Fiber', 'Hapi',
  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Cassandra', 'DynamoDB',
  'Elasticsearch', 'Firebase', 'Supabase', 'PlanetScale', 'CockroachDB',
  'SQL', 'NoSQL', 'ORM', 'Prisma', 'Mongoose', 'Sequelize',
  // Cloud & DevOps
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Ansible',
  'Jenkins', 'GitHub Actions', 'CircleCI', 'Travis CI', 'Heroku', 'Vercel',
  'Netlify', 'Nginx', 'Apache', 'Linux', 'Bash', 'Shell', 'CI/CD',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'Expo',
  // Tools & Testing
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Figma',
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright', 'Selenium', 'Vitest',
  'Postman', 'Swagger', 'OpenAPI',
  // AI & Data
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'OpenCV',
  'LangChain', 'OpenAI', 'Hugging Face', 'Machine Learning', 'Deep Learning',
  'Data Science', 'NLP', 'Computer Vision',
  // Architecture & Concepts
  'REST', 'RESTful', 'Microservices', 'Serverless', 'WebSocket', 'gRPC',
  'OAuth', 'JWT', 'SAML', 'SSO', 'Agile', 'Scrum', 'DevOps', 'TDD', 'BDD'
];

// ─── PDF Extraction ───────────────────────────────────────────────────────────
const extractTextFromPDF = async (filePath) => {
  try {
    const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text || '';
  } catch (err) {
    console.error('PDF parse error:', err.message);
    return '';
  }
};

// ─── DOCX Extraction ─────────────────────────────────────────────────────────
const extractTextFromDOCX = async (filePath) => {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  } catch (err) {
    console.error('DOCX parse error:', err.message);
    return '';
  }
};

// ─── Text Helpers ─────────────────────────────────────────────────────────────
const extractEmail = (text) => {
  const match = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
  return match ? match[0].trim() : null;
};

const extractName = (lines) => {
  // The first non-empty, non-email, non-phone line is usually the name
  for (const line of lines.slice(0, 6)) {
    const trimmed = line.trim();
    if (
      trimmed.length > 2 &&
      trimmed.length < 60 &&
      !trimmed.includes('@') &&
      !trimmed.match(/^\d/) &&
      !trimmed.match(/http/i) &&
      !trimmed.match(/resume|curriculum|vitae/i)
    ) {
      return trimmed;
    }
  }
  return null;
};

const extractSkills = (text) => {
  const found = new Set();
  const upperText = text;
  for (const skill of TECH_SKILLS) {
    // Case-insensitive whole-word match
    const regex = new RegExp(`\\b${skill.replace(/[+.]/g, '\\$&')}\\b`, 'i');
    if (regex.test(upperText)) {
      found.add(skill);
    }
  }
  return Array.from(found);
};

const extractSection = (text, startKeywords, endKeywords) => {
  const lines = text.split('\n');
  let capturing = false;
  const sectionLines = [];

  const matchesKeyword = (line, keywords) =>
    keywords.some((kw) => line.toLowerCase().includes(kw.toLowerCase()));

  for (const line of lines) {
    if (!capturing && matchesKeyword(line, startKeywords)) {
      capturing = true;
      continue;
    }
    if (capturing) {
      if (endKeywords && matchesKeyword(line, endKeywords)) break;
      sectionLines.push(line);
    }
  }

  return sectionLines.join('\n').trim();
};

const parseExperience = (sectionText) => {
  if (!sectionText) return [];
  const blocks = sectionText.split(/\n{2,}/);
  return blocks
    .filter((b) => b.trim().length > 10)
    .slice(0, 5)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      return {
        position: lines[0] || 'Role',
        company: lines[1] || 'Company',
        duration: lines[2] || '',
        description: lines.slice(3).join(' ') || lines.slice(1).join(' '),
      };
    });
};

const parseEducation = (sectionText) => {
  if (!sectionText) return [];
  const blocks = sectionText.split(/\n{2,}/);
  return blocks
    .filter((b) => b.trim().length > 5)
    .slice(0, 4)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      return {
        degree: lines[0] || 'Degree',
        institution: lines[1] || 'Institution',
        year: lines[2] || '',
      };
    });
};

const parseProjects = (sectionText) => {
  if (!sectionText) return [];
  const blocks = sectionText.split(/\n{2,}/);
  return blocks
    .filter((b) => b.trim().length > 10)
    .slice(0, 6)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      return {
        name: lines[0] || 'Project',
        description: lines.slice(1).join(' '),
      };
    });
};

const parseCertifications = (sectionText) => {
  if (!sectionText) return [];
  return sectionText
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter((l) => l.length > 4)
    .slice(0, 8);
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const parseResume = async (filePath, mimeType) => {
  let rawText = '';

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf' || mimeType === 'application/pdf') {
    rawText = await extractTextFromPDF(filePath);
  } else if (
    ext === '.docx' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    rawText = await extractTextFromDOCX(filePath);
  } else {
    // Plain text fallback
    try {
      rawText = fs.readFileSync(filePath, 'utf-8');
    } catch {
      rawText = '';
    }
  }

  if (!rawText || rawText.trim().length < 20) {
    console.warn('⚠️  Resume text extraction yielded empty/short content. Path:', filePath);
    return {
      name: null,
      email: null,
      phone: null,
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      rawText: '',
    };
  }

  const lines = rawText.split('\n');

  // Section extraction
  const expSection = extractSection(rawText,
    ['experience', 'work history', 'employment'],
    ['education', 'projects', 'skills', 'certifications', 'achievements']
  );
  const eduSection = extractSection(rawText,
    ['education', 'academic background', 'qualification'],
    ['experience', 'projects', 'skills', 'certifications', 'achievements']
  );
  const projSection = extractSection(rawText,
    ['projects', 'personal projects', 'portfolio', 'key projects'],
    ['education', 'experience', 'skills', 'certifications', 'achievements', 'references']
  );
  const certSection = extractSection(rawText,
    ['certifications', 'certificates', 'licenses', 'achievements'],
    ['experience', 'projects', 'education', 'skills', 'references']
  );

  const parsed = {
    name: extractName(lines),
    email: extractEmail(rawText),
    phone: extractPhone(rawText),
    skills: extractSkills(rawText),
    experience: parseExperience(expSection),
    education: parseEducation(eduSection),
    projects: parseProjects(projSection),
    certifications: parseCertifications(certSection),
    rawText: rawText.slice(0, 4000), // Trim to avoid sending huge text to AI
  };

  console.log(`✅ Resume parsed: ${parsed.name || 'Unknown'} | Skills: ${parsed.skills.length} | Exp: ${parsed.experience.length} | Edu: ${parsed.education.length}`);

  return parsed;
};
