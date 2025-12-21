import FrenchExpressionCreation from './components/FrenchExpressionCreation';
import FrenchExpressionsList from './components/FrenchExpressionsList';
import { useState } from 'react';
import type { FrenchWithTranslations } from './models/FrenchWithTranslations';
import EditionBar from './components/EditionBar';

function App() {
    const [isEditMode, setEditMode] = useState(false);
    const [selectedFrenchItem, setSelectedFrenchItem] = useState<FrenchWithTranslations | null>(null);

    function addCallback() {
        setSelectedFrenchItem(null);
        setEditMode(true);
    }

    function editCallBack() {
        setEditMode(true);
    }

    function returnCallback() {
        setEditMode(false);
    }

    return (
        <div className='main-container'>
            <EditionBar isEditMode={isEditMode} addCallback={addCallback} returnCallBack={returnCallback} />
            {isEditMode
                ? <FrenchExpressionCreation
                    selectedWord={selectedFrenchItem}
                    showTranslationsMenu={true}
                    linkedArabicExpressionId={null}
                    returnCallBack={returnCallback} />
                : <FrenchExpressionsList selectedItem={selectedFrenchItem} setSelectedItem={setSelectedFrenchItem} editCallback={editCallBack} />}
        </div>
    )
}

export default App
