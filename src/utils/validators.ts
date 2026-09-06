export const isNumber = (input: any): boolean => {
  if (typeof input === "number") return true;

  const processing = Number(input);
  return !Number.isNaN(processing);
};
