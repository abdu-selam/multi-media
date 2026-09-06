import type {
  AudioFormatConfig,
  AudioMimeTypes,
  VideoFormatConfig,
  VideoMimeTypes,
} from "../types/video.types.js";
import path from "node:path";

export const videoFormats: Record<VideoMimeTypes, VideoFormatConfig> = {
  mp4: {
    extension: "mp4",
    mimeType: "video/mp4",
    ffmpegFormat: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  mkv: {
    extension: "mkv",
    mimeType: "video/x-matroska",
    ffmpegFormat: "matroska",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  webm: {
    extension: "webm",
    mimeType: "video/webm",
    ffmpegFormat: "webm",
    videoCodec: "libvpx-vp9",
    audioCodec: "libopus",
  },

  avi: {
    extension: "avi",
    mimeType: "video/x-msvideo",
    ffmpegFormat: "avi",
    videoCodec: "mpeg4",
    audioCodec: "mp3",
  },

  mov: {
    extension: "mov",
    mimeType: "video/quicktime",
    ffmpegFormat: "mov",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  mpeg: {
    extension: "mpeg",
    mimeType: "video/mpeg",
    ffmpegFormat: "mpeg",
    videoCodec: "mpeg2video",
    audioCodec: "mp2",
  },

  ogv: {
    extension: "ogv",
    mimeType: "video/ogg",
    ffmpegFormat: "ogg",
    videoCodec: "libtheora",
    audioCodec: "libvorbis",
  },

  flv: {
    extension: "flv",
    mimeType: "video/x-flv",
    ffmpegFormat: "flv",
    videoCodec: "flv",
    audioCodec: "mp3",
  },

  m4v: {
    extension: "m4v",
    mimeType: "video/x-m4v",
    ffmpegFormat: "mp4",
    videoCodec: "libx264",
    audioCodec: "aac",
  },

  "3gp": {
    extension: "3gp",
    mimeType: "video/3gpp",
    ffmpegFormat: "3gp",
    videoCodec: "h263",
    audioCodec: "aac",
  },
};

export const audioFormats: Record<AudioMimeTypes, AudioFormatConfig> = {
  mp3: {
    extension: "mp3",
    codec: "libmp3lame",
    bitrate: "192k",
    sampleRate: 44100,
    channels: 2,
  },

  m4a: {
    extension: "m4a",
    codec: "aac",
    bitrate: "192k",
    sampleRate: 44100,
    channels: 2,
  },

  wav: {
    extension: "wav",
    codec: "pcm_s16le",
    sampleRate: 44100,
    channels: 2,
  },

  flac: {
    extension: "flac",
    codec: "flac",
    sampleRate: 44100,
    channels: 2,
  },

  ogg: {
    extension: "ogg",
    codec: "libvorbis",
    bitrate: "192k",
    sampleRate: 44100,
    channels: 2,
  },

  aiff: {
    extension: "aiff",
    codec: "pcm_s16be",
    sampleRate: 44100,
    channels: 2,
  },
};

export const videoConvertArgs = (
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

  const config: VideoFormatConfig = videoFormats[mime];

  const outputPath = path.join(
    output,
    `video-${Date.now()}.${config.extension}`,
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

export const audioConvertArgs = (
  input: string,
  output: string,
  mime: AudioMimeTypes,
): Array<string> => {
  const validMimes: Array<AudioMimeTypes> = [
    "mp3",
    "m4a",
    "wav",
    "flac",
    "ogg",
    "aiff",
  ];

  if (!validMimes.includes(mime)) {
    throw new Error("Error");
  }

  const commandFLags: Record<string, string> = {
    codec: "-c:a",
    bitrate: "-b:a",
    sampleRate: "-ar",
    channels: "-ac",
  };

  const config: Record<string, string | number> = audioFormats[mime];
  const terminalArgs: Array<string> = ["-i", input, "-vn"];

  for (const key in config) {
    if (key === "extension" || key === undefined) continue;
    terminalArgs.push(`${commandFLags[key]}`);
    terminalArgs.push(`${config[key]}`);
  }

  const outputPath = path.join(
    output,
    `audio-${Date.now()}.${config.extension}`,
  );

  terminalArgs.push("-progress");
  terminalArgs.push("pipe:1");
  terminalArgs.push("-nostats");

  terminalArgs.push(outputPath);

  return terminalArgs;
};

export const trimVideoArgs = (
  input: string,
  output: string,
  start: number,
  end: number,
): Array<string> => {
  const ext = path.parse(input).ext

  const terminalArgs: Array<string> = ["-i", input, "-ss", `${start}`, "-t", `${end - start}`, "-c", "copy" ];

  const outputPath = path.join(
    output,
    `video-${Date.now()}${ext}`,
  );

  terminalArgs.push("-progress");
  terminalArgs.push("pipe:1");
  terminalArgs.push("-nostats");

  terminalArgs.push(outputPath);

  return terminalArgs;
};
