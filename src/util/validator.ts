export const isValidId = (id: number): boolean => {
    return !!(id && typeof id === 'number' && Number.isInteger(id) && id > 0);
};

export const isValidStrings = (...strs: string[]): boolean => {
    return (strs.filter(str => !str || typeof str !== 'string').length == 0);
};

export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
    return obj && Object.keys(obj).every(key => {
        if (nullableProps.includes(key)) return true;
        return obj[key];
    });
};

export const isPropertyOf = (prop: string, type: any) => {

    if (!prop || !type) {
        return false;
    }

    let typeCreator = <T>(Type: (new () => T)): T => {
        return new Type();
    } 

    let tempInstance: any;
    try {
        tempInstance = typeCreator(type);
    } catch {
        return false;
    }
    
    return Object.keys(tempInstance).includes(prop);

}

export const isValidStatus = (status: string) => {
    return status && status == "pending" || status == "approved" || status == "denied";
}

export function isEmptyObject<T>(obj: T) {
    return obj && Object.keys(obj).length === 0;
}


export default {
    isValidId,
    isValidStrings,
    isValidObject,
    isPropertyOf,
    isValidStatus,
    isEmptyObject
}