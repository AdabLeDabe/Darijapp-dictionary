import { useEffect, useState } from "react";
import type { Category } from "../../models/Category";
import WordDisplay from "../WordDisplay";

interface FrenchCategoriesEditionProps {
    frenchId: number | null,
    currentlySelectedCategories: Category[],
    returnCallBack: () => void
}

function FrenchCategoriesEdition({ frenchId, currentlySelectedCategories, returnCallBack }: FrenchCategoriesEditionProps) {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('api/categories');

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const result = await response.json();
                setCategoriesList(result);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
        setSelectedCategories(currentlySelectedCategories);
    }, [frenchId]);

    const addCategoryToFrenchWord = async (category: Category) => {
        try {
            const response = await fetch('api/expressions/french/' + frenchId + '/categories/' + category.id, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to add category to french word');
            }

            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    const removeCategoryFromFrenchWord = async (category: Category) => {
        try {
            const response = await fetch('api/expressions/french/' + frenchId + '/categories/' + category.id, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove category from french word');
            }

            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    const toggleSelection = (category: Category) => {
        setSelectedCategories(oldArray => {
            if (isCategorySelected(category)) {
                return oldArray.filter(selected => selected.id !== category.id);
            }
            else {
                return [...oldArray, category];
            }
        });
    }

    const isCategorySelected = (category: Category) => {
        return selectedCategories.some(selected => selected.id === category.id);
    }

    const OnSaveAndReturn = async () => {
        const categoriesToRemove = currentlySelectedCategories.filter(currentlySelectedCategory => !selectedCategories.some(c => c.id == currentlySelectedCategory.id));
        const categoriesToAdd = selectedCategories.filter(selectedCategory => !currentlySelectedCategories.some(c => c.id == selectedCategory.id));

        console.log("categories to add: " + categoriesToAdd);
        console.log("categories to remove: " + categoriesToRemove);
        if (frenchId !== null) {
            await Promise.all([
                ...categoriesToRemove.map(c => removeCategoryFromFrenchWord(c)),
                ...categoriesToAdd.map(c => addCategoryToFrenchWord(c))
            ]);
        }
        else {
            console.log("French id is null for some reason, no api calls are made");
        }

        returnCallBack();
    }

    return (
        <div className="sub-container">
            <div className="category-list">
                {categoriesList.map(category => (
                    <div
                        key={category.id}
                        onClick={() => toggleSelection(category)} >
                        <WordDisplay isSelected={selectedCategories.some(selectedCategory => selectedCategory.id == category.id)}>
                            {category.category_name}
                        </WordDisplay>
                    </div>
                ))}
            </div>
            <button onClick={async () => await OnSaveAndReturn()}>Save and return</button>
        </div>
    );
}

export default FrenchCategoriesEdition;