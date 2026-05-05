import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import boundaries, { type Config } from "eslint-plugin-boundaries";


export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser }, 
    rules: {
      /**
       * Disallow parent directory imports (../)
       *
       * Rationale:
       * - Prevent fragile relative paths
       * - Encourage absolute imports / path aliases (e.g. @/...)
       * - Keep module boundaries clearer
       */
      "no-restricted-imports": ["error", { patterns: [{
        group: ["**/../*"],
        message: "Avoid parent imports (../). Use path aliases like @/ instead."
      }]}]
    }
  },
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
            message: "Access to files from a different component is not allowed. Attempted to access component: [{{to.captured.family}}/{{to.captured.component}}]"
          },
          {
            // disallow access to a different family
            disallow: {
              to: {
                captured: { family: "!{{ from.family }}" }
              }
            },
            message: "Access to a different family is not allowed. Attempted to access: [{{to.captured.family}}]"
          },
          {
            allow: {
              to: [
                // allow access to the index of a different component but same family or base family (no dashes)
                {
                  captured: { 
                    component: "!{{ from.component }}", 
                    family: ["{{ from.family }}", "!*-*"],
                    fileName: "index"
                  },
                  category: "component-level"
                },
                // or any shared file of a different component but same family or base family (no dashes)
                {
                  captured: {
                    component: "!{{ from.component }}", 
                    family: ["{{ from.family }}", "!*-*"]
                  },
                  type: "shared-file"
                }
              ]
            },
            disallow: {
              // disallow access to any family from base family (no dashes)
              from: { captured: { family: "!*-*" } },// base family
              to: {
                captured: { family: "!{{ from.family }}" }
              }
            },
            message: "Access to any family from a base family is not allowed. Attempted to access [{{to.captured.family}}] from [{{from.captured.family}}]"
          },
          {
            disallow: {
              // disallow any access to stories or spec files
              to: { captured: { role: ["stories", "spec"]}}
            },
            message: "Attempt to access a file with role [{{to.captured.role}}], only allowed from files with same role and family." 
          },
          {
            allow: {
              // allow access to stories or spec files from other stories or spec files with the same family
              from: {
                captured: { family: "{{to.family}}", role: "{{to.role}}"}
              },
              to: {
                captured: { role: ["stories", "spec"]}
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
          files: false,
          dependencies: false,
          violations: true,
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
          type: "shared-file",
          category: "component-level",
          pattern: ['src/*/*-shared/*.*.ts', 'src/*/*-shared/*.ts'],
          mode: "full",
          capture:['family', 'component', 'fileName', 'role']
        },
        {
          type: "file",
          category: "component-level",
          pattern: ['src/*/*/*.*.ts', 'src/*/*/*.ts'],
          mode: "full",
          capture:['family', 'component', 'fileName', 'role']
        },
        {
          type: "shared-file",
          category: "internal-level",
          pattern: ['src/*/*-shared/**/*.*.ts', 'src/*/*-shared/**/*.ts'],
          mode: "full",
          capture:['family', 'component', 'internal' , 'fileName', 'role']
        },
        {
          type: "file",
          category: "internal-level",
          pattern: ['src/*/*/**/*.*.ts', 'src/*/*/**/*.ts'],
          mode: "full",
          capture:['family', 'component', 'internal' , 'fileName', 'role']
        }
      ]
    }
   } satisfies Config
]);
