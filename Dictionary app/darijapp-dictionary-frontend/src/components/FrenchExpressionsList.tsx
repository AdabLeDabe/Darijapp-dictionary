import { useState, useEffect } from 'react';
import '../App.css'
import type { FrenchWithTranslations } from '../models/FrenchWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';

function FrenchExpressionsList() {
  const [frenchExpressions, setFrenchExpressions] = useState<FrenchWithTranslations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('api/expressions/frenchWithTranslations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const result = await response.json();
        setFrenchExpressions(result);
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
    <table>
        <tr>
            <th>French</th>
            <th>Arabic</th>
        </tr>
        {frenchExpressions.map((item) => (
            <tr key={item.id}>
                <td>{item.expression} <i>{item.detail}</i></td>
                <td>
                    {item.translations.map((arabicItem) => (
                        <span>{arabicItem.expression_arabic} / {arabicItem.expression_phonetic} {GetVariantDisplay(arabicItem.variant)}</span>
                    ))}
                </td>
            </tr>
        ))}
    </table>
  </div>
}

export default FrenchExpressionsList
