import { useEffect, useRef, useState } from 'react';
import '../App.css'
import type { French } from '../models/French';
import ArabicTranslations from './ArabicTranslations';

interface FrenchExpressionCreationProps {
  selectedWord: French | null,
  linkedArabicExpressionId: number | null,
  showTranslationsMenu: boolean
}

function FrenchExpressionCreation({ selectedWord, showTranslationsMenu, linkedArabicExpressionId }: FrenchExpressionCreationProps) {
  const [createdWord, setCreatedWord] = useState<French | null>(selectedWord);
  const formData = useRef({
    expression: '',
    detail: ''
  });

  useEffect(() => {
    if (selectedWord != null) {
      formData.current.expression = selectedWord.expression;
      formData.current.detail = selectedWord.detail;
    }
  }, []);

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    formData.current = {
      ...formData.current,
      [e.target.name]: e.target.value
    }
  };

  const addWord = async () => {
    try {
      const response = await fetch('/api/expressions/french', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.current)
      });

      if (!response.ok)
        throw new Error('Failed to create word');

      const result = await response.json();
      setCreatedWord(result);
      if (linkedArabicExpressionId != null && result != null)
        await addTranslation(result.id);
      console.log('Success: ', result);
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const addTranslation = async (newlyCreatedId: number) => {
    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          french_id: newlyCreatedId,
          arabic_id: linkedArabicExpressionId
        })
      });

      if (!response.ok)
        throw new Error('Failed to add translation');

      const result = await response.json();
      console.log('Success: ', result);
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const updateWord = async () => {
    try {
      const response = await fetch('/api/expressions/french/' + createdWord?.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.current)
      });

      if (!response.ok)
        throw new Error('Failed to update word');

      const result = await response.json();
      setCreatedWord(result);
      console.log('Success: ', result);
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const saveFormData = async () => {
    if (createdWord == null)
      addWord();
    else
      updateWord();
  }

  return (
    <div>
      <label>
        Expression:
        <input type="text" name="expression" onChange={updateFormData} defaultValue={createdWord?.expression}></input>
      </label>
      <br /><br />
      <label>
        Detail:
        <input type="text" name="detail" onChange={updateFormData} defaultValue={createdWord?.detail}></input>
      </label>
      <br /><br />
      <button onClick={saveFormData}>Save</button>
      {showTranslationsMenu && (
        <ArabicTranslations frenchId={createdWord?.id ?? null} />
      )}
    </div>
  );
}

export default FrenchExpressionCreation