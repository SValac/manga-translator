import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu(
    {
      type: 'app',
      vue: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
      ignores: ['.agents/**', '.claude/**'],
      imports: false,
    },
    {
      files: ['**/*.vue'],
      rules: {
        'vue/max-attributes-per-line': ['error', {
          singleline: {
            max: 2,
          },
          multiline: {
            max: 1,
          },
        }],
      },
    },
    {
      rules: {
        'ts/no-redeclare': 'off',
        'ts/consistent-type-definitions': ['error', 'type'],
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
)
