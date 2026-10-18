# Fonts

Geist and Geist Mono 1.8.1 by Vercel and basement.studio, under the SIL Open Font Licence 1.1
(`OFL.txt`). Copied from the `geist` npm package (`dist/fonts/`), which isn't a dependency because
it requires Next.js. To update them, copy the two variable woff2 files and the licence from a newer
release.

`index.css` declares the families. The CSS build copies this folder to `dist/fonts/`, and the Blade
package ships it in `resources/dist/fonts/`.
