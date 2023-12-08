const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const removeNullAndUndefinedNestedObject = (obj = {}) => {
  return _.transform(obj, (result, value, key) => {
    if (_.isObject(value)) {
      result[key] = removeNullAndUndefinedNestedObject(value);
    } else if (!_.isNil(value)) {
      result[key] = value;
    }
  });
};
const removeNullInArray = (arr = []) => {
  return arr.filter((item) => item !== null);
};

module.exports = {
  getInfoData,
  removeNullAndUndefinedNestedObject,
  removeNullInArray,
};
