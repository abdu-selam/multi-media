import fs from "node:fs/promises";

export const isPathExist = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

export const isFile = async (path: string): Promise<boolean> => {
  const isExist = await isPathExist(path);
  if (!isExist) return false;

  const stat = await fs.stat(path);

  return stat.isFile();
};
