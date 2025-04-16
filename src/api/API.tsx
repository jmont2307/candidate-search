const getAuthHeaders = (): Record<string, string> => {
  // Try both ways of accessing environment variables
  const token = import.meta.env.VITE_GITHUB_TOKEN || 
               (typeof process !== 'undefined' && process.env && process.env.VITE_GITHUB_TOKEN);
  
  console.log('Token exists:', !!token);
  
  if (!token) {
    console.warn('GitHub token not found in environment variables');
    return {}; // Empty object still matches Record<string, string> type
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};

const searchGithub = async () => {
  try {
    // Use a smaller range to increase chances of finding active users
    const start = Math.floor(Math.random() * 1000000) + 1;
    console.log('Searching GitHub users since:', start);
    
    const headers = getAuthHeaders();
    
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
    console.log('Found', data.length, 'users');
    return data;
  } catch (err) {
    console.error('Error searching GitHub:', err);
    return [];
  }
};

const searchGithubUser = async (username: string) => {
  try {
    console.log('Fetching details for user:', username);
    
    const headers = getAuthHeaders();
    
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: headers
    });
    
    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('Error details:', errorData);
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('User details retrieved successfully');
    return data;
  } catch (err) {
    console.error('Error fetching user details:', err);
    return {};
  }
};

export { searchGithub, searchGithubUser };
