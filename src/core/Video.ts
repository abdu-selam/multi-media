import fs from "node:fs/promises";
import { isPathExist } from "../utils/fileHelper.js";
import type {
  VideoInterface,
  VideoConstructorOptions,
} from "../types/video.types.js";

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
}
