import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noMoreCandidates, setNoMoreCandidates] = useState<boolean>(false);

  // Function to load a candidate
  const loadCandidate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get random users
      const users = await searchGithub();
      
      if (!users || users.length === 0) {
        setNoMoreCandidates(true);
        setLoading(false);
        return;
      }
      
      // Get detailed info for the first user
      const userDetails = await searchGithubUser(users[0].login);
      
      if (!userDetails || !userDetails.login) {
        // Try next user if this one fails
        loadCandidate();
        return;
      }
      
      setCurrentCandidate(userDetails);
    } catch (err) {
      setError('Failed to fetch candidate data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial candidate on component mount
  useEffect(() => {
    loadCandidate();
  }, []);

  // Function to accept a candidate
  const acceptCandidate = () => {
    if (!currentCandidate) return;
    
    // Get existing saved candidates from localStorage
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    
    // Add current candidate to saved list
    savedCandidates.push(currentCandidate);
    
    // Save updated list to localStorage
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    
    // Load next candidate
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
      <button onClick={loadCandidate}>Try Again</button>
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
