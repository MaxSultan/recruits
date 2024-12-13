export const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const capitalizeFirstLetter = (word) =>
  `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

export const pascalToSnakeCase = (str) =>
  str
    .split("_")
    .map((val, idx) => (idx === 0 ? val : capitalizeFirstLetter(val)))
    .join("");

const transformKeys = (fn) => (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [fn(key), value])
  );

export const snakeCaseKeys = transformKeys(camelToSnakeCase);

export const pascalCaseKeys = transformKeys(pascalToSnakeCase);
