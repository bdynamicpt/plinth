# Component tokens

Only the values a project may need to tune for one component. They are built from semantic
tokens, so a brand's overrides still reach them.

<!-- tokens: component -->

Override one like any token, after Plinth's CSS:

```css label="resources/css/brand.css"
:root {
    --plinth-header-height: 4rem;
}
```

Anything else about a component is the semantic tokens' job. If a project needs a value that has
no token, open an issue: a new component token is added to Plinth, not written into a project's
copy of the CSS.
