export interface VideoInterface {
  input: string;
  output: string;
}

export type VideoConstructorOptions = {
  force?: boolean;
  log?: boolean;
};
