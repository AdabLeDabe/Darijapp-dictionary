import { useEffect, useState } from "react";
import type { Category } from "../models/Category";
import WordDisplay from "./WordDisplay";

function CategoryCreation() {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

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

    const deleteCategory = async () => {
        if (selectedCategory == null) {
            return;
        }
        try {
            const response = await fetch('api/categories/' + selectedCategory?.id, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch');
            }

            setCategoriesList(categoriesList.filter(c => c.id !== selectedCategory.id));
            setSelectedCategory(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className="sub-container">
                <h2>Add category</h2>
                <div className='form-container'>
                    <label htmlFor='searchFilter'>Name:</label>
                    <input name="searchFilter" type='text'></input>
                </div>
                <button>Add</button>
            </div>
            <div className="sub-container">
                <h2>Edit categories</h2>
                <button disabled={selectedCategory === null} onClick={() => deleteCategory()}>Delete selected</button>
                <div className="category-list">
                    {categoriesList.map(category => (
                        <div key={category.id}
                            onClick={() => setSelectedCategory(category)}>
                            <WordDisplay isSelected={category.id === selectedCategory?.id}>
                                {category.category_name}
                            </WordDisplay>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default CategoryCreation;