import { useState, useEffect } from 'react';
import '../App.css'
import type { ArabicWithTranslations } from '../models/ArabicWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';
import FrenchWord from './FrenchWord';

interface ArabicExpressionsListProps {
    selectedItem: ArabicWithTranslations | null,
    setSelectedItem: (newSelectedItem: ArabicWithTranslations | null) => void,
    editCallback: () => void
}

function ArabicExpressionsList({ selectedItem, setSelectedItem, editCallback }: ArabicExpressionsListProps) {
    const [arabicExpressions, setArabicExpressions] = useState<ArabicWithTranslations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('api/expressions/arabicWithTranslations');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            setArabicExpressions(result);
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
            const response = await fetch('/api/expressions/arabic/' + selectedItem?.id, {
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
                    <div className='expression-table-cell'>Arabic</div>
                    <div className='expression-table-cell'>French</div>
                    <div className='expression-table-cell-tool'></div>
                </div>
                {arabicExpressions.map((item) => (
                    <div
                        key={item.id}
                        className={(selectedItem?.id === item.id ? 'expression-table-row-selected' : 'expression-table-row')}
                        onClick={() => setSelectedItem(item)}>
                        <div className='expression-table-cell'>
                            {item.expression_arabic} / {item.expression_phonetic} {GetVariantDisplay(item.variant)}
                        </div>
                        <div className='expression-table-cell'>
                            {item.translations.map((frenchItem) => (
                                <div key={frenchItem.id}>
                                    <FrenchWord word={frenchItem} isSelected={false} />
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

export default ArabicExpressionsList;