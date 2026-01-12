import type { French } from "../../models/French";

interface FrenchWordProps {
    word: French
}

function FrenchWord({ word: frenchWord }: FrenchWordProps) {
    return (
        <>
            {frenchWord.expression} {frenchWord.detail && frenchWord.detail.trim() !== "" && <i> - {frenchWord.detail}</i>}
        </>
    );
}

export default FrenchWord;