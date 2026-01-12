import { useEffect, useRef, useState } from 'react';
import '../../App.css'
import type { Arabic } from '../../models/Arabic';
import FrenchTranslations from '../French/FrenchTranslations';
import { GetVariantDisplay } from '../../helpers/ArabicDisplay';

interface ArabicExpressionCreationProps {
    selectedWord: Arabic | null,
    linkedFrenchExpressionId: number | null,
    showTranslationsMenu: boolean,
    returnCallBack: () => void
}

const variantOptions = [
    { label: 'Common', value: 0 },
    { label: 'Moroccan', value: 1 },
    { label: 'Algerian', value: 2 },
    { label: 'Tunisian', value: 3 }
];

function ArabicExpressionCreation({ selectedWord, linkedFrenchExpressionId, showTranslationsMenu, returnCallBack }: ArabicExpressionCreationProps) {
    const [createdWord, setCreatedWord] = useState<Arabic | null>(selectedWord);
    const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
    var isDirty = false;
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
        isDirty = true;
        setIsSaveDisabled(!formData.current.expression_arabic || formData.current.expression_arabic.trim() === ""
            || !formData.current.expression_phonetic || formData.current.expression_phonetic.trim() === "" || !isDirty);
    };

    const updateFormDataVariant = (e: React.ChangeEvent<HTMLSelectElement>) => {
        formData.current = {
            ...formData.current,
            [e.target.name]: Number(e.target.value)
        }
        isDirty = true;
        setIsSaveDisabled(!formData.current.expression_arabic || formData.current.expression_arabic.trim() === ""
            || !formData.current.expression_phonetic || formData.current.expression_phonetic.trim() === "" || !isDirty);
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
        if (createdWord == null)
            await addWord();
        else
            await updateWord();
    }

    const saveAndReturn = async () => {
        await saveFormData();
        returnCallBack();
    }

    return (
        <div>
            <div className='form-container'>
                <label htmlFor="expression_phonetic">Expression phonetic:</label>
                <input type="text" name="expression_phonetic" onChange={updateFormData} defaultValue={selectedWord?.expression_phonetic}></input>
                <label htmlFor="expression_arabic">Expression arabic:</label>
                <input type="text" name="expression_arabic" onChange={updateFormData} defaultValue={selectedWord?.expression_arabic}></input>
                <label htmlFor='variant'>Variant:</label>
                <select name="variant" onChange={updateFormDataVariant} defaultValue={createdWord?.variant ?? 0}>
                    {variantOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label} {GetVariantDisplay(option.value)}
                        </option>
                    ))}
                </select>
            </div>
            {showTranslationsMenu && (
                <FrenchTranslations arabicId={createdWord?.id ?? null} />
            )}
            <button disabled={isSaveDisabled} onClick={saveAndReturn}>Save & return</button>
            <button disabled={isSaveDisabled} onClick={saveFormData}>Save</button>
        </div>
    );
}

export default ArabicExpressionCreation