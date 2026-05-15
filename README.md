# Editorial Site Shell

An Astro and MDX shell for building small editorial sites from a replaceable `content/` directory.

## Content model

The project keeps site-specific content outside `src/`:

- `content/site.json` controls publication metadata, nav labels, and logo location.
- `content/site.json` can also provide contact form directives such as endpoint, subject, field label, and select options.
- `content/pages/home.mdx` controls the homepage editorial framing.
- `content/pages/guides.mdx` controls the guide index framing.
- `content/blog/*.mdx` contains guide entries and article bodies.
- `content/pages/*.mdx` contains long-form static pages.
- `content/images/*` contains both core site images and inline article images.

Astro reads the MDX files through content collections. The `/media/...` route exposes files from `content/images/`, so image files can stay beside the content and later move to a CMS or external content source.

To build a different site, replace the files inside `content/` while keeping the same frontmatter shape. The reusable shell in `src/` should stay free of brand names, topic language, form destinations, and image references.

## Commands

```bash
npm install
npm run dev
npm run build
```
