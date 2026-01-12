import FrenchExpressionCreation from './components/French/FrenchExpressionCreation';
import FrenchExpressionsList from './components/French/FrenchExpressionsList';
import { useState } from 'react';
import type { FrenchWithTranslations } from './models/FrenchWithTranslations';
import EditionBar from './components/EditionBar';
import ArabicExpressionCreation from './components/Arabic/ArabicExpressionCreation';
import ArabicExpressionsList from './components/Arabic/ArabicExpressionsList';
import type { ArabicWithTranslations } from './models/ArabicWithTranslations';
import CategoryCreation from './components/CategoryCreation';

function App() {
    const [isEditMode, setEditMode] = useState(false);
    const [currentMode, setCurrentMode] = useState<number>(0);
    const [selectedFrenchItem, setSelectedFrenchItem] = useState<FrenchWithTranslations | null>(null);
    const [selectedArabicItem, setSelectedArabicItem] = useState<ArabicWithTranslations | null>(null);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const updateSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    function getToggleButtonClassName(button: number) {
        return button == currentMode ? "toggle-language-button toggle-language-button-selected" : "toggle-language-button";
    }

    function toggleMode(mode: number) {
        setSelectedFrenchItem(null);
        setSelectedArabicItem(null);
        setCurrentMode(mode);
    }

    function getModeRender() {
        switch (currentMode) {
            case 0:
                return (
                    <>
                        {isEditMode
                            ? <FrenchExpressionCreation
                                selectedWord={selectedFrenchItem}
                                showTranslationsMenu={true}
                                linkedArabicExpressionId={null}
                                returnCallBack={returnCallback} />
                            : <FrenchExpressionsList
                                selectedItem={selectedFrenchItem}
                                setSelectedItem={setSelectedFrenchItem}
                                editCallback={editCallBack}
                                filter={searchFilter} />}
                    </>)
            case 1:
                return (
                    <>
                        {isEditMode
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
                    </>
                )
            case 2:
                return (
                    <>
                        <CategoryCreation />
                    </>
                );
            default:
                return (<></>);
        }
    }

    return (
        <div className='main-container'>
            {!isEditMode
                ? <>
                    <div className='toggle-language-container'>
                        <div className={getToggleButtonClassName(0)} onClick={() => toggleMode(0)}>French</div>
                        <div className={getToggleButtonClassName(1)} onClick={() => toggleMode(1)}>Arabic</div>
                        <div className={getToggleButtonClassName(2)} onClick={() => toggleMode(2)}>Categories</div>
                    </div>
                    {currentMode != 2 && <div className='form-container'>
                        <label htmlFor='searchFilter'>Search:</label>
                        <input name="searchFilter" type='text' onChange={updateSearchFilter}></input>
                    </div>}
                </>
                : <></>}
            <EditionBar isEditMode={isEditMode} addCallback={addCallback} returnCallBack={returnCallback} />
            {getModeRender()}
        </div>
    )
}

export default App
