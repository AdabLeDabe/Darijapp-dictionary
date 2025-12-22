import { useEffect, useRef, useState } from 'react';
import '../App.css'
import type { French } from '../models/French';
import ArabicTranslations from './ArabicTranslations';

interface FrenchExpressionCreationProps {
    selectedWord: French | null,
    linkedArabicExpressionId: number | null,
    showTranslationsMenu: boolean,
    returnCallBack: () => void
}

function FrenchExpressionCreation({ selectedWord, showTranslationsMenu, linkedArabicExpressionId, returnCallBack }: FrenchExpressionCreationProps) {
    const [createdWord, setCreatedWord] = useState<French | null>(selectedWord);
    //const [isDirty, setIsDirty] = useState<boolean>(false);
    const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);
    var isDirty = false;
    const formData = useRef({
        expression: selectedWord != null ? selectedWord.expression : '',
        detail: selectedWord != null ? selectedWord.detail : ''
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
        isDirty = true;
        setIsSaveDisabled(!formData.current.expression || formData.current.expression.trim() === "" || !isDirty);
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
            <label>
                Expression:
                <input type="text" name="expression" onChange={updateFormData} defaultValue={selectedWord?.expression}></input>
            </label>
            <br /><br />
            <label>
                Detail:
                <input type="text" name="detail" onChange={updateFormData} defaultValue={selectedWord?.detail}></input>
            </label>
            <br /><br />
            <button disabled={isSaveDisabled} onClick={saveAndReturn}>Save & return</button>
            <button disabled={isSaveDisabled} onClick={saveFormData}>Save</button>
            {showTranslationsMenu && (
                <ArabicTranslations frenchId={createdWord?.id ?? null} />
            )}
        </div>
    );
}

export default FrenchExpressionCreation