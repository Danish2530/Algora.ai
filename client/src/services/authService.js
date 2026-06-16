// Mock authentication service storing credentials in localStorage to persist across refreshes.

const DEFAULT_CANDIDATE = {
  id: 'cand_1',
  name: 'Alex Rivera',
  email: 'candidate@algora.ai',
  role: 'candidate',
  title: 'Frontend Developer',
  company: null
};

const DEFAULT_RECRUITER = {
  id: 'rec_1',
  name: 'Sarah Jenkins',
  email: 'recruiter@algora.ai',
  role: 'recruiter',
  title: 'Lead Talent Partner',
  company: 'TechCorp Inc.'
};

// Seed default accounts in localStorage if not present
const initializeUsers = () => {
  const users = localStorage.getItem('algora_users');
  if (!users) {
    localStorage.setItem('algora_users', JSON.stringify([DEFAULT_CANDIDATE, DEFAULT_RECRUITER]));
  }
};

initializeUsers();

export const authService = {
  // Simulate API delay
  delay: (ms = 600) => new Promise(resolve => setTimeout(resolve, ms)),

  login: async (email, password) => {
    await authService.delay(800);
    
    // Quick validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const users = JSON.parse(localStorage.getItem('algora_users') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('User not found. Try candidate@algora.ai or recruiter@algora.ai');
    }

    // Accept password123 as the universal mock password
    if (password !== 'password123') {
      throw new Error('Invalid credentials. Hint: use password123');
    }

    // Set current session
    localStorage.setItem('algora_session', JSON.stringify(user));
    return user;
  },

  signup: async (userData) => {
    await authService.delay(900);

    const { name, email, password, role, title, company } = userData;

    if (!name || !email || !password || !role) {
      throw new Error('Please fill in all required fields');
    }

    const users = JSON.parse(localStorage.getItem('algora_users') || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered');
    }

    const newUser = {
      id: `${role === 'recruiter' ? 'rec' : 'cand'}_${Date.now()}`,
      name,
      email,
      role,
      title: title || (role === 'candidate' ? 'Software Engineer' : 'Recruitment Specialist'),
      company: role === 'recruiter' ? (company || 'Indie Corp') : null
    };

    users.push(newUser);
    localStorage.setItem('algora_users', JSON.stringify(users));
    
    // Automatically log in the user upon signup
    localStorage.setItem('algora_session', JSON.stringify(newUser));
    return newUser;
  },

  logout: async () => {
    await authService.delay(300);
    localStorage.removeItem('algora_session');
    return true;
  },

  getCurrentUser: () => {
    const session = localStorage.getItem('algora_session');
    return session ? JSON.parse(session) : null;
  }
};
