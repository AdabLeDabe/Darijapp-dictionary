import { useEffect, useRef, useState } from 'react';
import '../App.css'
import type { Arabic } from '../models/Arabic';
import FrenchTranslations from './FrenchTranslations';

interface ArabicExpressionCreationProps {
  selectedWord: Arabic | null,
  linkedFrenchExpressionId: number | null,
  showTranslationsMenu: boolean
}

const variantOptions = [
  { label: 'Common', value: 0 },
  { label: 'Moroccan', value: 1 },
  { label: 'Algerian', value: 2 },
  { label: 'Tunisian', value: 3 }
];

function ArabicExpressionCreation({ selectedWord, linkedFrenchExpressionId, showTranslationsMenu }: ArabicExpressionCreationProps) {
  const [createdWord, setCreatedWord] = useState<Arabic | null>(selectedWord);
  const formData = useRef({
    expression_arabic: '',
    expression_phonetic: '',
    variant: 0
  });

  useEffect(() => {
      if (selectedWord != null) {
        formData.current.expression_arabic = selectedWord.expression_arabic;
        formData.current.expression_phonetic = selectedWord.expression_phonetic;
        formData.current.variant = selectedWord.variant;
      }
    }, []);

  const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
    formData.current = {
      ...formData.current,
      [e.target.name]: e.target.value
    }
  };

  const updateFormDataVariant = (e: React.ChangeEvent<HTMLSelectElement>) => {
    formData.current = {
      ...formData.current,
      [e.target.name]: Number(e.target.value)
    }
  };

  const addWord = async () => {
    try {
      const response = await fetch('/api/expressions/arabic', {
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
      if (linkedFrenchExpressionId != null && result != null)
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
          french_id: linkedFrenchExpressionId,
          arabic_id: newlyCreatedId
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
      const response = await fetch('/api/expressions/arabic/' + createdWord?.id, {
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
    if (createdWord == null) {
      await addWord();
    }
    else
      await updateWord();
  }

  return (
    <div>
      <label>
        Expression arabic:
        <input type="text" name="expression_arabic" onChange={updateFormData} defaultValue={createdWord?.expression_arabic}></input>
      </label>
      <br /><br />
      <label>
        Expression phonetic:
        <input type="text" name="expression_phonetic" onChange={updateFormData} defaultValue={createdWord?.expression_phonetic}></input>
      </label>
      <br /><br />
      <label>
        Variant:
        <select name="variant" onChange={updateFormDataVariant} defaultValue={createdWord?.variant ?? 0}>
          {variantOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <br /><br />
      <button onClick={saveFormData}>Save</button>
      {showTranslationsMenu && (
        <FrenchTranslations arabicId={createdWord?.id ?? null} />
      )}
    </div>
  );
}

export default ArabicExpressionCreation