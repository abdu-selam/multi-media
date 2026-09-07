export class InvalidVideoError extends Error {
  constructor(
    message: string = "Input path is not video file expected video file",
  ) {
    super(message);
    this.name = "InvalidVideoError";
  }
}

export class FFprobeNotFound extends Error {
  constructor(message: string = "ffprobe does not exist on this system") {
    super(message);
    this.name = "CommandNotFound";
  }
}

export class FFmpegNotFound extends Error {
  constructor(message: string = "ffmpeg does not exist on this system") {
    super(message);
    this.name = "CommandNotFound";
  }
}

export class InvalidPath extends Error {
  constructor(message: string = "path should be string only") {
    super(message);
    this.name = "InvalidPath";
  }
}

export class InvalidSecond extends Error {
  constructor(message: string = "seconds can represent in number") {
    super(message);
    this.name = "InvalidSecond";
  }
}

export class InvalidSecondLimit extends Error {
  constructor(message: string = "end must be greater than start second") {
    super(message);
    this.name = "InvalidSecond";
  }
}

export class InvalidSecondLimitStart extends Error {
  constructor(
    message: string = "second must be greater than 0 and less than the video duration",
  ) {
    super(message);
    this.name = "InvalidSecond";
  }
}

export class FFmpegError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FFmpegError";
  }
}

export class InvalidMime extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMime";
  }
}
