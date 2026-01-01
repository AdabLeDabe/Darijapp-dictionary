function removeAccents(str: string): string {
    let noAccentString = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return noAccentString;
}

function filterStringsFlexibleSchwa(item: string, filter: string): boolean {
        const sanitizedFilter = removeAccents(filter);
        const sanitizedItem = item.toLowerCase().replace(/ɛ/g, "3");
        const normKeywordE = removeAccents(sanitizedItem.replace(/ə/g, "e"));
        const normKeywordA = removeAccents(sanitizedItem.replace(/ə/g, "a"));
        return normKeywordE.includes(sanitizedFilter) || normKeywordA.includes(sanitizedFilter);
    }

export { removeAccents, filterStringsFlexibleSchwa };