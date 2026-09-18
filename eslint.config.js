import js from '@eslint/js'
import globals from 'globals'
import eslintComments from 'eslint-plugin-eslint-comments'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
        plugins: {
            'eslint-comments': eslintComments,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            'eslint-comments/no-unlimited-disable': 'error',
            'eslint-comments/require-description': 'error',
        },
    },
    {
        files: ['src/context/**/*.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
)
