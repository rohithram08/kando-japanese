import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  {
    files: ['**/*.jsx', '**/*.js'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect', // Fixes the "React version not specified" warning
      },
    },
    rules: {
      // 1. Turn off strict prop-types validation (especially if not using them)
      'react/prop-types': 'off',

      // 2. Turn off old React-in-scope rules (Not needed for modern React 17+)
      'react/react-in-jsx-scope': 'off',

      // 3. Demote unused variables to a warning instead of a breaking crash error
      'no-unused-vars': 'warn',

      // 4. Handle unescaped characters in JSX neatly
      'react/no-unescaped-entities': 'off',

      // 5. Tell no-unused-vars that a component/import IS used if it only
      //    appears inside JSX (e.g. `<VocabCard />`) — without this, every
      //    component that's never called directly as a function gets
      //    falsely flagged as unused, drowning real findings in noise.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',

      // 6. Catch real bugs: missing/incorrect useEffect/useMemo/useCallback
      //    dependency arrays, and calling hooks conditionally.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];