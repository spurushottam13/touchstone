import { formatMappings } from "./utils.js";

export const decodeComponent = ({ sourceMap, col, line }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!col || !line) reject({ error: "All params are required" });
      const { mappings, names, sources } = sourceMap;
      if (
        typeof mappings !== "string" ||
        Array.isArray(names) == false ||
        Array.isArray(sources) === false
      )
        return reject({ error: "INVALID SOURCE MAP" });

      const rawMapping = formatMappings(mappings, sources, names);
      console.log({ rawMapping });
      if (Array.isArray(rawMapping[line]) === false)
        return reject({
          error:
            "Invalid Line, max line acc to Source Map: " +
            Object.keys(rawMapping).length,
          rawMapping,
        });
      if (typeof rawMapping[line][col] !== "string")
        return reject({
          error:
            "Invalid Col, max col acc to Source map: " +
            rawMapping[line].length,
        });
      const result = rawMapping[line][col];
      const [fileName, coordinate, keyword] = result.split("=> ")[1].split(" ");
      resolve({ fileName, coordinate, keyword });
    } catch (error) {
      console.error(error);
      reject({
        error: "CATCH-ERROR: " + error.toString(),
      });
    }
  });
};
