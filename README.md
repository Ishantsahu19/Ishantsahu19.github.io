# Ishant Sahu — Portfolio

Personal portfolio website for software engineering internship applications.

**Live site:** [ishantsahu118-a11y.github.io](https://ishantsahu118-a11y.github.io)
**GitHub profile:** [@ishantsahu118-a11y](https://github.com/ishantsahu118-a11y)
**Email:** ishantsahu118@gmail.com

## About

A single-page portfolio built to introduce my work, skills and contact details to
recruiters and hiring managers. It is intentionally dependency-free so it loads
instantly and stays easy to maintain.

## Sections

| Section | Purpose |
| --- | --- |
| Status bar | Availability for internships, links straight to contact |
| Hero | Name, rotating role titles, live summary, GitHub counters |
| About | Background plus a quick-reference fact list |
| Skills | Languages, frameworks, tooling, and what I am currently learning |
| Projects | Written case notes on shipped and in-progress work |
| GitHub | Live repository stats and recently pushed repositories |
| Contact | Email, GitHub, LinkedIn, and a resume download |

## Tech

- **HTML5** — semantic structure, accessible landmarks, `aria` labels
- **CSS3** — custom-property theming (dark and light), grid, flexbox
- **Vanilla JavaScript** — no framework, no build step, no runtime dependencies

### Features

- **Dual theme** with a toggle, persisted to `localStorage`, defaulting to the
  visitor's OS preference via `prefers-color-scheme`
- **Scroll reveal** animations driven by `IntersectionObserver`, with per-group
  stagger so related cards animate in sequence
- **Canvas particle field** in the hero that pauses when the hero scrolls out of
  view or the tab is backgrounded, and respects device pixel ratio
- **Typing effect** cycling through role titles
- **Live GitHub stats** from the public API, cached in `sessionStorage` for
  15 minutes to stay well inside rate limits, with a graceful fallback
- **Accessibility** — skip link, visible focus rings, reduced-motion support,
  and a print stylesheet
- **Responsive** from 320px up, with its own mobile navigation

## Local development

The site is static, so any local server works:

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## Deployment

Deployed to GitHub Pages. To publish a change, commit and push to `main` —
Pages rebuilds automatically.

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

## Repository layout

```
.
├── index.html      # markup and content
├── style.css       # theming, layout, animations
├── script.js       # interactions and GitHub data fetching
├── favicon.svg     # monogram icon
├── resume.pdf      # downloadable resume
└── README.md
```

## Contact

Open to software engineering internships. The fastest way to reach me is
[ishantsahu118@gmail.com](mailto:ishantsahu118@gmail.com).
