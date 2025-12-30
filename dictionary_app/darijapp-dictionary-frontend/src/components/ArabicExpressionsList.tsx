import { useState, useEffect } from 'react';
import '../App.css'
import type { ArabicWithTranslations } from '../models/ArabicWithTranslations';
import { GetVariantDisplay } from '../helpers/ArabicDisplay';
import FrenchWord from './FrenchWord';

interface ArabicExpressionsListProps {
    selectedItem: ArabicWithTranslations | null,
    setSelectedItem: (newSelectedItem: ArabicWithTranslations | null) => void,
    editCallback: () => void,
    filter: string
}

function ArabicExpressionsList({ selectedItem, setSelectedItem, editCallback, filter }: ArabicExpressionsListProps) {
    const [arabicExpressions, setArabicExpressions] = useState<ArabicWithTranslations[]>([]);
    const [filteredArabicExpressions, setFilteredArabicExpressions] = useState<ArabicWithTranslations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateFilter();
    }, [filter]);

    const fetchData = async () => {
        try {
            const response = await fetch('api/expressions/arabicWithTranslations');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            setArabicExpressions(result);
            setFilteredArabicExpressions(result);
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

    const updateFilter = () => {
        if (!filter || filter.trim() === "") {
            setFilteredArabicExpressions(arabicExpressions);
        }
        else {
            setFilteredArabicExpressions(arabicExpressions.filter(item => filterStringsFlexibleSchwa(item.expression_phonetic)));
        }
    }

    function normalizeForSearch(str: string): string {
        let norm = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        norm = norm.replace(/ɛ/g, "3");
        return norm;
    }

    function filterStringsFlexibleSchwa(item: string): boolean {
        const normKeywordE = normalizeForSearch(item.replace(/ə/g, "e"));
        const normKeywordA = normalizeForSearch(item.replace(/ə/g, "a"));
        return normKeywordE.toLowerCase().includes(filter.toLowerCase()) || normKeywordA.toLowerCase().includes(filter.toLowerCase());
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
                {filteredArabicExpressions.map((item) => (
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