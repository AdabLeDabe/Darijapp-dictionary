import { GetVariantDisplay } from "../../helpers/ArabicDisplay";
import type { Arabic } from "../../models/Arabic";

interface ArabicWordProps {
    word: Arabic,
    isSelected: boolean
}

function ArabicWord({word: arabicWord, isSelected} : ArabicWordProps) {
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
            {arabicWord.expression_arabic} / {arabicWord.expression_phonetic} {GetVariantDisplay(arabicWord.variant)}
        </div>
    );
}

export default ArabicWord;