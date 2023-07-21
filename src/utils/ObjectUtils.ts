export function isEqualIgnoreNull(a?: string, b?: string): boolean {
    if (a == null || b == null) return false;
    return a == b;
}
