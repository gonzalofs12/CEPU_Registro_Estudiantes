export const toUpperCase = (text: string | null | undefined): string => {
   if (!text) return '';
   return text.toUpperCase();
};

export const transformObjectToUpperCase = <T extends Record<string, any>>(obj: T): T => {
   const transformed = { ...obj };

   for (const key in transformed) {
      if (typeof transformed[key] === 'string') {
         transformed[key] = toUpperCase(transformed[key]) as T[Extract<keyof T, string>];
      }
   }
   return transformed;
};