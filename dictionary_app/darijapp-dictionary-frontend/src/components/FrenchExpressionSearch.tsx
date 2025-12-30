import { useEffect, useState } from "react";
import type { French } from "../models/French";
import FrenchWord from "./FrenchWord";
import { removeAccents } from "../helpers/SearchHelper";

interface FrenchExpressionSearchProps {
    existingTranslations: French[],
    linkedArabicExpressionId: number | null,
    returnCallBack: () => void
}

function FrenchExpressionSearch({ existingTranslations, linkedArabicExpressionId, returnCallBack }: FrenchExpressionSearchProps) {
    const [frenchExpressions, setFrenchExpressions] = useState<French[]>([]);
    const [filteredFrenchExpressions, setFilteredFrenchExpressions] = useState<French[]>([]);
    const [selectedFrenchExpressions, setSelectedFrenchExpressions] = useState<French[]>([]);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const updateSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    };

    const updateFilteredExpression = () => {
        if (isSearchFilterEmpty()) {
            setFilteredFrenchExpressions(frenchExpressions);
        }
        else {
            setFilteredFrenchExpressions(frenchExpressions.filter(item =>
                removeAccents(item.expression).toLowerCase().includes(removeAccents(searchFilter).toLowerCase())
                && !existingTranslations.some(exisitng => exisitng.id === item.id)))
        }
    }

    const isSearchFilterEmpty = () => {
        return (!searchFilter || searchFilter.trim() === "");
    }

    const toggleSelection = (frenchWord: French) => {
        setSelectedFrenchExpressions(oldArray => {
            if (isWordSelected(frenchWord)) {
                return oldArray.filter(selected => selected.id !== frenchWord.id);
            }
            else {
                return [...oldArray, frenchWord];
            }
        });
    }

    const isWordSelected = (frenchWord: French) => {
        return selectedFrenchExpressions.some(selected => selected.id === frenchWord.id);
    }

    const OnSaveAndReturn = async () => {
        if (linkedArabicExpressionId == null) {
            console.log("so the arabic id that is never supposed to be null is null somehow, no translations will be made");
        }
        else {
            await selectedFrenchExpressions.forEach(async item => {
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
            const response = await fetch('api/expressions/french');

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            const result = await response.json();
            console.log('Success: ', result);
            setFrenchExpressions(result);
            setFilteredFrenchExpressions(result);
        } catch (err) {
            console.log('Failure: ', err);
        }
    };

    const addTranslation = async (frenchWordId: number) => {
        try {
            console.log("french id: " + frenchWordId + " arabic id: " + linkedArabicExpressionId)
            const response = await fetch('/api/translations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    french_id: frenchWordId,
                    arabic_id: linkedArabicExpressionId
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
                    {selectedFrenchExpressions.map(frenchWord => (
                        <div
                            key={frenchWord.id}
                            onClick={() => toggleSelection(frenchWord)}>
                            <FrenchWord word={frenchWord} isSelected={isWordSelected(frenchWord)} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="sub-container">
                <h3>Search results</h3>
                <div className="translation-list">
                    {!isSearchFilterEmpty()
                        && filteredFrenchExpressions.map(frenchWord => (
                            !isWordSelected(frenchWord)
                            && <div
                                key={frenchWord.id}
                                onClick={() => toggleSelection(frenchWord)}>
                                <FrenchWord word={frenchWord} isSelected={false} />
                            </div>
                        ))}
                </div>
            </div>
            <button onClick={OnSaveAndReturn}>Save and return</button>
        </>
    );
}

export default FrenchExpressionSearch;