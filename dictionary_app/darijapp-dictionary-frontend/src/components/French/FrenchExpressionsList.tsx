import { useState, useEffect } from 'react';
import '../../App.css'
import type { FrenchWithTranslations } from '../../models/FrenchWithTranslations';
import ArabicWord from '../Arabic/ArabicWord';
import { removeAccents } from '../../helpers/SearchHelper';
import WordDisplay from '../WordDisplay';
import type { Category } from '../../models/Category';

interface FrenchExpressionsListProps {
    selectedItem: FrenchWithTranslations | null,
    setSelectedItem: (newSelectedItem: FrenchWithTranslations | null) => void,
    editCallback: () => void,
    filter: string
}

function FrenchExpressionsList({ selectedItem, setSelectedItem, editCallback, filter }: FrenchExpressionsListProps) {
    const [frenchExpressions, setFrenchExpressions] = useState<FrenchWithTranslations[]>([]);
    const [filteredFrenchExpressions, setFilteredFrenchExpressions] = useState<FrenchWithTranslations[]>([]);
    const [categories, setCategories] = useState<{ [key: number]: Category[] }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateFilter();
    }, [filter]);

    useEffect(() => {
        updateCategories();
    }, [filteredFrenchExpressions]);

    const fetchData = async () => {
        try {
            const response = await fetch('api/expressions/frenchWithTranslations');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            setFrenchExpressions(result);
            setFilteredFrenchExpressions(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const updateFilter = async () => {
        if (!filter || filter.trim() === "") {
            setFilteredFrenchExpressions(frenchExpressions);
        }
        else {
            setFilteredFrenchExpressions(frenchExpressions.filter(item => removeAccents(item.expression).toLowerCase().includes(removeAccents(filter).toLowerCase())))
        }
    }

    const updateCategories = async () => {
        // Fetch all categories in parallel, returning an array of [id, categories] pairs:
        const entries = await Promise.all(
            filteredFrenchExpressions.map(async c => {
                const cats = await getCategories(c.id);
                return [c.id, cats] as [number, Category[]];
            })
        );

        // Turn the array of pairs into an object/dictionary:
        const categoriesDictionary = Object.fromEntries(entries);
        // Update state
        setCategories(categoriesDictionary);
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

    const getCategories = async (frenchId: number): Promise<Category[]> => {
        try {
            const response = await fetch('api/expressions/french/' + frenchId + '/categories');

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            console.log("WESH???")
            return await response.json();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return [];
        }
    }

    const displayCategories = (frenchId: number) => {
        if (categories.hasOwnProperty(frenchId)) {
            return (<>
                {categories[frenchId].map((category) => (
                    <div key={category.id}>
                        <WordDisplay isSelected={false}>
                            {category.category_name}
                        </WordDisplay>
                    </div>
                ))}
            </>);
        }
        else {
            return (<></>);
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
                    <div className='expression-table-cell'>Category</div>
                    <div className='expression-table-cell-tool'></div>
                </div>
                {filteredFrenchExpressions.map((item) => (
                    <div
                        key={item.id}
                        className={(selectedItem?.id === item.id ? 'expression-table-row-selected' : 'expression-table-row')}
                        onClick={() => setSelectedItem(item)}>
                        <div className='expression-table-cell'>{item.expression} <i>{item.detail}</i></div>
                        <div className='expression-table-cell'>
                            {item.translations.map((arabicItem) => (
                                <div key={arabicItem.id}>
                                    <WordDisplay isSelected={false}>
                                        <ArabicWord word={arabicItem} />
                                    </WordDisplay>
                                </div>
                            ))}
                        </div>
                        <div className='expression-table-cell'>
                            {displayCategories(item.id)}
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
