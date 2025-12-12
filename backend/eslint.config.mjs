import js from "@eslint/js";
import globals from "globals";

export default [

  // ⬅⬅⬅ BLOQUE NUEVO: aquí van los ignores globales
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "package-lock.json",
    ],
  },

  // ⬅⬅⬅ Tu configuración principal (igual a la que ya tenías)
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
      "no-undef": "off",
    },
  },

];
