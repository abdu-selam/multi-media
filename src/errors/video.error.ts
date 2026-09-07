export class InvalidVideoError extends Error {
  constructor(
    message: string = "Input path is not video file expected video file",
  ) {
    super(message);
    this.name = "InvalidVideoError";
  }
}
