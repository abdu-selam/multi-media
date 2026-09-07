import {
  audioConvertArgs,
  trimVideoArgs,
  videoConvertArgs,
} from "../data/mimeTypes.js";
import type {
  AudioMimeTypes,
  onProgres,
  VideoMimeTypes,
} from "../types/video.types.js";
import { formatedSize, formatedTime, raiseError } from "../utils/helper.js";
import { colors, runConvertor, runTerminal } from "../utils/terminalHelper.js";
import { isComandExist, isVideo } from "./checking.js";
import fs from "node:fs/promises";

export const metaDataCommand = async (
  path: string,
): Promise<object | never> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    raiseError("notvideo");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    raiseError("ffprone");
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
    raiseError("notvideo");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    raiseError("ffprone");
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
    raiseError("notvideo");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    raiseError("ffprone");
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
    raiseError("notvideo");
  }

  const args: Array<string> = videoConvertArgs(input, output, mime);

  const isFfmpegeExist = await isComandExist("ffmpeg", ["-version"]);
  if (!isFfmpegeExist) {
    raiseError("ffmpeg");
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

export const toAudioCommand = async (
  input: string,
  output: string,
  mime: AudioMimeTypes,
  duration: number,
  size: number,
  input_mime: string,
  logs: boolean = false,
  onProgres?: onProgres,
): Promise<void> => {
  const isVideoResult = await isVideo(input);

  if (!isVideoResult) {
    raiseError("notvideo");
  }

  const args: Array<string> = audioConvertArgs(input, output, mime);

  const isFfmpegeExist = await isComandExist("ffmpeg", ["-version"]);
  if (!isFfmpegeExist) {
    raiseError("ffmpeg")
  }

  await fs.mkdir(output, {
    recursive: true,
  });

  const startingLog =
    `${colors.green}multi-media proccessing video to audio\n\n` +
    `${colors.gray}changing video from ${colors.red}${input_mime} to ${colors.red}.${mime}\n\n` +
    `${colors.reset}original video duration ${formatedTime(duration)}\n` +
    `original video size ${formatedSize(size)}\n\n`;

  process.stdout.write(startingLog);

  await runConvertor(args, duration, logs, onProgres);
};

export const trimCommand = async (
  input: string,
  output: string,
  duration: number,
  size: number,
  start: number,
  end: number,
  logs: boolean = false,
  onProgres?: onProgres,
): Promise<void> => {
  const isVideoResult = await isVideo(input);

  if (!isVideoResult) {
    raiseError("notvideo")
  }

  const args: Array<string> = await trimVideoArgs(input, output, start, end);

  const isFfmpegeExist = await isComandExist("ffmpeg", ["-version"]);
  if (!isFfmpegeExist) {
    raiseError("ffmpeg")
  }

  await fs.mkdir(output, {
    recursive: true,
  });

  const startingLog =
    `${colors.green}multi-media proccessing video to audio\n\n` +
    `${colors.gray}Trimming video from ${colors.red}${formatedTime(start)} to ${colors.red}${formatedTime(end)}\n\n` +
    `${colors.reset}original video duration ${formatedTime(duration)}\n` +
    `original video size ${formatedSize(size)}\n\n`;

  process.stdout.write(startingLog);

  await runConvertor(args, duration, logs, onProgres);
};

export const splitCommand = async (
  input: string,
  output: string,
  duration: number,
  size: number,
  start: number,
  logs: boolean = false,
  onProgres?: onProgres,
): Promise<void> => {
  const isVideoResult = await isVideo(input);

  if (!isVideoResult) {
    raiseError("notvideo")
  }

  const argsStart: Array<string> = await trimVideoArgs(input, output, 0, start);
  const argsEnd: Array<string> = await trimVideoArgs(
    input,
    output,
    start,
    duration,
  );

  const isFfmpegeExist = await isComandExist("ffmpeg", ["-version"]);
  if (!isFfmpegeExist) {
    raiseError("ffmpeg")
  }

  await fs.mkdir(output, {
    recursive: true,
  });

  const startingLog =
    `${colors.green}multi-media proccessing video to audio\n\n` +
    `${colors.gray}Splitting video at ${colors.red}${formatedTime(start)}\n\n` +
    `${colors.reset}original video duration ${formatedTime(duration)}\n` +
    `original video size ${formatedSize(size)}\n\n`;

  process.stdout.write(startingLog);

  const results = await Promise.all([
    runConvertor(argsStart, duration, logs, onProgres, false),
    runConvertor(argsEnd, duration, logs, onProgres, false),
  ]);

  const postProcess =
    `\n${colors.green}Conversion finished succefully\n\n` +
    `${colors.gray}paths:${colors.reset}\n` +
    `    - ${results[0]}\n` +
    `    - ${results[1]}${colors.reset}`;

  process.stdout.write(postProcess);
};
