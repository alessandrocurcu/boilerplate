module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "airbnb",
        "prettier",
        "prettier/react"
    ],
    "parserOptions": {
        "ecmaVersion": 2016,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "browser": true,
        "node": true,
        "jest": true,
        "es6": true
    },
    "rules": {
        "strict": 0,
        "no-console": "off",
        "no-unused-vars": "warn",
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "prefer-numeric-literals": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/prefer-stateless-function": 0,
        "prettier/prettier": [
            "error",
            {
                "trailingComma": "es5",
                "singleQuote": true
            }
        ],
        "jsx-a11y/anchor-is-valid": [ "error", {
            "specialLink": [ "hrefLeft", "hrefRight" ],
            "aspects": [ "noHref", "invalidHref", "preferButton" ]
          }]    
    },
    "plugins": [
        "prettier"
    ]
};