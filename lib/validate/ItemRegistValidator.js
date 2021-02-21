const { check } = require('express-validator');

var validator = () => {
  return [
    check('name')
      .not()
      .isEmpty()
      .withMessage('必須項目です。'),
    check('email')
      .isEmail()
      .withMessage('必須項目です。')
  ];
}

module.exports = validator;
