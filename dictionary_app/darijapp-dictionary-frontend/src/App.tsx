import FrenchExpressionCreation from './components/FrenchExpressionCreation';
import FrenchExpressionsList from './components/FrenchExpressionsList';
import { useState } from 'react';
import type { FrenchWithTranslations } from './models/FrenchWithTranslations';
import EditionBar from './components/EditionBar';
import ArabicExpressionCreation from './components/ArabicExpressionCreation';
import ArabicExpressionsList from './components/ArabicExpressionsList';
import type { ArabicWithTranslations } from './models/ArabicWithTranslations';

function App() {
    const [isEditMode, setEditMode] = useState(false);
    const [isInFrenchMode, setFrenchMode] = useState(true);
    const [selectedFrenchItem, setSelectedFrenchItem] = useState<FrenchWithTranslations | null>(null);
    const [selectedArabicItem, setSelectedArabicItem] = useState<ArabicWithTranslations | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(e.target.value);
    };

    function addCallback() {
        setSelectedFrenchItem(null);
        setSelectedArabicItem(null);
        setEditMode(true);
    }

    function editCallBack() {
        setEditMode(true);
    }

    function returnCallback() {
        setEditMode(false);
    }

    function getFrenchToggleClassName() {
        return isInFrenchMode ? "toggle-language-button toggle-language-button-selected" : "toggle-language-button";
    }

    function getArabicToggleClassName() {
        return !isInFrenchMode ? "toggle-language-button toggle-language-button-selected" : "toggle-language-button";
    }

    function toggleLanguage() {
        setSelectedFrenchItem(null);
        setSelectedArabicItem(null);
        setFrenchMode(!isInFrenchMode);
    }

    return (
        <div className='main-container'>
            <div className='toggle-language-container' onClick={toggleLanguage}>
                <div className={getFrenchToggleClassName()}>French</div>
                <div className={getArabicToggleClassName()}>Arabic</div>
            </div>
            <div className='form-container'>
                <label htmlFor='searchFilter'>Search:</label>
                <input name="searchFilter" type='text' onChange={updateFormData}></input>
            </div>
            <EditionBar isEditMode={isEditMode} addCallback={addCallback} returnCallBack={returnCallback} />
            {isInFrenchMode
                ? isEditMode
                    ? <FrenchExpressionCreation
                        selectedWord={selectedFrenchItem}
                        showTranslationsMenu={true}
                        linkedArabicExpressionId={null}
                        returnCallBack={returnCallback} />
                    : <FrenchExpressionsList
                        selectedItem={selectedFrenchItem}
                        setSelectedItem={setSelectedFrenchItem}
                        editCallback={editCallBack}
                        filter={searchFilter} />
                : isEditMode
                    ? <ArabicExpressionCreation
                        selectedWord={selectedArabicItem}
                        showTranslationsMenu={true}
                        linkedFrenchExpressionId={null}
                        returnCallBack={returnCallback} />
                    : <ArabicExpressionsList
                        selectedItem={selectedArabicItem}
                        setSelectedItem={setSelectedArabicItem}
                        editCallback={editCallBack}
                        filter={searchFilter} />}
        </div>
    )
}

export default App
