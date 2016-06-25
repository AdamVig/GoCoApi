module.exports = {
    "extends": "eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "env": {
        "es6": true,
        "mocha": true,
        "node": true
    },
    "rules": {

        // Enforce one true brace style, but allow single line blocks
        "brace-style": ["error", "1tbs", {"allowSingleLine": true}],

        // Do not enforce use of radix except when number is ambiguous base
        "radix": ["error", "as-needed"],

        /*
         * Force space after function keyword for anonymous functions, disallow
         * space after name of named function
         */
        "space-before-function-paren": [
            "error",
            {"anonymous": "always", "named": "never"}
        ],
        "valid-jsdoc": ["error", {

            // Do not require @return when function has no return statement
            "requireReturn": false
        }]
    }
}
