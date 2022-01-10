/**
 * {@see https://eslint.org/docs/user-guide/configuring/rules}
 */
module.exports = {
    extends: ["xo-react"],
    ignores: ["lib", "public", "*.config.js", "node_modules", "**/*.d.ts", "docs", "stories"],
    plugins: ["prettier"],
    env: ["browser", "node"],
    overrides: [
        {
            files: "**/*.{js,jsx}",
            rules: {
                "import/no-extraneous-dependencies": 1,
                "react/prop-types": 0,
                "react/display-name": 0,
                "arrow-body-style": 0,
                "import/extensions": [
                    1,
                    {
                        js: "never",
                        jsx: "never",
                        ts: "never",
                        tsx: "never",
                        css: "always",
                        json: "always",
                    },
                ],
            },
        },
    ],
    prettier: true,
    rules: {
        "unicorn/prefer-node-protocol": 0,
        "import/order": 0,
    },
};