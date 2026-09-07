# Multi-Media

A TypeScript/Node.js library for working with video files through **FFmpeg** and **FFprobe**.

`@abdu-selam/multi-media` provides a simple, strongly typed API for video metadata extraction, format conversion, audio extraction, trimming, splitting, and common file operations without requiring you to work directly with FFmpeg commands.

## Features

- Video metadata extraction
- Audio metadata extraction
- Format metadata extraction
- Complete media metadata
- Video format conversion
- Video to audio conversion
- Video trimming
- Video splitting
- Rename, move, copy, and delete video files
- Conversion progress callbacks
- Custom error classes
- Full TypeScript type definitions
- ESM and CommonJS support

## Requirements

- **_FFmpeg_** (if your system doesn't have FFmpeg this package can't do anything for you)
- **_FFprobe_**
- Node.js `>=18`

FFmpeg and FFprobe must be installed and available in your system's `PATH`.

You can verify the installation with:

```bash
ffmpeg -version
ffprobe -version
```

## Installation

```bash
npm install @abdu-selam/multi-media
```

## Basic Usage

```ts
import { Video } from "@abdu-selam/multi-media";

const video = new Video("./input.mp4");
```

## Metadata

### Video Metadata

```ts
const metadata = await video.videoMeta();

console.log(metadata);
```

Returns information such as:

- Codec
- Resolution
- Frame rate
- Bitrate
- Aspect ratio
- Duration

### Audio Metadata

```ts
const audio = await video.audioMeta();

console.log(audio);
```

Returns audio information such as codec, sample rate, channels, bitrate, and duration.

### Format Metadata

```ts
const format = await video.formatMeta();

console.log(format);
```

### Complete Metadata

```ts
const metadata = await video.meta();

console.log(metadata);
```

You can also retrieve metadata without creating a `Video` instance:

```ts
const metadata = await Video.meta("./input.mp4");
```

## Video Conversion

Convert a video into another supported video format:

```ts
await video.toMime("webm", "./output");
```

Supported video formats:

```text
mp4, mkv, webm, avi, mov, mpeg, ogv, flv, m4v, 3gp
```

The library automatically configures the appropriate FFmpeg container and codecs for the selected format.

## Video to Audio

Extract the audio track from a video:

```ts
await video.toAudio("mp3", "./output");
```

Supported audio formats:

```text
mp3
m4a
wav
flac
ogg
aiff
```

## Trimming

Trim a video between two points:

```ts
await video.trim(10, 30, "./output");
```

This creates a new video containing the section between **10 and 30 seconds**.

### Trim From a Specific Point

```ts
await video.trimStart(10, "./output");
```

This keeps the video from 10 seconds until the end.

### Trim Until a Specific Point

```ts
await video.trimEnd(30, "./output");
```

This keeps the video from the beginning until 30 seconds.

## Splitting

Split a video at a specific point:

```ts
await video.split(30, "./output");
```

For example, a 60-second video split at 30 seconds produces two video files:

```text
0s  ─────────  30s  ─────────  60s
      part 1          part 2
```

The generated paths are reported when the operation completes.

## Progress Tracking

Conversion and processing methods support a progress callback.

```ts
await video.toMime("webm", "./output", false, (progress) => {
  console.log(progress);
});
```

The callback receives information such as:

```ts
{
  time: number;
  speed: string | undefined;
  size: number;
  status: string | undefined;
  duration: number;
  progress: number;
}
```

`progress` is represented as a value between `0` and `1`.

For example:

```ts
await video.toAudio("mp3", "./output", false, (progress) => {
  console.log(`${(progress.progress * 100).toFixed(2)}%`);
});
```

## Logging

Processing methods display terminal progress by default.

You can disable terminal logging by passing `false`:

```ts
await video.toMime("mp4", "./output", false);
```

The progress callback can still be used when terminal logging is disabled.

## File Operations

The `Video` class also provides common file operations.

### Check Whether a File Exists and Is a Video

```ts
const exists = await video.isExist();
```

Or:

```ts
const exists = await Video.isExist("./input.mp4");
```

### Rename

```ts
await video.rename("new-video");
```

### Move

```ts
await video.move("./videos");
```

### Copy

```ts
await video.copy("./backup");
```

### Delete

```ts
await video.delete();
```

Static versions of these operations are also available:

```ts
await Video.rename("./input.mp4", "new-video");

await Video.move("./input.mp4", "./videos");

await Video.copy("./input.mp4", "./backup");

await Video.delete("./input.mp4");
```

## Error Handling

The package provides custom errors for common failures, including:

- `InvalidVideoError`
- `FFprobeNotFound`
- `FFmpegNotFound`
- `InvalidPath`
- `InvalidSecond`
- `InvalidSecondLimit`
- `InvalidSecondLimitStart`
- `FFmpegError`
- `InvalidMime`

For example:

```ts
import { Video } from "@abdu-selam/multi-media";

try {
  const video = new Video("./input.mp4");

  await video.toMime("webm", "./output");
} catch (error) {
  console.error(error);
}
```

## Supported Formats

### Video

| Format       | Extension |
| ------------ | --------- |
| MPEG-4       | `.mp4`    |
| Matroska     | `.mkv`    |
| WebM         | `.webm`   |
| AVI          | `.avi`    |
| QuickTime    | `.mov`    |
| MPEG         | `.mpeg`   |
| Ogg Video    | `.ogv`    |
| Flash Video  | `.flv`    |
| MPEG-4 Video | `.m4v`    |
| 3GPP         | `.3gp`    |

### Audio

| Format       | Extension |
| ------------ | --------- |
| MP3          | `.mp3`    |
| MPEG-4 Audio | `.m4a`    |
| WAV          | `.wav`    |
| FLAC         | `.flac`   |
| Ogg Vorbis   | `.ogg`    |
| AIFF         | `.aiff`   |

## API Overview

### `Video`

| Method         | Description                              |
| -------------- | ---------------------------------------- |
| `videoMeta()`  | Get video stream metadata                |
| `audioMeta()`  | Get audio stream metadata                |
| `fileMeta()`   | Get file metadata                        |
| `formatMeta()` | Get container/format metadata            |
| `meta()`       | Get complete metadata                    |
| `isExist()`    | Check whether the input is a valid video |
| `rename()`     | Rename the video                         |
| `move()`       | Move the video                           |
| `copy()`       | Copy the video                           |
| `delete()`     | Delete the video                         |
| `toMime()`     | Convert to another video format          |
| `toAudio()`    | Extract/convert audio                    |
| `trim()`       | Trim between two timestamps              |
| `trimStart()`  | Trim from a timestamp to the end         |
| `trimEnd()`    | Trim from the beginning to a timestamp   |
| `split()`      | Split a video at a timestamp             |

## How It Works

The package uses:

- **FFprobe** for inspecting media files and extracting metadata.
- **FFmpeg** for video conversion, audio conversion, trimming, and splitting.
- **Node.js filesystem APIs** for file management.

The library handles the FFmpeg command construction and exposes a higher-level API so applications can perform common video operations without manually constructing FFmpeg arguments.

## Development

Clone the repository:

```bash
git clone https://github.com/abdu-selam/multi-media.git
cd multi-media
```

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

The compiled package is generated in the `dist` directory.

## License

This project is licensed under the MIT License.

See the [LICENSE](./LICENSE) file for details.

## Author

**Abduselam Awel**

GitHub: https://github.com/abdu-selam

## Repository

https://github.com/abdu-selam/multi-media

If you find the package useful, consider giving the repository a ⭐.
