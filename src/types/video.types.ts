export interface VideoInterface {
  input: string;
  output: string;

  videoMeta: () => Promise<VideoMetaData>;
  audioMeta: () => Promise<AudioMetaData>;
  fileMeta: () => Promise<FileMetaData>;
  formatMeta: () => Promise<FormatMetaData>;

  meta: () => Promise<MetaData>;

  rename: (name: string) => Promise<void>;
  move: (to: string) => Promise<void>;
  copy: (to: string) => Promise<void>;
  delete: () => Promise<void>;
}

export type VideoConstructorOptions = {
  force?: boolean;
  log?: boolean;
};

export interface FileMetaData {
  filename: string;
  path: string;
  folder: string;
  extension: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessTime: Date;
}

export interface FormatMetaData {
  name: string;
  longName: string;
  duration: number;
  bitrate: number;
}

export interface VideoMetaData {
  codecName: string;
  codecLongName: string;
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  aspectRatio: string;
  duration: number;
}

export interface AudioMetaData {
  codecName: string;
  codecLongName: string;
  sampleRate: number;
  channels: number;
  bitrate: number;
  duration: number;
}

export interface MetaDataHelper {
  video: VideoMetaData;
  audio: AudioMetaData;
  format: FormatMetaData;
  tags: Record<string, string>;
}

export interface MetaData extends MetaDataHelper {
  file: FileMetaData;
}
