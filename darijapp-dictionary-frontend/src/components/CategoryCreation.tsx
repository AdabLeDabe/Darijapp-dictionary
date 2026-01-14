import { useEffect, useState } from "react";
import type { Category } from "../models/Category";
import WordDisplay from "./WordDisplay";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

function CategoryCreation() {
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [createdCategoryName, setCreatedCategoryName] = useState<string>("");
    const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
    const [editedCategoryName, setEditedCategoryName] = useState<string>("");

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

    const updateCategory = async () => {
        try {
            const response = await fetch('/api/categories/' + selectedCategory?.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    category_name: editedCategoryName
                })
            });

            if (!response.ok)
                throw new Error('Failed to update category');

            const result = await response.json();
            console.log('Success: ', result);

            await fetchData();
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    const openEditCategoryModal = () => {
        if (selectedCategory === null) {
            return;
        }
        setEditedCategoryName(selectedCategory?.category_name);
        setIsEditingCategory(true);
    }

    const saveAndCloseModal = async () => {
        await updateCategory();
        setIsEditingCategory(false);
    }

    return (
        <>
            <div className="sub-container">
                <h2>Add category</h2>
                <div className='form-container'>
                    <label htmlFor='categoryName'>Name:</label>
                    <input name="categoryName" type='text' onChange={updateCategoryName}></input>
                </div>
                <button onClick={() => addCategory()}>Add</button>
            </div>
            <div className="sub-container">
                <h2>Edit categories</h2>
                <button disabled={selectedCategory === null} onClick={() => openEditCategoryModal()}>Edit selected</button>
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

            <Dialog open={isEditingCategory} onClose={() => setIsEditingCategory(false)}>
                <div className="modal-backdrop">
                    <DialogPanel className="modal-content search-modal-content">
                        <DialogTitle>Edit category</DialogTitle>
                        <div className="sub-container">
                            <div className='form-container'>
                                <label htmlFor='editCategoryName'>Name:</label>
                                <input name="editCategoryName" type='text' value={editedCategoryName} onChange={e => setEditedCategoryName(e.target.value)}></input>
                            </div>
                            <button onClick={async () => await saveAndCloseModal()}>Save and return</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}

export default CategoryCreation;