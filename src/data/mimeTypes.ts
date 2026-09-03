import type {
  VideoFormatConfig,
  VideoMimeTypes,
} from "../types/video.types.js";
import path from "node:path";

export const videoFormats: Record<VideoMimeTypes, VideoFormatConfig> = {
  mp4: {
    extension: ".mp4",
    mimeType: "video/mp4",
    ffmpegFormat: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  mkv: {
    extension: ".mkv",
    mimeType: "video/x-matroska",
    ffmpegFormat: "matroska",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  webm: {
    extension: ".webm",
    mimeType: "video/webm",
    ffmpegFormat: "webm",
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
  },

  avi: {
    extension: ".avi",
    mimeType: "video/x-msvideo",
    ffmpegFormat: "avi",
    videoCodec: "mpeg4",
    audioCodec: "mp3",
  },

  mov: {
    extension: ".mov",
    mimeType: "video/quicktime",
    ffmpegFormat: "mov",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  mpeg: {
    extension: ".mpeg",
    mimeType: "video/mpeg",
    ffmpegFormat: "mpeg",
    videoCodec: "mpeg2video",
    audioCodec: "mp2",
  },

  ogv: {
    extension: ".ogv",
    mimeType: "video/ogg",
    ffmpegFormat: "ogg",
    videoCodec: "libtheora",
    audioCodec: "libvorbis",
  },

  flv: {
    extension: ".flv",
    mimeType: "video/x-flv",
    ffmpegFormat: "flv",
    videoCodec: "flv",
    audioCodec: "mp3",
  },

  m4v: {
    extension: ".m4v",
    mimeType: "video/x-m4v",
    ffmpegFormat: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  "3gp": {
    extension: ".3gp",
    mimeType: "video/3gpp",
    ffmpegFormat: "3gp",
    videoCodec: "h263",
    audioCodec: "aac",
  },
};

export const convertArgs = (
  input: string,
  output: string,
  mime: VideoMimeTypes,
): Array<string> => {
  const validMimes: Array<VideoMimeTypes> = [
    "mp4",
    "mkv",
    "webm",
    "avi",
    "mov",
    "mpeg",
    "ogv",
    "flv",
    "m4v",
    "3gp",
  ];

  if (!validMimes.includes(mime)) {
    throw new Error("Error");
  }

  const config = videoFormats[mime];

  const outputPath = path.join(
    output,
    `video-${Date.now()}${config.extension}`,
  );

  return [
    "-i",
    input,
    "-c:v",
    config.videoCodec,
    "-c:a",
    config.audioCodec,
    "-f",
    config.ffmpegFormat,
    "-progress",
    "pipe:1",
    "-nostats",
    `${outputPath}`,
  ];
};
