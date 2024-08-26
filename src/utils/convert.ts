// Take some JSON data and convert it to a CSV file
export function convertToCSV(data: any[]) {
  const replacer = (key: string, value: any) => (value === null ? "" : value); // specify how you want to handle null values here
  const header = Object.keys(data[0]);
  const csv = data.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(","),
  );
  csv.unshift(header.join(","));
  return csv.join("\r\n");
}

// export function convertToCSV(arr: any[]) {
//   const array = [Object.keys(arr[0])].concat(arr);

//   return array
//     .map((it) => {
//       return Object.values(it).toString();
//     })
//     .join("\n");
// }
