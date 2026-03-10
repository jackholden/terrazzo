import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

export default defineConfig({
    tokens: ["./src/resolver.json"],
    outDir: "./dist",
    plugins: [
        // Base defaults token file. Shared across all brands. Uses brand-1 as defaults.
        css({
            filename: "tokens-default.css",
            permutations: [
                {
                    prepare: (cssContent: string) => {
                        console.log('Brand1 CSS prepare called with content:');
                        console.log(cssContent);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { },
                }
            ],
        }),
        css({
            filename: "tokens-brand2.css",
            permutations: [
                {
                    prepare: (cssContent: string) => {
                        console.log('Brand2 CSS prepare called with content:');
                        console.log(cssContent);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { brand: "brand2", breakpoint: "breakpoints2" },
                }
            ],
        })
    ],
});