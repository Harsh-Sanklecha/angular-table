export function cloneDeep<T>(value: T): T {
    // Handle primitive values and functions
    if (value === null || typeof value !== "object") {
        return value;
    }

    // Handle Date
    if (value instanceof Date) {
        return new Date(value.getTime()) as T;
    }

    // Handle Array
    if (Array.isArray(value)) {
        return value.map(item => cloneDeep(item)) as T;
    }

    // Handle Map
    if (value instanceof Map) {
        const clonedMap = new Map();
        value.forEach((val, key) => {
            clonedMap.set(key, cloneDeep(val));
        });
        return clonedMap as T;
    }

    // Handle Set
    if (value instanceof Set) {
        const clonedSet = new Set();
        value.forEach(val => {
            clonedSet.add(cloneDeep(val));
        });
        return clonedSet as T;
    }

    // Handle Object
    const clonedObj: { [key: string]: unknown } = {};
    Object.keys(value).forEach(key => {
        clonedObj[key] = cloneDeep((value as { [key: string]: unknown })[key]);
    });

    return clonedObj as T;
}
