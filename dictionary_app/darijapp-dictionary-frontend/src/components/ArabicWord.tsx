import { GetVariantDisplay } from "../helpers/ArabicDisplay";
import type { Arabic } from "../models/Arabic";

interface ArabicWordProps {
    word: Arabic,
    isSelected: boolean
}

function ArabicWord({word: arabicWord, isSelected} : ArabicWordProps) {
    const getClassName = () => {
        if (isSelected) {
            return "arabic-word arabic-word-selected";
        }
        else {
            return "arabic-word"
        }
    }

    return (
        <div className={getClassName()}>
            {arabicWord.expression_arabic} / {arabicWord.expression_phonetic} {GetVariantDisplay(arabicWord.variant)}
        </div>
    );
}

export default ArabicWord;