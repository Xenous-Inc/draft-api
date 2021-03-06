module.exports = {
    env: {
        es2020: true,
        node: true,
        mocha: true,
    },
    extends: ['eslint-config-airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': [
            'error',
            { singleQuote: true, parser: 'flow', tabWidth: 4 },
        ],
        'no-unused-vars': 'off',
        'require-jsdoc': 'off',
        'no-invalid-this': 'off',
    },
};
