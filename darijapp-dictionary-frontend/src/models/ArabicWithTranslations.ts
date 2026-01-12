import type { French } from "./French";

export interface ArabicWithTranslations {
    id: number;
    expression_arabic: string;
    expression_phonetic: string;
    variant: number;
    translations: French[];
}