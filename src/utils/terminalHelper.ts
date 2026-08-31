import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type {
  AudioMetaData,
  FileMetaData,
  FormatMetaData,
  MetaData,
  MetaDataHelper,
  VideoMetaData,
} from "../types/video.types.js";
import { stat } from "node:fs/promises";
import nodePath from "node:path";
import { isVideo } from "../comands/checking.js";

export const runTerminal = promisify(execFile);

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
    duration: format.duration,
    bitrate: format.bit_rate,
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
    width: video.width,
    height: video.height,
    frameRate: video.avg_frame_rate,
    bitrate: video.bit_rate,
    aspectRatio: video.display_aspect_ratio,
    duration: video.duration,
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
    audioMeta.sampleRate = audio.sample_rate;
    audioMeta.channels = audio.channels;
    audioMeta.bitrate = audio.duration;
    audioMeta.duration = audio.bit_rate;
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
    throw new Error("Not Video");
  }
  const fileStat = await stat(path);

  return {
    filename: nodePath.basename(path),
    path: nodePath.join(nodePath.dirname(path), nodePath.basename(path)),
    folder: nodePath.dirname(path),
    extension: nodePath.extname(path),
    size: fileStat.size,
    createdAt: new Date(fileStat.birthtime),
    updatedAt: new Date(fileStat.mtime),
    lastAccessTime: new Date(fileStat.atime),
  };
};
