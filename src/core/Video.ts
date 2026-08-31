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
import {
  formatDataCommand,
  metaDataCommand,
  streamDataCommand,
} from "../comands/excute.js";
import {
  audioMetaDataPreparer,
  fileMetaDataPreparer,
  formatMetaDataPreparer,
  metaDataPreparer,
  videoMetaDataPreparer,
} from "../utils/terminalHelper.js";

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
    const data = await streamDataCommand(this.input);

    const metaData = videoMetaDataPreparer(data);

    return metaData;
  }

  async audioMeta(): Promise<AudioMetaData> {
    const data = await streamDataCommand(this.input);

    const metaData = audioMetaDataPreparer(data);

    return metaData;
  }

  async fileMeta(): Promise<FileMetaData> {
    const data = await fileMetaDataPreparer(this.input);

    return data;
  }

  async formatMeta(): Promise<FormatMetaData> {
    const data = await formatDataCommand(this.input);

    const metaData = formatMetaDataPreparer(data);

    return metaData;
  }

  async meta(): Promise<MetaData> {
    const data = await metaDataCommand(this.input);

    const metaData = await metaDataPreparer(data, this.input);

    return metaData;
  }
}
