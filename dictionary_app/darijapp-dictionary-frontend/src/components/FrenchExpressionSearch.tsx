import { useEffect, useState } from "react";
import type { French } from "../models/French";
import FrenchWord from "./FrenchWord";
import { removeAccents } from "../helpers/SearchHelper";

function FrenchExpressionSearch() {
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
            setFilteredFrenchExpressions(frenchExpressions.filter(item => removeAccents(item.expression).toLowerCase().includes(removeAccents(searchFilter).toLowerCase())))
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

    return (
        <>
            <div className='form-container'>
                <label htmlFor='searchFilter'>Search:</label>
                <input name="searchFilter" type='text' onChange={updateSearchFilter}></input>
            </div>
            <div className="sub-container">
                <h3>Selected words:</h3>
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
                <h3>Search results:</h3>
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
        </>
    );
}

export default FrenchExpressionSearch;