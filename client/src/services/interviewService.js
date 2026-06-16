// Mock interview service simulating real-time evaluations and storing transcripts.
import { templateService } from './templateService';

const SEED_SESSIONS = [
  {
    id: 'sess_1',
    templateId: 'tpl_1',
    candidateId: 'cand_1',
    candidateName: 'Alex Rivera',
    role: 'Frontend Developer',
    title: 'Senior Frontend Engineer Assessment',
    date: '2026-06-11T16:40:00Z',
    score: 88,
    status: 'Completed',
    answers: [
      {
        question: 'What is the Virtual DOM? Explain how React reconciles differences and updates the actual browser DOM.',
        answer: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, a new virtual DOM tree is built. React compares this new tree with the previous one using a diffing algorithm (reconciliation). It then computes the minimum set of changes required and updates the real DOM via batched operations, which improves rendering speed and efficiency.',
        feedback: 'Excellent detailed description of the reconciliation process. Correctly identified diffing and batching benefits.',
        score: 95
      },
      {
        question: 'How do you optimize a slow React application? Walk through your approach to identifying performance bottlenecks.',
        answer: 'To optimize a React app, I would start by profiling it using React DevTools to find unnecessary re-renders. Then I\'d apply optimizations like React.memo for component memoization, useMemo and useCallback to preserve reference equality, virtualize long lists with react-window, and split code using React.lazy and Suspense.',
        feedback: 'Comprehensive list of optimization techniques. Demonstrates practical experience with performance analysis tools.',
        score: 90
      },
      {
        question: 'Describe a time when you had a disagreement with a technical decision made by a peer or manager. How did you resolve it?',
        answer: 'In my last team, a colleague wanted to use Redux for a small toggle state. I believed it introduced too much boilerplate. I scheduled a call, presented a mock using local state and Context, and we weighed the complexity vs speed. We ultimately agreed to keep it simple with Context, which saved codebase bloat.',
        feedback: 'Good demonstration of communication and constructive problem solving. Shows focus on simplicity and pragmatism.',
        score: 80
      }
    ],
    strengths: [
      'Deep understanding of React core architecture (Virtual DOM, Reconciliation)',
      'Familiarity with performance diagnostics and tooling',
      'Collaborative conflict-resolution skills'
    ],
    improvements: [
      'Could expand more on trade-offs when choosing state managers for global vs local values.',
      'Could discuss security implications of public contextual values in web applications.'
    ]
  },
  {
    id: 'sess_2',
    templateId: 'tpl_1',
    candidateId: 'cand_guest_1',
    candidateName: 'David Chen',
    role: 'Frontend Developer',
    title: 'Senior Frontend Engineer Assessment',
    date: '2026-06-13T11:20:00Z',
    score: 64,
    status: 'Completed',
    answers: [
      {
        question: 'What is the Virtual DOM? Explain how React reconciles differences and updates the actual browser DOM.',
        answer: 'It is a virtual version of the HTML DOM that React uses. React updates it first because updating the real HTML page is slow, then it renders changes.',
        feedback: 'Too superficial. Fails to explain the diffing algorithm, key reconciliation steps, or how batching works.',
        score: 60
      },
      {
        question: 'How do you optimize a slow React application? Walk through your approach to identifying performance bottlenecks.',
        answer: 'I would clean up code, remove unused libraries, and use pagination. Maybe use useMemo if variables are big.',
        feedback: 'Basic answer. Missing crucial React-specific insights such as component profiling, render triggers, virtualization, or code splitting.',
        score: 55
      },
      {
        question: 'Describe a time when you had a disagreement with a technical decision made by a peer or manager. How did you resolve it?',
        answer: 'We had a fight about design. We talked about it and did a vote. It worked out.',
        feedback: 'Brief explanation. Doesn\'t detail personal communication styles, logic, or technical evaluation processes.',
        score: 77
      }
    ],
    strengths: [
      'Recognizes that actual DOM manipulation is slow',
      'Understand simple performance tools'
    ],
    improvements: [
      'Must explain inner architectural concepts with appropriate computer science vocabulary',
      'Develop structured approaches to conflict description'
    ]
  },
  {
    id: 'sess_3',
    templateId: 'tpl_2',
    candidateId: 'cand_guest_2',
    candidateName: 'Elena Rostova',
    role: 'Backend Developer',
    title: 'Backend Node.js Developer',
    date: '2026-06-14T09:15:00Z',
    score: 92,
    status: 'Completed',
    answers: [
      {
        question: 'Explain how a hash map works internally and discuss its average and worst-case time complexities.',
        answer: 'A hash map uses a hash function to map keys to array indexes. When a collision occurs (two keys hashing to the same slot), it resolves it using chaining (linked list or trees) or open addressing. Average complexity is O(1) for searches, inserts, and deletes because of uniform distribution. Worst-case is O(N) when all keys hash to the same bucket, turning searches into linear traversals.',
        feedback: 'Superb explanation of hashing, collision resolution (chaining vs open addressing), and complexity factors.',
        score: 96
      },
      {
        question: 'Explain how Node.js handles asynchronous events with the Event Loop. What is thread pool starvation?',
        answer: 'Node.js is single-threaded but offloads I/O actions to the system kernel or libuv thread pool. The event loop monitors tasks in queues (timers, poll, check) and runs callbacks when the stack is empty. Thread pool starvation happens when all worker threads (default 4) are blocked by long-running CPU tasks, blocking incoming I/O calls.',
        feedback: 'Excellent overview of the event loop structure, Libuv thread role, and starvation definition.',
        score: 94
      },
      {
        question: 'How would you design a real-time notification service that scales to millions of active users?',
        answer: 'I would use WebSockets for persistent connections, backed by a Redis Pub/Sub layer to handle communication routing between servers. A load balancer would distribute users across Node.js servers, using a distributed message broker (Kafka or RabbitMQ) to guarantee message delivery even when users are offline.',
        feedback: 'A robust and scalable system design. Effectively links WebSockets, Redis caching, Pub/Sub, and robust brokers.',
        score: 86
      }
    ],
    strengths: [
      'Clear, detailed understanding of hashing mechanisms and edge cases',
      'Strong grasp of Node\'s Event Loop and blocking behavior',
      'Sound architectural choices for high-concurrency systems'
    ],
    improvements: [
      'Include details on horizontal scaling configurations for WebSockets (e.g. sticky sessions)'
    ]
  }
];

// Initialize session store
const initializeSessions = () => {
  const sessions = localStorage.getItem('algora_sessions');
  if (!sessions) {
    localStorage.setItem('algora_sessions', JSON.stringify(SEED_SESSIONS));
  }
};
initializeSessions();

// Utility keywords mapping to score responses dynamically
const KEYWORDS_DB = {
  'virtual dom': ['representation', 'diff', 'reconcil', 'batch', 're-render'],
  'optimize': ['profile', 'memo', 'usecallback', 'usememo', 'lazy', 'split', 'virtualize'],
  'disagreement': ['listen', 'communicat', 'compromise', 'align', 'argument', 'solution', 'agree'],
  'hash map': ['hash function', 'collision', 'chaining', 'addressing', 'complexity', 'o(1)', 'o(n)'],
  'event loop': ['single-thread', 'callback', 'libuv', 'queue', 'asynchronous', 'starvation'],
  'notification': ['websocket', 'pub/sub', 'redis', 'broker', 'queue', 'kafka', 'socket.io']
};

// List of common non-technical English words to ignore when extracting technical keywords
const STOP_WORDS = new Set([
  'what', 'is', 'how', 'why', 'explain', 'describe', 'a', 'an', 'the', 'and', 'or', 'to', 'of', 'in', 
  'for', 'with', 'on', 'at', 'by', 'from', 'about', 'as', 'your', 'you', 'i', 'we', 'are', 'does', 
  'do', 'discuss', 'difference', 'between', 'advantages', 'disadvantages', 'benefits', 'challenges', 
  'role', 'under', 'concept', 'meaning', 'use', 'using', 'used', 'can', 'should', 'would', 'could', 
  'when', 'where', 'which', 'who', 'whom', 'whose', 'it', 'its', 'they', 'them', 'their', 'this', 
  'that', 'these', 'those', 'then', 'than', 'some', 'any', 'each', 'every', 'all', 'both', 'only', 
  'other', 'another', 'such', 'own', 'same', 'so', 'too', 'very', 'will', 'just', 'now'
]);

// Helper to extract clean nouns/potential technical terms from a question
const extractQuestionKeywords = (questionText) => {
  const words = questionText
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
    .split(/\s+/);
  
  const extracted = [];
  words.forEach(w => {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      extracted.push(w);
    }
  });
  return [...new Set(extracted)];
};

export const interviewService = {
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Starts a candidate practice session
  startPracticeSession: async (role, focusTopic) => {
    await interviewService.delay(600);
    const sessionUser = JSON.parse(localStorage.getItem('algora_session') || '{}');
    const candidateId = sessionUser.id || 'cand_practice_guest';
    const candidateName = sessionUser.name || 'Practice Candidate';

    // Retrieve default questions
    const allQuestions = templateService.getQuestionBank();
    const filteredQuestions = allQuestions.filter(q => 
      q.category.toUpperCase() === focusTopic.toUpperCase() ||
      q.category.toUpperCase() === 'BEHAVIORAL' ||
      q.category.toUpperCase() === 'HR'
    ).slice(0, 3); // take up to 3 questions

    const selectedQuestionTexts = filteredQuestions.length > 0 
      ? filteredQuestions.map(q => q.text)
      : [
          'What are your primary technical strengths and how do you approach learning new frameworks?',
          'Discuss your architectural design decisions when configuring global client state.',
          'Explain how you ensure your web application meets high standards of accessibility and performance.'
        ];

    const newSession = {
      id: `sess_prac_${Date.now()}`,
      templateId: null,
      candidateId,
      candidateName,
      role: role || 'General Developer',
      title: `Practice: ${focusTopic} Setup`,
      date: new Date().toISOString(),
      score: null,
      status: 'In_Progress',
      timeLimit: 120, // seconds
      answers: selectedQuestionTexts.map(q => ({
        question: q,
        answer: '',
        feedback: null,
        score: null
      })),
      currentQuestionIndex: 0
    };

    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    sessions.unshift(newSession);
    localStorage.setItem('algora_sessions', JSON.stringify(sessions));

    return newSession;
  },

  // Start an interview joined by code
  startTemplateSession: async (code) => {
    await interviewService.delay(700);
    const template = await templateService.getTemplateByCode(code);
    if (!template) {
      throw new Error('Interview template not found. Please verify the code.');
    }

    const sessionUser = JSON.parse(localStorage.getItem('algora_session') || '{}');
    const candidateId = sessionUser.id || `cand_guest_${Date.now()}`;
    const candidateName = sessionUser.name || 'Guest Candidate';

    const newSession = {
      id: `sess_tpl_${Date.now()}`,
      templateId: template.id,
      candidateId,
      candidateName,
      role: template.role,
      title: template.title,
      date: new Date().toISOString(),
      score: null,
      status: 'In_Progress',
      timeLimit: template.timeLimit,
      answers: template.questions.map(q => ({
        question: q,
        answer: '',
        feedback: null,
        score: null
      })),
      currentQuestionIndex: 0
    };

    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    sessions.unshift(newSession);
    localStorage.setItem('algora_sessions', JSON.stringify(sessions));

    // Increment candidate counts for template
    templateService.incrementCandidateCount(template.id);

    return newSession;
  },

  validateJoinCode: async (code) => {
    await interviewService.delay(500);
    const template = await templateService.getTemplateByCode(code);
    return template !== null;
  },

  getInterviewSession: async (id) => {
    await interviewService.delay(300);
    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    return sessions.find(s => s.id === id) || null;
  },

  submitAnswer: async (sessionId, questionIndex, answerText) => {
    await interviewService.delay(400);
    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    const sIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sIndex === -1) {
      throw new Error('Session not found');
    }

    const session = sessions[sIndex];
    if (questionIndex >= session.answers.length) {
      throw new Error('Invalid question index');
    }

    session.answers[questionIndex].answer = answerText;
    
    localStorage.setItem('algora_sessions', JSON.stringify(sessions));
    return true;
  },

  finishSession: async (sessionId) => {
    await interviewService.delay(1200); // simulate AI analysis loading
    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    const sIndex = sessions.findIndex(s => s.id === sessionId);

    if (sIndex === -1) {
      throw new Error('Session not found');
    }

    const session = sessions[sIndex];
    let totalScore = 0;
    
    // Evaluate answers using mock keywords analyzer
    session.answers.forEach((ans) => {
      const txt = ans.answer.toLowerCase();
      
      if (!txt || txt.trim().length < 15) {
        ans.score = txt.trim().length > 0 ? 35 : 0;
        ans.feedback = 'Answer is too brief or was left blank. To achieve a competitive score, present structured paragraphs that include core terms, architecture patterns, and concrete experience examples.';
        return;
      }

      // Check keyword occurrences
      let matches = 0;
      let matchedTerms = [];
      const questionText = ans.question.toLowerCase();
      let isPredefined = false;

      // Find keywords database match
      Object.keys(KEYWORDS_DB).forEach(key => {
        if (questionText.includes(key)) {
          isPredefined = true;
          KEYWORDS_DB[key].forEach(word => {
            if (txt.includes(word)) {
              matches++;
              matchedTerms.push(word);
            }
          });
        }
      });

      if (isPredefined) {
        // Compute grade for predefined question
        if (matches >= 3) {
          ans.score = Math.floor(Math.random() * 11) + 88; // 88-98
          ans.feedback = `Outstanding technical depth! You explained the structural components of this question with appropriate terminology (e.g. ${matchedTerms.join(', ')}). Your response shows deep familiarity with modern engineering paradigms.`;
        } else if (matches >= 1) {
          ans.score = Math.floor(Math.random() * 11) + 72; // 72-82
          ans.feedback = `Solid answer. You successfully identified some of the core elements (such as ${matchedTerms.join(', ')}). To elevate this response, provide a more complete explanation of the underlying runtime mechanics and practical edge cases.`;
        } else {
          ans.score = Math.floor(Math.random() * 12) + 55; // 55-66
          ans.feedback = 'Reasonable high-level overview, but lacking technical depth and runtime keywords. We suggest detailing how the component operates under load, database indexing patterns, or lifecycle updates.';
        }
      } else {
        // Custom Recruiter Question Dynamic Evaluation
        const extractedKeywords = extractQuestionKeywords(ans.question);
        
        extractedKeywords.forEach(word => {
          // Check if answer includes the word or a close prefix variation of at least 3 characters
          const stem = word.length > 4 ? word.substring(0, word.length - 2) : word;
          if (txt.includes(stem)) {
            matches++;
            matchedTerms.push(word);
          }
        });

        const wordCount = txt.split(/\s+/).filter(w => w.length > 0).length;

        if (wordCount >= 45 && matches >= 1) {
          ans.score = Math.floor(Math.random() * 8) + 88; // 88-95
          ans.feedback = `Outstanding technical depth! You explained the structural components of this question clearly, incorporating relevant concepts like ${matchedTerms.slice(0, 3).join(', ')}. Your response shows a strong theoretical grasp and good communication.`;
        } else if (wordCount >= 20) {
          ans.score = Math.floor(Math.random() * 11) + 72; // 72-82
          const termsString = matchedTerms.length > 0 ? ` (such as ${matchedTerms.slice(0, 2).join(', ')})` : '';
          ans.feedback = `Solid answer. You successfully identified some of the core elements of the question${termsString}. To elevate this response, provide a more complete explanation of the underlying runtime mechanics and practical architectural trade-offs.`;
        } else {
          ans.score = Math.floor(Math.random() * 16) + 50; // 50-65
          ans.feedback = 'Reasonable high-level overview, but lacking technical depth and length. We suggest presenting a more structured explanation detailing how these patterns behave in practice with specific examples.';
        }
      }
    });

    // Compute overall score
    const completedAnswers = session.answers;
    const scoreSum = completedAnswers.reduce((sum, ans) => sum + ans.score, 0);
    session.score = Math.round(scoreSum / completedAnswers.length);
    session.status = 'Completed';

    // Formulate strengths and improvements
    session.strengths = [];
    session.improvements = [];

    if (session.score >= 85) {
      session.strengths = [
        'Exceptional command of system frameworks and execution mechanics',
        'Consistently uses rich, domain-specific programming terminology',
        'Strong problem-solving and structured technical communication skills'
      ];
      session.improvements = [
        'Explore edge scenarios, scale bottlenecks, and extreme horizontal partitioning.'
      ];
    } else if (session.score >= 70) {
      session.strengths = [
        'Clear knowledge of primary concepts and design constraints',
        'Good structured flow when outlining architectural diagrams'
      ];
      session.improvements = [
        'Work on expanding explanation of runtime environments and framework-level internal components.',
        'Reference specific testing utilities or diagnostics tools when discussing optimization.'
      ];
    } else {
      session.strengths = [
        'Identified fundamental application logic constraints'
      ];
      session.improvements = [
        'Expand technical vocabularies in computer science fundamentals (data structures, system nodes).',
        'Elaborate on real-world engineering experiences rather than dry theoretical summaries.'
      ];
    }

    localStorage.setItem('algora_sessions', JSON.stringify(sessions));
    return session;
  },

  getSessionResults: async (sessionId) => {
    return await interviewService.getInterviewSession(sessionId);
  },

  // Returns all completed sessions in system
  getAllSessions: async () => {
    await interviewService.delay(400);
    const sessions = localStorage.getItem('algora_sessions');
    return sessions ? JSON.parse(sessions) : [];
  },

  // History matching candidate scope
  getCandidateSessions: async (candidateId) => {
    await interviewService.delay(500);
    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    return sessions.filter(s => s.candidateId === candidateId);
  },

  // Results matching template scope (recruiter view)
  getTemplateSessions: async (templateId) => {
    await interviewService.delay(500);
    const sessions = JSON.parse(localStorage.getItem('algora_sessions') || '[]');
    return sessions.filter(s => s.templateId === templateId && s.status === 'Completed');
  }
};
