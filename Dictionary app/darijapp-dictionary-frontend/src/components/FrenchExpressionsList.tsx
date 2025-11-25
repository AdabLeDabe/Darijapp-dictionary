import { useState, useEffect } from 'react';
import '../App.css'
import type { French } from '../models/French';

function FrenchExpressionsList() {
  const [data, setData] = useState<French[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/expressions/french');
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const result = await response.json();
        setData(result);
      } catch(err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div>Loading...</div>;
  if (error)
    return <div>Error: {error}</div>

  return <div>
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.expression}</li>
      ))}
    </ul>
  </div>
}

export default FrenchExpressionsList
