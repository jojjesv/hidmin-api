/**
 * Some utilities.
 * @author Johan Svensson
 */
export default {
  /**
   * Checks if the object contains all properties defined in an array,
   * Throws an error if missing one or more properties.
   * @param props Required properties
   * @param obj Object to check
   * @param types Expected param types, e.g. { "id": "number" }
   * @param allowEmptyString Whether to allow an empty input
   */
  assertParams: (props: string[], obj: any, types: object = {}, allowEmptyString = false) => {
    let missingProps = [];
    let typeMismatches = [];

    obj = obj || {};

    for (let i of props) {
      if (!obj.hasOwnProperty(i) || (allowEmptyString ? false : obj[i] == '')) {
        missingProps.push(i);
      }

      if (types[i] && typeof obj[i] != types[i]) {
        typeMismatches.push(i);
      }
    }

    if (missingProps.length > 0) {
      throw new Error("Missing parameters: " + missingProps.join(","));
    }

    if (typeMismatches.length > 0) {
      let description = typeMismatches.map(key => (
        `${key} as ${types[key]}`
      ));
      throw new Error("Invalid data types for parameters, expected: " + description.join(","));
    }
  },

}