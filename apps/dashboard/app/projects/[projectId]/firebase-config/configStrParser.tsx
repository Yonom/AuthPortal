"use client";
const orderFields = <T extends Record<string, unknown>>(
  obj: T,
  fieldOrder: (keyof T)[],
) => {
  const newObj = {} as T;
  for (const field of fieldOrder) {
    if (field in obj) {
      newObj[field] = obj[field];
    }
  }
  for (const field of Object.keys(obj).filter((k) => !fieldOrder.includes(k))) {
    (newObj[field] as any) = obj[field];
  }
  return newObj;
};
export const configStrToConfig = (configStr: string) => {
  if (configStr === "") return {};

  const regex = /firebaseConfig\s*=\s*(?<config>{(?:.|\s)+})/;
  const configJs = regex.exec(configStr)?.groups?.config;
  if (!configJs) throw new Error("Invalid config input");
  const jsToJsonRegex = /(?<=^\s*)([a-zA-Z]+)(?=:)/gm;
  const configJson = configJs?.replace(jsToJsonRegex, '"$1"');
  return JSON.parse(configJson);
};
export const configToConfigStr = (config: Record<string, string>) => {
  if (!Object.keys(config).length) {
    return "";
  }

  const configSorted = orderFields(config, [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ]);
  const configJson = JSON.stringify(configSorted, null, 2);

  const jsonToJsRegex = /(?<=^\s*)"([a-zA-Z]+)"(?=:)/gm;
  const configObjStr = configJson.replace(jsonToJsRegex, "$1");

  return `const firebaseConfig = ${configObjStr}`;
};
