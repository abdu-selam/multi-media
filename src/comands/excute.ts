import { runTerminal } from "../utils/terminalHelper.js";
import { isComandExist, isVideo } from "./checking.js";

export const metaDataCommand = async (
  path: string,
): Promise<object | never> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    throw new Error("Not Video");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    throw new Error("Not Video");
  }

  const { stdout } = await runTerminal("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    path,
  ]);

  const metadata = JSON.parse(stdout);

  return {
    ...metadata,
  };
};

export const formatDataCommand = async (
  path: string,
): Promise<object | never> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    throw new Error("Not Video");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    throw new Error("Not Video");
  }

  const { stdout } = await runTerminal("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    path,
  ]);

  const metadata = JSON.parse(stdout);

  return {
    ...metadata,
  };
};

export const streamDataCommand = async (
  path: string,
): Promise<object | never> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    throw new Error("Not Video");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    throw new Error("Not Video");
  }

  const { stdout } = await runTerminal("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_streams",
    path,
  ]);

  const metadata = JSON.parse(stdout);

  return {
    ...metadata,
  };
};
