import { useEffect, useState } from "react";
import type { Arabic } from "../../models/Arabic";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import ArabicExpressionCreation from "./ArabicExpressionCreation";
import '../../App.css'
import '../../Modal.css'
import ArabicWord from "./ArabicWord";
import ArabicExpressionSearch from "./ArabicExpressionSearch";
import WordDisplay from "../WordDisplay";

interface ArabicTranslationsProps {
    frenchId: number | null
}

function ArabicTranslations({ frenchId }: ArabicTranslationsProps) {
    const [arabicExpressions, setArabicExpressions] = useState<Arabic[]>([]);
    const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
    const [isSearchTranslationModalOpen, setIsSearchTranslationModalOpen] = useState(false);
    const [selectedTranslation, setSelectedTranslation] = useState<Arabic | null>(null);

    useEffect(() => {
        if (frenchId == null)
            return;
        const fetchData = async () => {
            try {
                const response = await fetch('api/translations/search/from_french/' + frenchId);

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const result = await response.json();
                setArabicExpressions(result)
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [frenchId, isTranslationModalOpen, isSearchTranslationModalOpen])

    const openModalToAddTranslation = () => {
        setSelectedTranslation(null);
        setIsTranslationModalOpen(true);
    };

    const openModalToSearchTranslation = () => {
        setSelectedTranslation(null);
        setIsSearchTranslationModalOpen(true);
    }

    const deleteTranslation = async () => {
        try {
            const response = await fetch('api/translations', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    french_id: frenchId,
                    arabic_id: selectedTranslation?.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to delete translation');
            }

            setSelectedTranslation(null);
            setArabicExpressions(arabicExpressions.filter(function (arabicExpression) {
                return arabicExpression.id !== selectedTranslation?.id;
            }));

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="sub-container">
            <h2>Translations</h2>
            <div className="translation-list">
                {arabicExpressions.map(arabicWord => (
                    <div
                        key={arabicWord.id}
                        onClick={() => setSelectedTranslation(arabicWord)} >
                        <WordDisplay isSelected={selectedTranslation?.id === arabicWord.id}>
                            <ArabicWord word={arabicWord} />
                        </WordDisplay>

                    </div>
                ))}
            </div>
            <button disabled={frenchId == null} onClick={() => openModalToAddTranslation()}>Add translation</button>
            <button disabled={frenchId == null} onClick={() => openModalToSearchTranslation()}>Add existing translation</button>
            <button disabled={frenchId == null || selectedTranslation == null} onClick={() => setIsTranslationModalOpen(true)}>Modify translation</button>
            <button disabled={frenchId == null || selectedTranslation == null} onClick={() => deleteTranslation()}>Delete translation</button>

            <Dialog open={isTranslationModalOpen} onClose={() => setIsTranslationModalOpen(false)}>
                <div className="modal-backdrop">
                    <DialogPanel className="modal-content">
                        <DialogTitle>Add translation</DialogTitle>
                        <ArabicExpressionCreation
                            selectedWord={selectedTranslation ?? null}
                            linkedFrenchExpressionId={frenchId}
                            showTranslationsMenu={false}
                            returnCallBack={() => setIsTranslationModalOpen(false)} />
                    </DialogPanel>
                </div>
            </Dialog>
            <Dialog open={isSearchTranslationModalOpen} onClose={() => setIsSearchTranslationModalOpen(false)}>
                <div className="modal-backdrop">
                    <DialogPanel className="modal-content search-modal-content">
                        <DialogTitle>Add existing translation</DialogTitle>
                        <ArabicExpressionSearch
                            existingTranslations={arabicExpressions}
                            linkedFrenchExpressionId={frenchId}
                            returnCallBack={() => setIsSearchTranslationModalOpen(false)} />
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}

export default ArabicTranslations;