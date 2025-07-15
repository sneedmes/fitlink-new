const prefix = "myProject_";

export const setItem = (key: string, value: any) => {
    localStorage.setItem(`${prefix}${key}`, JSON.stringify(value));
};

export const getItem = (key: string) => {
    const item = localStorage.getItem(`${prefix}${key}`);
    return item ? JSON.parse(item) : null;
};

export const removeItem = (key: string) => {
    localStorage.removeItem(`${prefix}${key}`);
};
