import { useState, useEffect } from 'react';
import '../App.css'
import type { FrenchWithTranslations } from '../models/FrenchWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';

interface FrenchExpressionsListProps {
    selectedItem: FrenchWithTranslations | null,
    setSelectedItem: (newSelectedItem: FrenchWithTranslations) => void,
    setEditMode: (newEditMode: boolean) => void
}

function FrenchExpressionsList({ selectedItem: selectedItem, setSelectedItem: setSelectedItem, setEditMode: setEditMode }: FrenchExpressionsListProps) {
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
                                <div className='expression-table-arabic-word'>
                                    {arabicItem.expression_arabic} / {arabicItem.expression_phonetic} {GetVariantDisplay(arabicItem.variant)}
                                </div>
                            ))}
                        </div>
                        <div className='expression-table-cell-tool'>
                            <button disabled={selectedItem?.id != item.id} onClick={() => setEditMode(true)}>Edit</button>
                            <button disabled={selectedItem?.id != item.id} >Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </>);
}

export default FrenchExpressionsList
