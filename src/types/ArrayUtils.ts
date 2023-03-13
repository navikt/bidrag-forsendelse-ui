export function arraysDeepEqual(arr1: unknown[], arr2: unknown[]): boolean {
    if (arr1 === arr2) {
        return true;
    }

    if (arr1 == null || arr2 == null || arr1.length !== arr2.length) {
        return false;
    }

    // sort both arrays before comparing
    arr1.sort();
    arr2.sort();

    for (let i = 0; i < arr1.length; i++) {
        if (typeof arr1[i] === "object" && Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!arraysDeepEqual(arr1[i] as unknown[], arr2[i] as unknown[])) {
                return false;
            }
        } else if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}
