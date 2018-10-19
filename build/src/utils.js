"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Some utilities.
 * @author Johan Svensson
 */
exports.default = {
    /**
     * Checks if the object contains all properties defined in an array,
     * Throws an error if missing one or more properties.
     * @param props Required properties
     * @param obj Object to check
     * @param types Expected param types, e.g. { "id": "number" }
     * @param allowEmptyString Whether to allow an empty input
     */
    assertParams: function (props, obj, types, allowEmptyString) {
        if (types === void 0) { types = {}; }
        if (allowEmptyString === void 0) { allowEmptyString = false; }
        var missingProps = [];
        var typeMismatches = [];
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var i = props_1[_i];
            if (!obj.hasOwnProperty(i) || (allowEmptyString ? false : obj[i] == '')) {
                missingProps.push(i);
            }
            if (types[i] && typeof types[i] != types[i]) {
                typeMismatches.push(i);
            }
        }
        if (missingProps.length > 0) {
            throw new Error("Missing parameters: " + missingProps.join(","));
        }
        if (typeMismatches.length > 0) {
            var description = typeMismatches.map(function (key) { return (key + " as " + types[key]); });
            throw new Error("Invalid data types for parameters, expected: " + description.join(","));
        }
    },
};
