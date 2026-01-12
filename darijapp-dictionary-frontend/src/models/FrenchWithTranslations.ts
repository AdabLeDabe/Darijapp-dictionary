import type { Arabic } from "./Arabic";

export interface FrenchWithTranslations {
    id: number;
    expression: string;
    detail: string;
    translations: Arabic[];
}