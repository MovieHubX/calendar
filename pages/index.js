// pages/index.js
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [url, setUrl] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/process-ics?url=${encodeURIComponent(url)}`);
      setNewUrl(response.data.newUrl);
    } catch (error) {
      console.error('Error processing .ics file:', error);
    }
  };

  return (
    <div>
      <h1>ICS File Processor</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter URL of .ics file:
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <button type="submit">Process</button>
      </form>
      {newUrl && (
        <div>
          <h2>Modified URL:</h2>
          <a href={newUrl} target="_blank" rel="noopener noreferrer">{newUrl}</a>
        </div>
      )}
    </div>
  );
}
