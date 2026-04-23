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
        // disallow all local imports by default
        default: "disallow",
        rules: [ 
          {
            disallow: {
              to: {
                captured: { family: "!{{ from.family }}" }
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
      },
      "boundaries/elements": [
        {
          type: "file",
          pattern: 'src/*/*.ts',
          mode: "full",
          capture:['family', 'fileName']
        },
        {
          type: "file",
          pattern: 'src/*/*/**/*.*.ts',
          mode: "full",
          capture:['family', 'component', 'internal' , 'fileName', 'role']
        },
        {
          type: "file",
          pattern: 'src/*/*/**/*.ts',
          mode: "full",
          capture:['family', 'component', 'internal' , 'fileName']
        }
      ]
    }
   } satisfies Config
]);
