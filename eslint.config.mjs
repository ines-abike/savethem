import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /*
       * Accessibilité — le plugin jsx-a11y est déjà enregistré par
       * eslint-config-next, mais il n'active qu'un sous-ensemble de règles.
       * On complète avec celles qui couvrent la navigation clavier et le
       * focus, explicitement exigées par le brief.
       */
      "jsx-a11y/interactive-supports-focus": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/no-noninteractive-element-interactions": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/tabindex-no-positive": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/anchor-is-valid": [
        "error",
        { components: ["Link"], specialLink: ["hrefLeft", "hrefRight"] },
      ],

      // Qualité TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      "object-shorthand": "error",
    },
  },
  // Doit rester en dernier : désactive les règles en conflit avec Prettier.
  prettierConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
