# Hostinger GitHub Deployment

This site is a static HTML/CSS/JavaScript site. The easiest ongoing deployment path is Hostinger hPanel Git deployment connected to the GitHub repository.

## One-Time Hostinger Setup

1. Open Hostinger hPanel.
2. Go to Websites and open this site's Dashboard.
3. In the sidebar, open Advanced > Git.
4. Choose Continue with GitHub and authorize Hostinger for the repository:
   `https://github.com/apnavet-hue/JollyPupsV2`
5. Select the deployment branch.
   - Use `main` for production.
   - Keep Root directory set to `public_html`.
6. Click Deploy.
7. Enable auto-deployment if Hostinger shows the option.

After this, every update merged into `main` can be deployed from Hostinger's Git screen, and with auto-deployment enabled it should deploy automatically.

## Branch Rule For Future Changes

Do not make new work directly on `main`.

Use a new branch for every change:

```bash
git switch main
git pull
git switch -c codex/short-change-name
```

After editing:

```bash
git add path/to/changed-files
git commit -m "Describe the change"
git push -u origin codex/short-change-name
```

Then merge the branch into `main` on GitHub when the change is approved. Hostinger should deploy from `main`.

## Clean URLs

The site supports extensionless URLs with folder index pages:

- `/services/`
- `/marketplace/`
- `/contact/`

Keep these folders when deploying to Hostinger.
