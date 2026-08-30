import fs from "node:fs/promises";
import { isPathExist } from "../utils/fileHelper.js";
import type {
  VideoInterface,
  VideoConstructorOptions,
  VideoMetaData,
  AudioMetaData,
  FileMetaData,
  FormatMetaData,
  MetaData,
} from "../types/video.types.js";
import { getMetaData } from "../comands/excute.js";

export class Video implements VideoInterface {
  input: string;
  output: string;
  private options: VideoConstructorOptions;

  constructor(
    input: string,
    output: string,
    options: VideoConstructorOptions = {
      force: false,
      log: false,
    },
  ) {
    this.input = input;
    this.output = output;
    this.options = options;

    this.createOutputDir();
  }

  private async createOutputDir() {
    if (this.options.force) {
      fs.mkdir(this.output, {
        recursive: true,
      });
    }
  }

  async isExist(): Promise<boolean> {
    const result = await isPathExist(this.input);
    return result;
  }

  async videoMeta(): Promise<VideoMetaData> {
    const data = await this.meta();

    return data.video;
  }

  async audioMeta(): Promise<AudioMetaData> {
    const data = await this.meta();

    return data.audio;
  }

  async fileMeta(): Promise<FileMetaData> {
    const data = await this.meta();

    return data.file;
  }

  async formatMeta(): Promise<FormatMetaData> {
    const data = await this.meta();

    return data.format;
  }

  async meta(): Promise<MetaData> {
    const data = await getMetaData(this.input);

    return data;
  }
}
