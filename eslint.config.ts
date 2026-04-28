import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import boundaries, { type Config } from "eslint-plugin-boundaries";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      boundaries,
    },
    rules: {
      ...boundaries.configs.recommended.rules,
      "boundaries/dependencies": [2, {
        // allow all local imports by default
        default: "allow",
        rules: [ 
          {
            // disallow access to a different component
            disallow: {
              to: {
                captured: { component: "!{{ from.component }}"}
              }
            },
            message: "Access to files from a different component is not allowed. Attempted to access component: {{to.captured.family}}/{{to.captured.component}}"
          },
          {
            // disallow access to a different family
            disallow: {
              to: {
                captured: { family: "!{{ from.family }}" }
              }
            },
            message: "Access to a different family is not allowed. Attempted to access: {{to.captured.family}}"
          },
          {
            // allow to access a different component in the same family (exposing index only)
            allow: {
              to: {
                captured: { 
                  component: "!{{ from.component }}", 
                  family: "{{ from.family }}",
                  fileName: "index"
                }
              }
            }
          }
        ]
      }]
    },
    settings: {
      "boundaries/debug": {
        enabled: true,
        messages: {
          files: true,
          dependencies: false,
          violations: false,
        },
        filter: {
          files: [{ captured: { family: '*' } }]// show only files in families
        }
      },
      "boundaries/elements": [
        {
          type: "file",
          category: "family-level",
          pattern: 'src/*/*.ts',
          mode: "full",
          capture:['family', 'fileName']
        },
        {
          type: "file",
          category: "component-level",
          pattern: ['src/*/*/*.*.ts', 'src/*/*/*.ts'],
          mode: "full",
          capture:['family', 'component', 'fileName', 'role']
        },
        {
          type: "file",
          category: "internal-level",
          pattern: ['src/*/*/*.*.ts', 'src/*/*/*.ts'],
          mode: "full",
          capture:['family', 'component', 'internal' , 'fileName', 'role']
        }
      ]
    }
   } satisfies Config
]);
