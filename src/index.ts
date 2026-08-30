import path from "node:path";
import { Video } from "./core/Video.js";
import { getMetaData } from "./comands/excute.js";

const video = new Video(
  path.join(process.cwd(), "src", "loop-final.mp4"),
  path.join(process.cwd(), "src", "other"),
);

console.log(await video.formatMeta());
