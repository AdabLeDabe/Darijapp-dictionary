import { useEffect, useState } from "react";
import type { Category } from "../models/Category";
import WordDisplay from "./WordDisplay";

function CategoryCreation() {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [createdCategoryName, setCreatedCategoryName] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const updateCategoryName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreatedCategoryName(e.target.value);
    };

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
                throw new Error('Failed to delete category');
            }

            setCategoriesList(categoriesList.filter(c => c.id !== selectedCategory.id));
            setSelectedCategory(null);
        } catch (err) {
            console.log(err);
        }
    };

    const addCategory = async () => {
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category_name: createdCategoryName
                })
            });

            if (!response.ok)
                throw new Error('Failed to create category');

            const result = await response.json();
            console.log('Success: ', result);

            await fetchData();
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    return (
        <>
            <div className="sub-container">
                <h2>Add category</h2>
                <div className='form-container'>
                    <label htmlFor='searchFilter'>Name:</label>
                    <input name="searchFilter" type='text' onChange={updateCategoryName}></input>
                </div>
                <button onClick={() => addCategory()}>Add</button>
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