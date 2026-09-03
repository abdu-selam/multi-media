export const formatedSize = (byte: number): string => {
  if (byte < 1024) {
    return `${byte.toFixed(2)} byte${byte > 1 ? "s" : ""}`;
  }

  const kiloByte = byte / 1024;
  if (kiloByte < 1024) {
    return `${kiloByte.toFixed(2)} KB`;
  }

  const megaByte = kiloByte / 1024;
  if (megaByte < 1024) {
    return `${megaByte.toFixed(2)} MB`;
  }

  return `${(megaByte / 1024).toFixed(2)} GB`;
};

export const formatedTime = (time: number): string => {
  if (time < 60) {
    return `${time.toFixed(2)} sec`;
  }

  const minutes = time / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(2)} min`;
  }

  return `${(minutes / 60).toFixed(2)} hour`;
};
