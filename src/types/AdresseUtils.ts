export function countryCodeToName(countryCode: string) {
    // @ts-ignore
    const regionNames = new Intl.DisplayNames(["nb"], { type: "region" });
    return countryCode ? regionNames.of(countryCode) : " ";
}

export function isCountryCodeNorway(countryCode: string) {
    return countryCode === "NO" || countryCode === "NOR";
}
