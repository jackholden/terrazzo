# Simple reprod

1. Run `pnpm --filter @terrazzo/demo build`, all will be successful.
2. Now go to brands/brand1/semantic.tokens.json and rename it to work.semantic.tokens.json
3. Then rename brands/brand1/[switch-to-me]semantic.tokens.json to semantic.tokens.json
4. Run `pnpm --filter @terrazzo/demo build` again, it will fail.

You should get the following error:
```
plugin:@terrazzo/plugin-css: There was an error trying to apply input {"brand":"brand2"}.
✗  plugin:@terrazzo/plugin-css: No token "semantic.border.focus"
```

The difference is that I don't override the `border` token in the `brand1` semantic tokens file but I do in `brand2`. If i override in `brand1` as well, it will work.

