import { useState, useEffect } from 'react';
import '../App.css'
import type { Arabic } from '../models/Arabic';

function ArabicExpressionsList() {
  const [data, setData] = useState<Arabic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/expressions/arabic');

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
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
        <li key={item.id}>{item.expression_arabic} / {item.expression_phonetic}</li>
      ))}
    </ul>
  </div>
}

export default ArabicExpressionsList
