import { isFile } from "../utils/fileHelper.js";
import { raiseError } from "../utils/helper.js";
import { runTerminal } from "../utils/terminalHelper.js";

export const isComandExist = async (
  tool: string,
  args: Array<string>,
): Promise<boolean> => {
  try {
    await runTerminal(tool, args);
    return true;
  } catch (error) {
    return false;
  }
};

export const isVideo = async (path: string): Promise<boolean> => {
  const isFileResult = await isFile(path);
  if (!isFileResult) return false;

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);

  if (!isFbroneExist) {
    raiseError("ffprone");
  }

  try {
    const { stdout } = await runTerminal("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=codec_type",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      path,
    ]);

    return stdout.trim() === "video";
  } catch (error) {
    return false;
  }
};
