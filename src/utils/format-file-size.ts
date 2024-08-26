export function formatFileSize(bytes: number, decimalPoint: number = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1000;
  const dp = decimalPoint < 0 ? 0 : decimalPoint;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dp)) + " " + sizes[i];
}
