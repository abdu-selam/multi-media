import { stat } from "node:fs/promises";
import { metaDataPreparer, runTerminal } from "../utils/helper.js";
import { isComandExist, isVideo } from "./checking.js";
import nodePath from "node:path";
import type { MetaData } from "../types/video.types.js";

export const getMetaData = async (path: string): Promise<MetaData | never> => {
  const isVideoResult = await isVideo(path);

  if (!isVideoResult) {
    throw new Error("Not Video");
  }

  const isFbroneExist = await isComandExist("ffprobe", ["-version"]);
  if (!isFbroneExist) {
    throw new Error("Not Video");
  }

  const { stdout } = await runTerminal("ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    path,
  ]);

  const fileStat = await stat(path);
  const metadata = metaDataPreparer(JSON.parse(stdout));

  return {
    ...metadata,
    file: {
      filename: nodePath.basename(path),
      path: nodePath.join(nodePath.dirname(path), nodePath.basename(path)),
      extension: nodePath.extname(path),
      size: fileStat.size,
      createdAt: new Date(fileStat.birthtime),
      updatedAt: new Date(fileStat.mtime),
      lastAccessTime: new Date(fileStat.atime),
    },
  };
};
