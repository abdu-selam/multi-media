import fs from "node:fs/promises";
import type {
  VideoInterface,
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
import nodePath from "node:path";
import { isVideo } from "../comands/checking.js";

export class Video implements VideoInterface {
  #folder: string = "";
  #filename: string = "";

  constructor(public input: string) {
    this.#constructPrivates();
  }

  #constructPrivates() {
    this.#folder = nodePath.dirname(this.input);
    this.#filename = nodePath.basename(this.input);
  }

  // Meta data related methods
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

  static async meta(path: string): Promise<MetaData> {
    const data = await metaDataCommand(path);

    const metaData = await metaDataPreparer(data, path);

    return metaData;
  }

  // basic file operations
  async isExist(): Promise<boolean> {
    const result = await isVideo(this.input);
    return result;
  }

  async rename(name: string): Promise<void> {
    const fileMeta = await this.fileMeta();
    const ext = fileMeta.extension;

    const newPath = nodePath.join(this.#folder, `${name}${ext}`);

    await fs.rename(this.input, newPath);

    this.input = newPath;
    this.#filename = `${name}${ext}`;
  }

  async move(to: string): Promise<void> {
    if (typeof to !== "string") {
      throw new Error("string");
    }

    const check = await isVideo(this.input);

    if (!check) {
      throw new Error("error");
    }

    await fs.mkdir(to, {
      recursive: true,
    });

    const newPath = nodePath.join(to, this.#filename);

    await fs.rename(this.input, newPath);

    this.input = newPath;
    this.#folder = to;
  }

  async copy(to: string): Promise<void> {
    if (typeof to !== "string") {
      throw new Error("string");
    }

    const check = await isVideo(this.input);

    if (!check) {
      throw new Error("error");
    }

    await fs.mkdir(to, {
      recursive: true,
    });

    const newPath = nodePath.join(to, this.#filename);

    await fs.copyFile(this.input, newPath);
  }

  async delete(): Promise<void> {
    const check = await isVideo(this.input);

    if (!check) {
      throw new Error("error");
    }

    await fs.unlink(this.input);
  }

  // static basic file operations
  static async isExist(path: string): Promise<boolean> {
    const result = await isVideo(path);
    return result;
  }

  static async rename(path: string, newname: string): Promise<void> {
    const fileMeta = await fileMetaDataPreparer(path);

    const folder = fileMeta.folder;
    const ext = fileMeta.extension;

    const newPath = nodePath.join(folder, `${newname}${ext}`);

    await fs.rename(path, newPath);
  }

  static async move(video: string, to: string): Promise<void> {
    if (typeof to !== "string") {
      throw new Error("string");
    }

    const fileMeta = await fileMetaDataPreparer(video);

    await fs.mkdir(to, {
      recursive: true,
    });

    const newPath = nodePath.join(to, fileMeta.filename);
    await fs.rename(video, newPath);
  }

  static async copy(video: string, to: string): Promise<void> {
    if (typeof to !== "string") {
      throw new Error("string");
    }

    const fileMeta = await fileMetaDataPreparer(video);

    await fs.mkdir(to, {
      recursive: true,
    });

    const newPath = nodePath.join(to, fileMeta.filename);

    await fs.copyFile(video, newPath);
  }

  static async delete(path: string): Promise<void> {
    const check = await isVideo(path);

    if (!check) {
      throw new Error("error");
    }

    await fs.unlink(path);
  }
}
