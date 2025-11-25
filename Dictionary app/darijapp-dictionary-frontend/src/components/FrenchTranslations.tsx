import { useEffect, useState } from "react";
import type { French } from "../models/French";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import FrenchExpressionCreation from "./FrenchExpressionCreation";
import '../App.css'
import '../Modal.css'

interface FrenchTranslationsProps {
  arabicId: number | null
}

function FrenchTranslations({ arabicId: arabicId }: FrenchTranslationsProps) {
  const [frenchExpressions, setFrenchExpressions] = useState<French[]>([]);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState<French | null>(null);

  useEffect(() => {
    if (arabicId == null)
      return;
    const fetchData = async () => {
      try {
        const response = await fetch('api/translations/search/from_arabic/' + arabicId);

        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        const result = await response.json();
        setFrenchExpressions(result)
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [arabicId, isTranslationModalOpen])

  const openModalToAddTranslation = () => {
    setSelectedTranslation(null);
    setIsTranslationModalOpen(true);
  };

  const deleteTranslation = async () => {
    try {
      const response = await fetch('api/translations', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          french_id: selectedTranslation?.id,
          arabic_id: arabicId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete translation');
      }
      
      setSelectedTranslation(null);
      setFrenchExpressions(frenchExpressions.filter(function(frenchExpression) {
        return frenchExpression.id !== selectedTranslation?.id;
      }))
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="selectable-list">
        {frenchExpressions.map(expression => (
          <div
            key={expression.id}
            onClick={() => setSelectedTranslation(expression)}
            className={selectedTranslation?.id === expression.id ? 'selected' : ''}
          >
            {expression.expression}
          </div>
        ))}
      </div>
      <button disabled={arabicId == null} onClick={() => openModalToAddTranslation()}>Add a translation</button>
      <button disabled={arabicId == null || selectedTranslation == null} onClick={() => setIsTranslationModalOpen(true)}>Modify translation</button>
      <button disabled={arabicId == null || selectedTranslation == null} onClick={() => deleteTranslation()}>Delete translation</button>

      <Dialog open={isTranslationModalOpen} onClose={() => setIsTranslationModalOpen(false)}>
        <div className="modal-backdrop">
          <DialogPanel className="modal-content">
            <DialogTitle>Add a translation</DialogTitle>
            <FrenchExpressionCreation selectedWord={selectedTranslation ?? null} linkedArabicExpressionId={arabicId} showTranslationsMenu={false} />
            <button onClick={() => setIsTranslationModalOpen(false)}>Close</button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default FrenchTranslations;