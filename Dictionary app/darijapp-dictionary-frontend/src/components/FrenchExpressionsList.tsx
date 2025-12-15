import { useState, useEffect } from 'react';
import '../App.css'
import type { FrenchWithTranslations } from '../models/FrenchWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';

function FrenchExpressionsList() {
  const [frenchExpressions, setFrenchExpressions] = useState<FrenchWithTranslations[]>([]);
  const [selectedItem, setSelectedItem] = useState<FrenchWithTranslations | null>(null);
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

  return (
  <div className='expression-table'>
    <div className='expression-table-header'>
      <div className='expression-table-cell'>French</div>
      <div className='expression-table-cell'>Arabic</div>
    </div>
    {frenchExpressions.map((item) => (
        <div
        key={item.id}
        className={'expression-table-row' + (selectedItem?.id === item.id ? ' expression-table-row-selected' : '')}
        onClick={() => setSelectedItem(item)}>
            <div className='expression-table-cell'>{item.expression} <i>{item.detail}</i></div>
            <div className='expression-table-cell'>
                {item.translations.map((arabicItem) => (
                    <div className='expression-table-arabic-word'>
                        {arabicItem.expression_arabic} / {arabicItem.expression_phonetic} {GetVariantDisplay(arabicItem.variant)}
                    </div>
                ))}
            </div>
        </div>
    ))}
    {/* <table className='expression-table'>
        <tr className='expression-table-header'>
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
    </table> */}
  </div>);
}

export default FrenchExpressionsList
