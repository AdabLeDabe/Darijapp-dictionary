import { useEffect, useState } from "react";
import { filterStringsFlexibleSchwa } from "../../helpers/SearchHelper";
import type { Arabic } from "../../models/Arabic";
import ArabicWord from "./ArabicWord";

interface ArabicExpressionSearchProps {
    existingTranslations: Arabic[],
    linkedFrenchExpressionId: number | null,
    returnCallBack: () => void
}

function ArabicExpressionSearch({ existingTranslations, linkedFrenchExpressionId, returnCallBack }: ArabicExpressionSearchProps) {
    const [arabicExpressions, setArabicExpressions] = useState<Arabic[]>([]);
    const [filteredArabicExpressions, setFilteredArabicExpressions] = useState<Arabic[]>([]);
    const [selectedArabicExpressions, setSelectedArabicExpressions] = useState<Arabic[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const updateSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    };

    const updateFilteredExpression = () => {
        if (isSearchFilterEmpty()) {
            setFilteredArabicExpressions(arabicExpressions);
        }
        else {
            setFilteredArabicExpressions(arabicExpressions.filter(item =>
                filterStringsFlexibleSchwa(item.expression_phonetic, searchFilter)
                && !existingTranslations.some(exisitng => exisitng.id === item.id)));
        }
    }

    const isSearchFilterEmpty = () => {
        return (!searchFilter || searchFilter.trim() === "");
    }

    const toggleSelection = (arabicWord: Arabic) => {
        setSelectedArabicExpressions(oldArray => {
            if (isWordSelected(arabicWord)) {
                return oldArray.filter(selected => selected.id !== arabicWord.id);
            }
            else {
                return [...oldArray, arabicWord];
            }
        });
    }

    const isWordSelected = (arabicWord: Arabic) => {
        return selectedArabicExpressions.some(selected => selected.id === arabicWord.id);
    }

    const OnSaveAndReturn = async () => {
        if (linkedFrenchExpressionId == null) {
            console.log("so the french id that is never supposed to be null is null somehow, no translations will be made");
        }
        else {
            await selectedArabicExpressions.forEach(async item => {
                await addTranslation(item.id);
            });
        }

        returnCallBack();
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateFilteredExpression();
    }, [searchFilter]);

    const fetchData = async () => {
        try {
            const response = await fetch('api/expressions/arabic');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            console.log('Success: ', result);
            setArabicExpressions(result);
            setFilteredArabicExpressions(result);
        } catch (err) {
            console.log('Failure: ', err);
        }
    };

    const addTranslation = async (arabicWordId: number) => {
        try {
            console.log("arabic id: " + arabicWordId + " french id: " + linkedFrenchExpressionId)
            const response = await fetch('/api/translations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    arabic_id: arabicWordId,
                    french_id: linkedFrenchExpressionId
                })
            });

            if (!response.ok)
                throw new Error('Failed to add translation');

            const result = await response.json();
            console.log('Success: ', result);
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <>
            <div className='form-container'>
                <label htmlFor='searchFilter'>Search:</label>
                <input name="searchFilter" type='text' onChange={updateSearchFilter}></input>
            </div>
            <div className="sub-container">
                <h3>Selected words</h3>
                <div className="translation-list">
                    {selectedArabicExpressions.map(arabicWord => (
                        <div
                            key={arabicWord.id}
                            onClick={() => toggleSelection(arabicWord)}>
                            <ArabicWord word={arabicWord} isSelected={isWordSelected(arabicWord)} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="sub-container">
                <h3>Search results</h3>
                <div className="translation-list">
                    {!isSearchFilterEmpty()
                        && filteredArabicExpressions.map(arabicWord => (
                            !isWordSelected(arabicWord)
                            && <div
                                key={arabicWord.id}
                                onClick={() => toggleSelection(arabicWord)}>
                                <ArabicWord word={arabicWord} isSelected={false} />
                            </div>
                        ))}
                </div>
            </div>
            <button onClick={OnSaveAndReturn}>Save and return</button>
        </>
    );
}

export default ArabicExpressionSearch;