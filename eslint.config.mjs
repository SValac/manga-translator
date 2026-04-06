import antfu from '@antfu/eslint-config';

// @ts-check
import { defineFlatConfigs, createConfigForNuxt, resolveOptions } from '@nuxt/eslint-config/flat';
import { fileURLToPath } from 'node:url';

const r = (...args) => fileURLToPath(new URL(...args, import.meta.url))

const options = resolveOptions({
  features: {
    standalone: false,
    stylistic: true,
  },
});

const nuxtConfigs = createConfigForNuxt(options);

export default defineFlatConfigs(
  antfu(
    {
      type: 'app',
      vue: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: 'single',
      },
      ignores: ['.agents/**', '.claude/**'],
      standalone: false,
    },
    {
      rules: {
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 2,
          },
          multiline: {
            max: 1,
          },
        }],
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': ['error', 'type'],
        'no-console': ['off'],
        'antfu/no-top-level-await': ['off'],
        'node/prefer-global/process': ['off'],
        'node/no-process-env': ['error', { allowedVariables: ['NODE_ENV'] }],
        'perfectionist/sort-imports': [
          'error',
          {
            tsconfig: {
              rootDir: '.',
            },
          },
        ],
        'unicorn/filename-case': [
          'error',
          {
            case: 'kebabCase',
            ignore: ['README.md'],
          },
        ],
      },
    },
  ),
  nuxtConfigs,
);
