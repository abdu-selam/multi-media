import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { MetaDataHelper } from "../types/video.types.js";

export const runTerminal = promisify(execFile);

export const metaDataPreparer = (data: Record<string, any>): MetaDataHelper => {
  const { streams, format } = data;

  const [video, audio] = streams;

  const videoMeta = {
    codecName: video.codec_name,
    codecLongName: video.codec_long_name,
    width: video.width,
    height: video.height,
    frameRate: video.avg_frame_rate,
    bitrate: video.bit_rate,
    aspectRatio: video.display_aspect_ratio,
    duration: video.duration,
  };

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

  const formatData = {
    name: format.format_name,
    longName: format.format_long_name,
    duration: format.duration,
    bitrate: format.bit_rate,
  };

  return {
    format: formatData,
    video: videoMeta,
    audio: audioMeta,
    tags: format.tags,
  };
};
