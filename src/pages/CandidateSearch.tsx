import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noMoreCandidates, setNoMoreCandidates] = useState<boolean>(false);

  // Function to load a candidate
  const loadCandidate = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading candidate, attempt:', retryCount + 1);
      
      // Get random users
      const users = await searchGithub();
      
      if (!users || users.length === 0) {
        console.log('No users found, setting noMoreCandidates to true');
        setNoMoreCandidates(true);
        setLoading(false);
        return;
      }
      
      console.log('Found', users.length, 'users, using the first one');
      
      // Try more than just the first user if we have multiple
      const userIndex = Math.min(retryCount, users.length - 1);
      const user = users[userIndex];
      
      if (!user || !user.login) {
        console.error('Invalid user data:', user);
        if (retryCount < 3) {
          // Try again with a new batch of users
          console.log('Retrying with a new batch of users');
          loadCandidate(retryCount + 1);
        } else {
          setError('Failed to fetch valid user data after multiple attempts');
          setLoading(false);
        }
        return;
      }
      
      // Get detailed info for the user
      const userDetails = await searchGithubUser(user.login);
      
      if (!userDetails || !userDetails.login) {
        console.error('Invalid user details:', userDetails);
        // Try next user if available, otherwise retry
        if (userIndex < users.length - 1) {
          console.log('Trying next user in list');
          loadCandidate(retryCount + 1);
        } else if (retryCount < 3) {
          console.log('Retrying with a new batch of users');
          loadCandidate(retryCount + 1);
        } else {
          setError('Failed to fetch valid user details after multiple attempts');
          setLoading(false);
        }
        return;
      }
      
      console.log('Successfully loaded user details:', userDetails.login);
      setCurrentCandidate(userDetails);
      setLoading(false);
    } catch (err) {
      console.error('Error loading candidate:', err);
      if (retryCount < 3) {
        console.log('Retrying after error, attempt:', retryCount + 2);
        setTimeout(() => loadCandidate(retryCount + 1), 1000); // Add delay between retries
      } else {
        setError('Failed to fetch candidate data after multiple attempts');
        setLoading(false);
      }
    }
  };

  // Load initial candidate on component mount
  useEffect(() => {
    loadCandidate();
  }, []);

  // Function to accept a candidate
  const acceptCandidate = () => {
    if (!currentCandidate) {
      console.error('Cannot accept: No current candidate');
      return;
    }
    
    try {
      // Get existing saved candidates from localStorage
      let savedCandidates = [];
      try {
        const savedData = localStorage.getItem('savedCandidates');
        savedCandidates = savedData ? JSON.parse(savedData) : [];
        
        // Ensure it's an array
        if (!Array.isArray(savedCandidates)) {
          console.error('Saved candidates is not an array, resetting');
          savedCandidates = [];
        }
      } catch (err) {
        console.error('Error parsing saved candidates:', err);
        savedCandidates = [];
      }
      
      console.log('Current saved candidates:', savedCandidates.length);
      
      // Check if candidate is already saved (avoid duplicates)
      const isDuplicate = savedCandidates.some(
        candidate => candidate.id === currentCandidate.id
      );
      
      if (!isDuplicate) {
        // Add current candidate to saved list
        savedCandidates.push(currentCandidate);
        console.log('Added candidate to saved list:', currentCandidate.login);
        
        // Save updated list to localStorage
        localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
        console.log('Saved updated list with', savedCandidates.length, 'candidates');
      } else {
        console.log('Candidate already saved, skipping:', currentCandidate.login);
      }
    } catch (err) {
      console.error('Error saving candidate:', err);
    }
    
    // Load next candidate regardless of success/failure
    loadCandidate();
  };

  // Function to reject a candidate
  const rejectCandidate = () => {
    // Simply load the next candidate
    loadCandidate();
  };

  // Display loading state
  if (loading) {
    return <div className="container">
      <h1>Finding Candidates...</h1>
      <div>Loading...</div>
    </div>;
  }

  // Display error state
  if (error) {
    return <div className="container">
      <h1>Error</h1>
      <div>{error}</div>
      <button onClick={() => loadCandidate(0)}>Try Again</button>
    </div>;
  }

  // Display no more candidates state
  if (noMoreCandidates) {
    return <div className="container">
      <h1>No More Candidates</h1>
      <div>There are no more candidates available to review at this time.</div>
    </div>;
  }

  // Display candidate info
  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Candidate Search</h1>
      
      {currentCandidate && (
        <div className="candidate-card" style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <img 
            src={currentCandidate.avatar_url} 
            alt={`${currentCandidate.login} avatar`} 
            style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '15px' }}
          />
          
          <h2>{currentCandidate.name || 'No Name'}</h2>
          <p>Username: <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">{currentCandidate.login}</a></p>
          {currentCandidate.location && <p>Location: {currentCandidate.location}</p>}
          {currentCandidate.email && <p>Email: {currentCandidate.email}</p>}
          {currentCandidate.company && <p>Company: {currentCandidate.company}</p>}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button 
              onClick={rejectCandidate}
              style={{ backgroundColor: '#dc3545', color: 'white' }}
            >
              -
            </button>
            <button 
              onClick={acceptCandidate}
              style={{ backgroundColor: '#28a745', color: 'white' }}
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
