import path from "node:path";
import { Video } from "./core/Video.js";

const video = new Video(path.join(process.cwd(), "src", "video.mp4"));

const output = path.join(process.cwd(), "uploads");

video.trimStart(30, path.join(process.cwd(), "uploads"));
