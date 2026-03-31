import Papa from "papaparse";

export const loadCSVData = () => {
  return new Promise((resolve) => {
    Papa.parse("/documents/database.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resolve(result.data);
      },
    });
  });
};