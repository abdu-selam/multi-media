import { convertArgs } from "../data/mimeTypes.js";
import type { onProgres, VideoMimeTypes } from "../types/video.types.js";
import { formatedSize, formatedTime } from "../utils/helper.js";
import { colors, runConvertor, runTerminal } from "../utils/terminalHelper.js";
import { isComandExist, isVideo } from "./checking.js";
import fs from "node:fs/promises";

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

export const converssionCommand = async (
  input: string,
  output: string,
  mime: VideoMimeTypes,
  duration: number,
  size: number,
  input_mime: string,
  logs: boolean = false,
  onProgres?: onProgres,
): Promise<void> => {
  const isVideoResult = await isVideo(input);

  if (!isVideoResult) {
    throw new Error("Not Video");
  }

  const args: Array<string> = convertArgs(input, output, mime);

  const isFfmpegeExist = await isComandExist("ffmpeg", ["-version"]);
  if (!isFfmpegeExist) {
    throw new Error("Not Video");
  }

  await fs.mkdir(output, {
    recursive: true,
  });

  const startingLog =
    `${colors.green}multi-media proccessing video\n\n` +
    `${colors.gray}changing mime from ${colors.red}${input_mime} to ${colors.red}.${mime}\n\n` +
    `${colors.reset}original video duration ${formatedTime(duration)}\n` +
    `original video size ${formatedSize(size)}\n\n`;

  process.stdout.write(startingLog);

  await runConvertor(args, duration, logs, onProgres);
};
