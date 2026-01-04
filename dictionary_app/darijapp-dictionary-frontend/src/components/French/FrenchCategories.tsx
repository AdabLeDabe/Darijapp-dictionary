import { useState, useEffect } from "react";
import type { Category } from "../../models/Category";
import WordDisplay from "../WordDisplay";

interface FrenchCategoriesProps {
    frenchId: Number | null
}

function FrenchCategories({ frenchId: frenchId }: FrenchCategoriesProps) {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (frenchId == null)
            return;
        const fetchData = async () => {
            try {
                const response = await fetch('api/expressions/french/' + frenchId + '/categories');

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const result = await response.json();
                setCategories(result);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [frenchId]);

    return (
        <div className="sub-container">
            <h2>Categories</h2>
            <div className="category-list">
                {categories.map(category => (
                    <div
                        key={category.id}>
                        <WordDisplay isSelected={false}>
                            {category.category_name}
                        </WordDisplay>
                    </div>
                ))}
            </div>
            <button disabled={true}>Add category</button>
            <button disabled={true}>Modify category</button>
            <button disabled={true}>Delete category</button>
        </div>
    );
}

export default FrenchCategories;