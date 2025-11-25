import { useEffect, useState } from "react";
import type { Arabic } from "../models/Arabic";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import ArabicExpressionCreation from "./ArabicExpressionCreation";
import '../App.css'
import '../Modal.css'

interface ArabicTranslationsProps {
  frenchId: number | null
}

function ArabicTranslations({ frenchId }: ArabicTranslationsProps) {
  const [arabicExpressions, setArabicExpressions] = useState<Arabic[]>([]);
  const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
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
  }, [frenchId, isTranslationModalOpen])

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
          french_id: frenchId,
          arabic_id: selectedTranslation?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete translation');
      }

      setSelectedTranslation(null);
      setArabicExpressions(arabicExpressions.filter(function(arabicExpression) {
        return arabicExpression.id !== selectedTranslation?.id;
      }))
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="selectable-list">
        {arabicExpressions.map(expression => (
          <div
            key={expression.id}
            onClick={() => setSelectedTranslation(expression)}
            className={selectedTranslation?.id === expression.id ? 'selected' : ''}
          >
            {expression.expression_arabic} / {expression.expression_phonetic}
          </div>
        ))}
      </div>
      <button disabled={frenchId == null} onClick={() => openModalToAddTranslation()}>Add a translation</button>
      <button disabled={frenchId == null || selectedTranslation == null} onClick={() => setIsTranslationModalOpen(true)}>Modify translation</button>
      <button disabled={frenchId == null || selectedTranslation == null} onClick={() => deleteTranslation()}>Delete translation</button>

      <Dialog open={isTranslationModalOpen} onClose={() => setIsTranslationModalOpen(false)}>
        <div className="modal-backdrop">
          <DialogPanel className="modal-content">
            <DialogTitle>Add a translation</DialogTitle>
            <ArabicExpressionCreation selectedWord={selectedTranslation ?? null} linkedFrenchExpressionId={frenchId} showTranslationsMenu={false} />
            <button onClick={() => setIsTranslationModalOpen(false)}>Close</button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default ArabicTranslations;