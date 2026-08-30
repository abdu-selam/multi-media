import fs from "node:fs/promises";

export const isPathExist = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
