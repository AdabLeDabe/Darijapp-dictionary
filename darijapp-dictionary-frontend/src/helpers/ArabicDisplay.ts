export function GetVariantDisplay(variant: Number) {
    switch (variant) {
        case 1: {
            return "🇲🇦";
        }
        case 2: {
            return "🇩🇿";
        }
        case 3: {
            return "🇹🇳";
        }
        default: {
            return "";
        }
    }
}