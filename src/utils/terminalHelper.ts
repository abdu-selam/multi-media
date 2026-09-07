import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
import type {
  AudioMetaData,
  FileMetaData,
  FormatMetaData,
  MetaData,
  onProgres,
  VideoMetaData,
} from "../types/video.types.js";
import { stat } from "node:fs/promises";
import nodePath from "node:path";
import { isVideo } from "../comands/checking.js";
import { formatedSize, formatedTime, raiseError } from "./helper.js";
import { FFmpegError } from "../errors/video.error.js";

export const runTerminal = promisify(execFile);

export const colors: Record<string, string> = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
};

export const runConvertor = (
  args: Array<string>,
  duration: number,
  logs: boolean = false,
  onProgres?: onProgres,
  finalReport: boolean = true,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    let err = "";
    ffmpeg.stdout.on("data", (data) => {
      const output = data.toString();
      // err = output

      const lines = output.split(/\r?\n/);
      const final: Record<string, string> = {};

      for (const line of lines) {
        if (!line.includes("=")) continue;
        const [key, value] = line.replace(/=\s+/g, "=").split("=");

        final[key] = value;
      }

      const progressData = {
        time: Number(final.out_time_us) / 1_000_000,
        speed: final.speed?.trim(),
        size: Number(final.total_size),
        status: final.progress,
        duration,
      };

      const progress = (progressData.time / duration) * 100;

      if (typeof onProgres === "function") {
        onProgres({ ...progressData, progress: progress / 100 });
      }

      let terminalOutput =
        `${colors.green}${progress >= 100 ? 100.0 : progress.toFixed(2)}%${colors.reset}    ` +
        `${colors.gray}${formatedSize(progressData.size)}    ` +
        `${colors.gray}${formatedTime(progressData.time)} / ` +
        `${colors.red}${formatedTime(duration)}    ` +
        `speed=${progressData.speed}${colors.reset}`;

      const terminalWidth = process.stdout.columns || 80;

      if (terminalOutput.length >= terminalWidth) {
        terminalOutput = terminalOutput.slice(0, terminalWidth - 1);
      }

      if (!logs) return;
      process.stdout.write(`\x1b[2K\r${terminalOutput}`);

      if (final.process === "end") {
        process.stdout.write("\n");
      }
    });

    ffmpeg.stderr.on("data", (data) => {
      const output = data.toString();
      err += output;
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        const postProcess =
          `\n${colors.green}Conversion finished succefully\n\n` +
          `${colors.gray}path:${colors.reset}\n` +
          `    - ${args[args.length - 1]}${colors.reset}`;

        if (finalReport) {
          process.stdout.write(postProcess);
          resolve(postProcess);
        } else {
          process.stdout.write("\n");
          resolve(`${args[args.length - 1]}`);
        }
      } else {
        console.log(err);
        reject(new FFmpegError(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (error) => {
      reject(error);
    });
  });
};

export const metaDataPreparer = async (
  data: Record<string, any>,
  path: string,
): Promise<MetaData> => {
  const { format } = data;

  const videoMeta: VideoMetaData = videoMetaDataPreparer(data);

  const audioMeta: AudioMetaData = audioMetaDataPreparer(data);

  const formatData: FormatMetaData = formatMetaDataPreparer(data);
  const fileData: FileMetaData = await fileMetaDataPreparer(path);

  return {
    format: formatData,
    video: videoMeta,
    audio: audioMeta,
    tags: format.tags,
    file: fileData,
  };
};

export const formatMetaDataPreparer = (
  data: Record<string, any>,
): FormatMetaData => {
  const { format } = data;

  return {
    name: format.format_name,
    longName: format.format_long_name,
    duration: Number(format.duration),
    bitrate: Number(format.bit_rate),
  };
};

export const videoMetaDataPreparer = (
  data: Record<string, any>,
): VideoMetaData => {
  const { streams, format } = data;

  const [video] = streams;

  return {
    codecName: video.codec_name,
    codecLongName: video.codec_long_name,
    width: Number(video.width),
    height: Number(video.height),
    frameRate: video.avg_frame_rate,
    bitrate: Number(video.bit_rate),
    aspectRatio: video.display_aspect_ratio,
    duration: Number(video.duration),
  };
};

export const audioMetaDataPreparer = (
  data: Record<string, any>,
): AudioMetaData => {
  const { streams, format } = data;

  const audio = streams[1];

  const audioMeta = {
    codecName: "",
    codecLongName: "",
    sampleRate: 0,
    channels: 0,
    bitrate: 0,
    duration: 0,
  };

  if (!!audio) {
    audioMeta.codecName = audio.codec_name;
    audioMeta.codecLongName = audio.codec_long_name;
    audioMeta.sampleRate = Number(audio.sample_rate);
    audioMeta.channels = Number(audio.channels);
    audioMeta.bitrate = Number(audio.duration);
    audioMeta.duration = Number(audio.bit_rate);
  }

  return {
    ...audioMeta,
  };
};

export const fileMetaDataPreparer = async (
  path: string,
): Promise<FileMetaData> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    raiseError("notvideo")
  }
  const fileStat = await stat(path);

  return {
    filename: nodePath.basename(path),
    path,
    folder: nodePath.dirname(path),
    extension: nodePath.extname(path),
    size: fileStat.size,
    createdAt: new Date(fileStat.birthtime),
    updatedAt: new Date(fileStat.mtime),
    lastAccessTime: new Date(fileStat.atime),
  };
};
