function removeAccents(str: string): string {
    let noAccentString = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return noAccentString;
}

export { removeAccents };