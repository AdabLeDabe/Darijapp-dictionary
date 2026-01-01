import type { French } from "../../models/French";

interface FrenchWordProps {
    word: French,
    isSelected: boolean
}

function FrenchWord({word: frenchWord, isSelected} : FrenchWordProps) {
    const getClassName = () => {
        if (isSelected) {
            return "word word-selected";
        }
        else {
            return "word"
        }
    }

    return (
        <div className={getClassName()}>
            {frenchWord.expression} {frenchWord.detail && frenchWord.detail.trim() !== "" && <i> - {frenchWord.detail}</i>}
        </div>
    );
}

export default FrenchWord;