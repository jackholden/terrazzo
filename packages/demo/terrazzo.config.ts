import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

// re-add de-duplication logic

export default defineConfig({
  tokens: ["./resolver.json"],
  outDir: "./dist",
  plugins: [
    css({
      filename: "tokens-default.css",
      permutations: [
        {
          prepare: (css: string) => {
            return `:root {\n  ${css}\n}`;
          },
          input: { brand: "brand1" },
          include: ["brand1.**", "semantic.**"],
        },
        {
          prepare: (css: string) => {
            return `:root {\n  ${css}\n}`;
          },
          input: { brand: "brand2" },
          include: ["brand2.**", "semantic.**"],
        },
      ],
    }),
  ],
});
