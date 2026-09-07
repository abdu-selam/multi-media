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
