/**
 * helper 帮助模块
 */
const Ajv = require('ajv');

/**
 * 验证数据结构函数
 */
function ajvCompileAndValid(schema, target) {
  let ajv = Ajv();
  let validator = ajv.compile(schema);
  let result = validator(target);
  return [result, validator.errors];
}

exports.ajvCompileAndValid = ajvCompileAndValid;