import FrenchExpressionCreation from './components/FrenchExpressionCreation';
import FrenchExpressionsList from './components/FrenchExpressionsList';
import { useState } from 'react';
import type { FrenchWithTranslations } from './models/FrenchWithTranslations';
import EditionBar from './components/EditionBar';

function App() {
    const [isEditMode, setEditMode] = useState(false);
    const [selectedFrenchItem, setSelectedFrenchItem] = useState<FrenchWithTranslations | null>(null);
    return (
        <div className='main-container'>
            <EditionBar hasSelectedItem={selectedFrenchItem != null}/>
            {isEditMode
                ? <FrenchExpressionCreation selectedWord={selectedFrenchItem} showTranslationsMenu={true} linkedArabicExpressionId={null} />
                : <FrenchExpressionsList selectedItem={selectedFrenchItem} setSelectedItem={setSelectedFrenchItem} setEditMode={setEditMode} />}
        </div>
    )
}

export default App
