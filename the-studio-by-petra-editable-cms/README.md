# The Studio by Petra — editable CMS version

This version is structured for:
- Homepage editing
- About editing
- Contact editing
- Editable colour palette and font names
- Editable images
- Individual project/case-study pages
- Adding and deleting projects from a browser CMS

## How the final workflow works
1. GitHub stores the website.
2. Cloudflare Pages publishes it.
3. Decap CMS provides the visual editor at `your-site.pages.dev/admin/`.
4. Saving in the CMS updates GitHub.
5. Cloudflare automatically deploys the update.

## Before the CMS login works
Two account-specific values must be added to `admin/config.yml`:
- YOUR_GITHUB_USERNAME
- YOUR-OAUTH-WORKER

GitHub OAuth credentials are also required. This cannot be pre-filled without the owner's accounts.

## Preview locally
Because content is loaded with `fetch()`, serve the folder with a tiny local web server instead of double-clicking index.html.
For example:
`python3 -m http.server 8000`
then visit `http://localhost:8000`

## Starter palette
Cream #E6DDCF
Mustard #DDB982
Burgundy #7A4C4D
Warm white #F7F3ED
Blue #69A8DA
