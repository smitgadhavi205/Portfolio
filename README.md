# Smit Gadhavi — Portfolio

A responsive, header-free portfolio using HTML, CSS, and JavaScript. Serve `dist/` with any static HTTP server.

The project collection contains 13 user-provided screenshots in `dist/assets/projects/`, with descriptions grounded in the supplied previews. Ten projects include supplied live URLs. GitHub contributions use utcsmith's ghchart calendar with a fallback link. A bundled audio track powers the paper-style music player; browsers may require a click to allow playback.

## Deploy on Vercel

1. Sign into Vercel and choose **Add New → Project**.
2. Import `smitgadhavi205/Portfolio` from GitHub.
3. Keep **Root Directory** at the repository root (`./`).
4. Use **Other** for Framework Preset. The committed `vercel.json` skips installation and building and serves `dist/`.
5. Click **Deploy**.

No dependencies, environment variables, or build step are required. Future pushes to `main` deploy automatically when the GitHub integration is connected. GitHub stores the source; Vercel hosts the website. GitHub Pages is optional, not required.
