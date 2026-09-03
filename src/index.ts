import path from "node:path";
import { Video } from "./core/Video.js";

const video = new Video(path.join(process.cwd(), "src", "video.mp4"));

video.toMime(
  "m4v",
  path.join(process.cwd(), "src", "trial"),
);
