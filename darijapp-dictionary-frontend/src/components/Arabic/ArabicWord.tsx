import { GetVariantDisplay } from "../../helpers/ArabicDisplay";
import type { Arabic } from "../../models/Arabic";

interface ArabicWordProps {
    word: Arabic,
}

function ArabicWord({ word: arabicWord }: ArabicWordProps) {
    return (
        <>
            {arabicWord.expression_arabic} / {arabicWord.expression_phonetic} {GetVariantDisplay(arabicWord.variant)}
        </>
    );
}

export default ArabicWord;