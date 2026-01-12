import { useState, useEffect } from "react";
import type { Category } from "../../models/Category";
import WordDisplay from "../WordDisplay";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import FrenchCategoriesEdition from "./FrenchCategoriesEdition";

interface FrenchCategoriesListProps {
    frenchId: number | null
}

function FrenchCategoriesList({ frenchId: frenchId }: FrenchCategoriesListProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoryEditionModalOpen, setIsCategoryEditionModalOpen] = useState<boolean>(false);

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
    }, [frenchId, isCategoryEditionModalOpen]);

    return (
        <div className="sub-container">
            <h2>Categories</h2>
            <div className="category-list">
                {categories.map(category => (
                    <div
                        key={category.id} >
                        <WordDisplay isSelected={false}>
                            {category.category_name}
                        </WordDisplay>
                    </div>
                ))}
            </div>
            <button disabled={frenchId == null} onClick={() => setIsCategoryEditionModalOpen(true)}>Edit categories</button>

            <Dialog open={isCategoryEditionModalOpen} onClose={() => setIsCategoryEditionModalOpen(false)}>
                <div className="modal-backdrop">
                    <DialogPanel className="modal-content">
                        <DialogTitle>Edit categories</DialogTitle>
                        <FrenchCategoriesEdition frenchId={frenchId} currentlySelectedCategories={categories} returnCallBack={() => setIsCategoryEditionModalOpen(false)} />
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}

export default FrenchCategoriesList;