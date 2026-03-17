import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

/** START OF AI DID THIS DEDUPLICATION FOR TRANSPARENCY */
const declarationPattern = /^\s*(--[\w-]+):\s*(.+);\s*$/;

function extractDeclarations(cssContent: string): Map<string, string> {
    const declarations = new Map<string, string>();
    for (const line of cssContent.split("\n")) {
        const match = line.match(declarationPattern);
        if (!match) {
            continue;
        }
        declarations.set(match[1]!, match[2]!.trim());
    }
    return declarations;
}

function dedupeAgainstBaseline(cssContent: string, baseline: Map<string, string>): string {
    const seen = new Map(baseline);
    const filtered: string[] = [];

    for (const line of cssContent.split("\n")) {
        const match = line.match(declarationPattern);
        if (!match) {
            filtered.push(line);
            continue;
        }

        const property = match[1]!;
        const value = match[2]!.trim();
        const prev = seen.get(property);
        if (prev === value) {
            if (filtered.length && filtered[filtered.length - 1]!.trim().startsWith("/*")) {
                filtered.pop();
            }
            continue;
        }

        seen.set(property, value);
        filtered.push(line);
    }

    return filtered.join("\n");
}

function indentBlock(content: string, spaces: number): string {
    const indent = " ".repeat(spaces);
    return content
        .split("\n")
        .map((line) => (line.trim().length ? `${indent}${line.trimStart()}` : ""))
        .join("\n");
}

/** END OF AI DID THIS DEDUPLICATION FOR TRANSPARENCY */

let brand1BaseDeclarations = new Map<string, string>();
let brand2BaseDeclarations = new Map<string, string>();

export default defineConfig({
    tokens: ["./resolver.json"],
    outDir: "./dist",
    plugins: [
        css({
            filename: "tokens-brand1.css",
            permutations: [
                {
                    prepare: (cssContent: string) => {
                        brand1BaseDeclarations = extractDeclarations(cssContent);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { brand: "brand1" },
                    exclude: ["jack.**", "contract.**"],
                },
                {
                    prepare: (cssContent: string) => {
                        const semanticDeclarations = extractDeclarations(cssContent);
                        brand1BaseDeclarations = new Map([
                            ...brand1BaseDeclarations,
                            ...semanticDeclarations,
                        ]);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { brand: "brand1" },
                    include: ["jack.**"],
                },
                {
                    input: { brand: "brand1", theme: "brand1-dark" },
                    prepare: (css) => {
                        const deduped = dedupeAgainstBaseline(css, brand1BaseDeclarations);
                        return `@media (prefers-color-scheme: dark) {\n  :root {\n${indentBlock(deduped, 4)}\n  }\n}`;
                    },
                    include: ["jack.**"],
                },
            ],
        }),
        css({
            filename: "tokens-brand2.css",
            permutations: [
                {
                    prepare: (cssContent: string) => {
                        brand2BaseDeclarations = extractDeclarations(cssContent);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { brand: "brand2" },
                    exclude: ["jack.**", "contract.**"],
                },
                {
                    prepare: (cssContent: string) => {
                        const semanticDeclarations = extractDeclarations(cssContent);
                        brand2BaseDeclarations = new Map([
                            ...brand2BaseDeclarations,
                            ...semanticDeclarations,
                        ]);
                        return `:root {\n  ${cssContent}\n}`;
                    },
                    input: { brand: "brand2" },
                    include: ["jack.**"],
                },
                {
                    input: { brand: "brand2", theme: "brand2-christmas" },
                    prepare: (css) => {
                        const deduped = dedupeAgainstBaseline(css, brand2BaseDeclarations);
                        return `/* Christmas Theme */\n[data-theme="christmas"] {\n${indentBlock(deduped, 4)}\n}\n`;
                    },
                    include: ["jack.**"],
                },
            ],
        }),
    ],
});
