module.exports = {
  extends: [
    'airbnb',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "no-restricted-syntax": ["error", "WithStatement"],
    "class-methods-use-this": "off",
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed", { "requireForBlockBody": true }],
    "no-param-reassign": ["error", { "props": false }],
    "object-curly-newline": [
      "error", { "ObjectExpression": { "multiline": true, "minProperties": 6 } }
    ],
    "max-len": ["error", { "code": 170 }]
  },
  env: {
    jest: true,
  },
};
