import { useState, useEffect } from 'react';
import '../App.css'
import type { FrenchWithTranslations } from '../models/FrenchWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';

interface FrenchExpressionsListProps {
    selectedItem: FrenchWithTranslations | null,
    setSelectedItem: (newSelectedItem: FrenchWithTranslations | null) => void,
    editCallback: () => void
}

function FrenchExpressionsList({ selectedItem, setSelectedItem, editCallback }: FrenchExpressionsListProps) {
    const [frenchExpressions, setFrenchExpressions] = useState<FrenchWithTranslations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('api/expressions/frenchWithTranslations');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            setFrenchExpressions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const deleteWord = async () => {
        if (selectedItem == null) {
            return;
        }
        try {
            const response = await fetch('/api/expressions/french/' + selectedItem?.id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok)
                throw new Error('Failed to delete word');

            const result = await response.json();
            console.log('Success: ', result);
        } catch (error) {
            console.log('Error: ', error)
        }
        finally {
            setSelectedItem(null);
            fetchData();
        }
    }

    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>Error: {error}</div>

    return (
        <>
            <div className='expression-table'>
                <div className='expression-table-header'>
                    <div className='expression-table-cell'>French</div>
                    <div className='expression-table-cell'>Arabic</div>
                    <div className='expression-table-cell-tool'></div>
                </div>
                {frenchExpressions.map((item) => (
                    <div
                        key={item.id}
                        className={(selectedItem?.id === item.id ? 'expression-table-row-selected' : 'expression-table-row')}
                        onClick={() => setSelectedItem(item)}>
                        <div className='expression-table-cell'>{item.expression} <i>{item.detail}</i></div>
                        <div className='expression-table-cell'>
                            {item.translations.map((arabicItem) => (
                                <div key={arabicItem.id} className='expression-table-arabic-word'>
                                    {arabicItem.expression_arabic} / {arabicItem.expression_phonetic} {GetVariantDisplay(arabicItem.variant)}
                                </div>
                            ))}
                        </div>
                        <div className='expression-table-cell-tool'>
                            <button disabled={selectedItem?.id != item.id} onClick={() => editCallback()}>Edit</button>
                            <button disabled={selectedItem?.id != item.id} onClick={() => deleteWord()}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>);
}

export default FrenchExpressionsList
