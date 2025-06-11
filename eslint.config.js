import foundryConfig from '@rayners/foundry-dev-tools/eslint';

export default [
  // Use the shared Foundry VTT configuration
  ...foundryConfig,

  // Project-specific overrides to handle development status
  {
    files: ['**/*.{js,ts}'],
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.js', '*.mjs'],
    rules: {
      // Temporarily relax some rules for early development
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
];
