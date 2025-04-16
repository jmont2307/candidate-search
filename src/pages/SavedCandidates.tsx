import { useState, useEffect } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);

  // Load saved candidates from localStorage on component mount
  useEffect(() => {
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (storedCandidates) {
      setSavedCandidates(JSON.parse(storedCandidates));
    }
  }, []);

  // Function to remove a candidate from saved list
  const removeCandidate = (id: number) => {
    const updatedCandidates = savedCandidates.filter(candidate => candidate.id !== id);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1>Potential Candidates</h1>

      {savedCandidates.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>No potential candidates have been saved yet.</p>
        </div>
      ) : (
        <div className="candidates-table-container" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Username</th>
                <th>Location</th>
                <th>Email</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedCandidates.map(candidate => (
                <tr key={candidate.id}>
                  <td>
                    <img 
                      src={candidate.avatar_url} 
                      alt={`${candidate.login} avatar`}
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                    />
                  </td>
                  <td>{candidate.name || 'N/A'}</td>
                  <td>
                    <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                      {candidate.login}
                    </a>
                  </td>
                  <td>{candidate.location || 'N/A'}</td>
                  <td>{candidate.email || 'N/A'}</td>
                  <td>{candidate.company || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => removeCandidate(candidate.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white' }}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SavedCandidates;
