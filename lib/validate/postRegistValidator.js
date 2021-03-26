const { check } = require('express-validator');

var validator = () => {
  return [
    check('url')
      .not()
      .isEmpty()
      .withMessage('必須項目です。'),
    check('title')
      .not()
      .isEmpty()
      .withMessage('必須項目です。'),
    check('file')
      .not()
      .isEmpty()
      .withMessage('必須項目です。'),
    check('overview')
      .not()
      .isEmpty()
      .withMessage('必須項目です。'),
    check('content')
      .not()
      .isEmpty()
      .withMessage('必須項目です。')
  ];
}

module.exports = validator;
