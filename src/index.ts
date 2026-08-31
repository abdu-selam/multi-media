import path from "node:path";
import { Video } from "./core/Video.js";

const video = new Video(path.join(process.cwd(), "src", "video", "boom"));
