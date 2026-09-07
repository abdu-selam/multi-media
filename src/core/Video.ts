import fs from "node:fs/promises";
import type {
  VideoInterface,
  VideoMetaData,
  AudioMetaData,
  FileMetaData,
  FormatMetaData,
  MetaData,
  VideoMimeTypes,
  onProgres,
  AudioMimeTypes,
} from "../types/video.types.js";
import {
  converssionCommand,
  formatDataCommand,
  metaDataCommand,
  splitCommand,
  streamDataCommand,
  toAudioCommand,
  trimCommand,
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
import { isNumber } from "../utils/validators.js";
import { raiseError } from "../utils/helper.js";

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
      raiseError("path");
    }

    const check = await isVideo(this.input);

    if (!check) {
      raiseError("notvideo");
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
      raiseError("path");
    }

    const check = await isVideo(this.input);

    if (!check) {
      raiseError("notvideo");
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
      raiseError("notvideo");
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
      raiseError("path");
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
      raiseError("path");
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
      raiseError("notvideo");
    }

    await fs.unlink(path);
  }

  // mime changers
  async toMime(
    type: VideoMimeTypes,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    // check to
    if (typeof destination !== "string") {
      raiseError("path");
    }

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    await converssionCommand(
      this.input,
      destination,
      type,
      videoData.duration,
      fileData.size,
      fileData.extension,
      logs,
      onProgres,
    );
  }

  // video to audio changer
  async toAudio(
    type: AudioMimeTypes,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    if (typeof destination !== "string") {
      raiseError("path");
    }

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    await toAudioCommand(
      this.input,
      destination,
      type,
      videoData.duration,
      fileData.size,
      fileData.extension,
      logs,
      onProgres,
    );
  }

  // trimming the video
  async trim(
    startSecond: number,
    endSecond: number,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    // check the start and destination
    if (!isNumber(startSecond) || !isNumber(endSecond)) {
      raiseError("second");
    }

    const start = Number(startSecond);
    const end = Number(endSecond);

    if (end - start <= 0) {
      raiseError("limit");
    }

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    await trimCommand(
      this.input,
      destination,
      videoData.duration,
      fileData.size,
      start,
      end,
      logs,
      onProgres,
    );
  }

  async trimStart(
    second: number,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    if (!isNumber(second)) {
      raiseError("second");
    }

    const start = Number(second);

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    const end = videoData.duration;

    if (end - start <= 0) {
      raiseError("limit");
    }

    await trimCommand(
      this.input,
      destination,
      videoData.duration,
      fileData.size,
      start,
      end,
      logs,
      onProgres,
    );
  }

  async trimEnd(
    second: number,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    if (!isNumber(second)) {
      raiseError("second");
    }

    const start = 0;
    let end = Number(second);

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    end = videoData.duration > end ? end : videoData.duration;

    if (end === 0) {
      raiseError("limit");
    }

    await trimCommand(
      this.input,
      destination,
      videoData.duration,
      fileData.size,
      start,
      end,
      logs,
      onProgres,
    );
  }

  async split(
    second: number,
    destination: string,
    logs: boolean = true,
    onProgres: onProgres = () => {},
  ): Promise<void> {
    if (!isNumber(second)) {
      raiseError("second");
    }

    const start = Number(second);

    if (start <= 0) {
      raiseError("limitSecond");
    }

    const videoData = await this.videoMeta();
    const fileData = await this.fileMeta();

    if (videoData.duration <= start) {
      raiseError("limitSecond");
    }

    await splitCommand(
      this.input,
      destination,
      videoData.duration,
      fileData.size,
      start,
      logs,
      onProgres,
    );
  }
}
