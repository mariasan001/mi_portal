import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const featureImportRestrictions = [
  {
    group: [
      "@/app/admin/**",
      "@/app/usuario/**",
      "@/app/api/**",
      "@/app/layout",
      "@/app/providers",
    ],
    message:
      "Los features no deben depender de rutas, layouts o route handlers de src/app. Mueve la dependencia a lib, api o una capa shared.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: featureImportRestrictions,
        },
      ],
    },
  },
  {
    files: [
      "src/features/admin/**/application/**/*.{ts,tsx}",
      "src/features/admin/**/api/**/*.{ts,tsx}",
      "src/features/admin/**/model/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...featureImportRestrictions,
            {
              group: ["@/features/admin/**/ui/**"],
              message:
                "Las capas model, api y application no deben depender de UI. Mueve la logica compartida a model, shared o una utilidad transversal.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
