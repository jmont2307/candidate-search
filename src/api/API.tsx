const getAuthHeaders = (): Record<string, string> => {
  // Just use Vite's environment variable system
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.warn('GitHub token not found in environment variables');
    return {}; // Empty object still matches Record<string, string> type
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};

// Demo data in case API calls fail
const DEMO_USERS = [
  {
    login: "octocat",
    id: 583231,
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    html_url: "https://github.com/octocat",
    type: "User"
  },
  {
    login: "defunkt",
    id: 2,
    avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    html_url: "https://github.com/defunkt",
    type: "User"
  },
  {
    login: "pjhyett",
    id: 3,
    avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
    html_url: "https://github.com/pjhyett",
    type: "User"
  }
];

const searchGithub = async () => {
  try {
    // Use a smaller range to increase chances of finding active users
    const start = Math.floor(Math.random() * 1000000) + 1;
    console.log('Searching GitHub users since:', start);
    
    const headers = getAuthHeaders();
    
    try {
      const response = await fetch(
        `https://api.github.com/users?since=${start}&per_page=30`,
        {
          headers: headers
        }
      );
      
      if (!response.ok) {
        console.error('GitHub API error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Found', data.length, 'users from API');
      return data.length > 0 ? data : DEMO_USERS;
    } catch (fetchError) {
      console.error('Fetch error, using demo data:', fetchError);
      return DEMO_USERS;
    }
  } catch (err) {
    console.error('Error in searchGithub, using demo data:', err);
    return DEMO_USERS;
  }
};

// Demo user details for fallback
const DEMO_USER_DETAILS = {
  "octocat": {
    login: "octocat",
    id: 583231,
    avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
    html_url: "https://github.com/octocat",
    name: "The Octocat",
    company: "GitHub",
    blog: "https://github.blog",
    location: "San Francisco",
    email: null,
    bio: "I'm the GitHub mascot!",
    twitter_username: null,
    public_repos: 8,
    followers: 10000,
    following: 0
  },
  "defunkt": {
    login: "defunkt",
    id: 2,
    avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    html_url: "https://github.com/defunkt",
    name: "Chris Wanstrath",
    company: null,
    blog: "http://chriswanstrath.com/",
    location: null,
    email: null,
    bio: "🍔",
    twitter_username: null,
    public_repos: 107,
    followers: 21000,
    following: 210
  },
  "pjhyett": {
    login: "pjhyett",
    id: 3,
    avatar_url: "https://avatars.githubusercontent.com/u/3?v=4",
    html_url: "https://github.com/pjhyett",
    name: "PJ Hyett",
    company: "GitHub",
    blog: "http://hyett.com",
    location: "San Francisco",
    email: null,
    bio: null,
    twitter_username: null,
    public_repos: 56,
    followers: 8000,
    following: 28
  }
};

const searchGithubUser = async (username: string) => {
  try {
    console.log('Fetching details for user:', username);
    
    // If we have demo data for this user, use that when in development/test mode
    if (import.meta.env.MODE !== 'production' && DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS]) {
      console.log('Using demo data for user:', username);
      return DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS];
    }
    
    const headers = getAuthHeaders();
    
    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers: headers
      });
      
      if (!response.ok) {
        console.error('GitHub API error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.error('Error details:', errorData);
        
        // If we have demo data for this user, fall back to that
        if (DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS]) {
          console.log('Falling back to demo data for user:', username);
          return DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS];
        }
        
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('User details retrieved successfully');
      return data;
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      
      // If we have demo data for this user, fall back to that
      if (DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS]) {
        console.log('Falling back to demo data for user after fetch error:', username);
        return DEMO_USER_DETAILS[username as keyof typeof DEMO_USER_DETAILS];
      }
      
      // Otherwise fall back to the first demo user we have
      console.log('Using first demo user as fallback');
      return DEMO_USER_DETAILS.octocat;
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    
    // Final fallback - return the first demo user
    console.log('Using first demo user as final fallback');
    return DEMO_USER_DETAILS.octocat;
  }
};

export { searchGithub, searchGithubUser };
