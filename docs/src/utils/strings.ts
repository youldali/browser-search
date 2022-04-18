export const uppercaseFirstLetter = (string: string) => (string).replace(/(^\w|\s\w)/g, m => m.toUpperCase());
