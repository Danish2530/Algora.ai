// Mock template service for Recruiters to design interview assessments.

const BUILT_IN_QUESTION_BANK = [
  // DSA
  { id: 'q_dsa_1', category: 'DSA', text: 'Explain how a hash map works internally and discuss its average and worst-case time complexities.' },
  { id: 'q_dsa_2', category: 'DSA', text: 'Given a binary tree, how would you find the lowest common ancestor (LCA) of two given nodes?' },
  { id: 'q_dsa_3', category: 'DSA', text: 'Explain the difference between Quick Sort and Merge Sort. In what scenarios would you prefer one over the other?' },
  
  // System Design
  { id: 'q_sys_1', category: 'System Design', text: 'Design a URL shortening service like Bit.ly. Focus on database selection, API endpoints, and caching strategies.' },
  { id: 'q_sys_2', category: 'System Design', text: 'How would you design a real-time notification service that scales to millions of active users?' },
  { id: 'q_sys_3', category: 'System Design', text: 'Explain the concept of database sharding vs replication. What trade-offs are involved in each?' },
  
  // Frontend
  { id: 'q_fe_1', category: 'Frontend', text: 'What is the Virtual DOM? Explain how React reconciles differences and updates the actual browser DOM.' },
  { id: 'q_fe_2', category: 'Frontend', text: 'Explain different web rendering paths: CSR, SSR, SSG, and ISR. What are the key performance trade-offs?' },
  { id: 'q_fe_3', category: 'Frontend', text: 'How do you optimize a slow React application? Walk through your approach to identifying performance bottlenecks.' },

  // Backend
  { id: 'q_be_1', category: 'Backend', text: 'What are the differences between RESTful APIs and GraphQL? When would you choose one over the other?' },
  { id: 'q_be_2', category: 'Backend', text: 'How do you secure a REST API? Mention authentication protocols, CORS, rate limiting, and input validation.' },
  { id: 'q_be_3', category: 'Backend', text: 'Explain how Node.js handles asynchronous events with the Event Loop. What is thread pool starvation?' },

  // Behavioral / HR
  { id: 'q_beh_1', category: 'Behavioral', text: 'Describe a time when you had a disagreement with a technical decision made by a peer or manager. How did you resolve it?' },
  { id: 'q_beh_2', category: 'Behavioral', text: 'Tell me about a project that failed or fell behind schedule. What did you learn and how did you communicate this to stakeholders?' },
  { id: 'q_hr_1', category: 'HR', text: 'Why do you want to join our organization, and what environment brings out your best software engineering contributions?' }
];

const DEFAULT_TEMPLATES = [
  {
    id: 'tpl_1',
    title: 'Senior Frontend Engineer Assessment',
    role: 'Frontend Developer',
    code: 'ALGO-FE99',
    creatorId: 'rec_1',
    timeLimit: 120, // seconds per question
    questions: [
      'What is the Virtual DOM? Explain how React reconciles differences and updates the actual browser DOM.',
      'How do you optimize a slow React application? Walk through your approach to identifying performance bottlenecks.',
      'Describe a time when you had a disagreement with a technical decision made by a peer or manager. How did you resolve it?'
    ],
    candidateCount: 2,
    createdAt: '2026-06-10T10:00:00Z',
    status: 'Active'
  },
  {
    id: 'tpl_2',
    title: 'Backend Node.js Developer',
    role: 'Backend Developer',
    code: 'ALGO-BE40',
    creatorId: 'rec_1',
    timeLimit: 180, // seconds per question
    questions: [
      'Explain how a hash map works internally and discuss its average and worst-case time complexities.',
      'Explain how Node.js handles asynchronous events with the Event Loop. What is thread pool starvation?',
      'How would you design a real-time notification service that scales to millions of active users?'
    ],
    candidateCount: 1,
    createdAt: '2026-06-12T14:30:00Z',
    status: 'Active'
  }
];

// Initialize templates in localStorage
const initializeTemplates = () => {
  const templates = localStorage.getItem('algora_templates');
  if (!templates) {
    localStorage.setItem('algora_templates', JSON.stringify(DEFAULT_TEMPLATES));
  }
};

initializeTemplates();

export const templateService = {
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  getQuestionBank: () => {
    return BUILT_IN_QUESTION_BANK;
  },

  getTemplates: async () => {
    await templateService.delay(600);
    const templates = localStorage.getItem('algora_templates');
    return templates ? JSON.parse(templates) : [];
  },

  getTemplateById: async (id) => {
    await templateService.delay(300);
    const templates = JSON.parse(localStorage.getItem('algora_templates') || '[]');
    return templates.find(t => t.id === id) || null;
  },

  getTemplateByCode: async (code) => {
    await templateService.delay(400);
    const templates = JSON.parse(localStorage.getItem('algora_templates') || '[]');
    return templates.find(t => t.code.toUpperCase() === code.toUpperCase().trim()) || null;
  },

  createTemplate: async (templateData) => {
    await templateService.delay(800);
    const { title, role, questions, timeLimit } = templateData;

    if (!title || !role || !questions || questions.length === 0) {
      throw new Error('Title, role, and at least one question are required');
    }

    const session = JSON.parse(localStorage.getItem('algora_session') || '{}');
    const creatorId = session.id || 'rec_anonymous';

    const templates = JSON.parse(localStorage.getItem('algora_templates') || '[]');
    
    // Generate unique code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const cleanRoleAbbr = role.replace(/[^a-zA-Z]/g, '').substring(0, 2).toUpperCase();
    const code = `ALGO-${cleanRoleAbbr}${randomHex}`;

    const newTemplate = {
      id: `tpl_${Date.now()}`,
      title,
      role,
      code,
      creatorId,
      timeLimit: parseInt(timeLimit) || 120,
      questions,
      candidateCount: 0,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    templates.unshift(newTemplate);
    localStorage.setItem('algora_templates', JSON.stringify(templates));
    return newTemplate;
  },

  incrementCandidateCount: (templateId) => {
    const templates = JSON.parse(localStorage.getItem('algora_templates') || '[]');
    const index = templates.findIndex(t => t.id === templateId);
    if (index !== -1) {
      templates[index].candidateCount += 1;
      localStorage.setItem('algora_templates', JSON.stringify(templates));
    }
  }
};
