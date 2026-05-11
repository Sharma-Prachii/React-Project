const { body, param, validationResult } = require("express-validator");

const loginValidation = [
       body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Please use a valid email address")
        .normalizeEmail(),

     body("password")
        .notEmpty().withMessage("password required")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/)
        .withMessage("Password must contain at least 6 characters, including uppercase, lowercase, number, and special character")
        .trim()
]

const validateCreateUser = [
    body("firstName")
        .notEmpty().withMessage("firstName is required")
        .trim(),

    body("lastName")
        .notEmpty().withMessage("lastName is required")
        .trim(),

    body("password")
        .notEmpty().withMessage("password required")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{6,}$/)
        .withMessage("Password must contain at least 6 characters, including uppercase, lowercase, number, and special character")
        .trim(),

    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("Please use a valid email address")
        .normalizeEmail(),

    body("companyName")
        .notEmpty().withMessage("companyName is required")
        .trim(),

   body('phoneNo')
  .trim()
  .notEmpty().withMessage('Phone number is required')
  .matches(/^\d{10}$/).withMessage('Please use a valid 10-digit phone number'),


    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateId = [
    param("id")
        .isMongoId().withMessage("Invalid ID"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUpdateUser = [
  body("firstName")
    .optional()
    .trim()
    .notEmpty().withMessage("firstName cannot be empty"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty().withMessage("lastName cannot be empty"),

  body("email")
    .optional()
    .isEmail().withMessage("Please use a valid email address")
    .normalizeEmail(),

  body("companyName")
    .optional()
    .trim(),

  body("phoneNo")
    .optional()
    .matches(/^\d{10}$/)
    .withMessage("Please use a valid 10-digit phone number"),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
module.exports = {
    validateCreateUser,
    validateId,
    validateUpdateUser
};