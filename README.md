# MORRICE LADY ORIOLES SOFTBALL — WEBSITE STARTER

**A real, static, responsive website and interactive Defense Lab built for Morrice Softball.**

## OPEN IT

- Unzip the complete package.
- Double-click `index.html` to see the site in a browser. It also works when uploaded to a standard static web host.
- For a local web server (optional), run `python3 -m http.server 8000` from this folder, then open `http://localhost:8000`.
- The companion single-file `Morrice_Softball_Offline_Preview.html` (supplied separately) is an easy preview and does not need unpacking.

## PAGES

- **Home** — Morrice identity, Boop mascot, Roots Run Deep, BATS, links to program materials.
- **Schedule** — games, opponents, locations, times, and eventual scores. Empty until confirmed information is supplied.
- **Roster** — no fictitious or unapproved student-athlete names; public-facing information to add when confirmed.
- **Toolbox** — six starter teaching guides derived from the program identity, including hitting, throwing, baserunning-related defensive decisions, speed, and BATS.
- **Defense Lab** — choose runners, outs, contact, ball location, optional fielder and throw target, then animate all nine defenders and the throw/cutoff. Click a fielder to highlight her responsibility. Quiz mode included.
- **Records** — placeholder for verified program record book and achievements.
- **About** — BATS pillars and Morrice heritage logos.
- **Manage Content** — client-side no-code preview editor for text, fixtures, scores, and player entries.

## PUBLISH FOR FREE — TWO OPTIONS

### Option A: GitHub Pages (recommended for ongoing small updates)

1. Create a free GitHub account, if you don't have one.
2. Create a **public** repository called `morrice-softball`.
3. Upload **the files inside this ZIP**, keeping `index.html`, `app.js`, `defense.js`, `styles.css`, `assets/`, and `data/` in the root of the repository.
4. In that repository, choose **Settings → Pages → Build and deployment → Deploy from a branch**, then select the `main` branch and `/ (root)`.
5. GitHub publishes a site at `https://YOUR-USERNAME.github.io/morrice-softball/` (the account/repo names determine the address). Publication is not automatic until you complete these steps.
6. To update program content, change **only** `data/content.js` (directly on GitHub, with an appropriate connected app, or by uploading the file I generate for you). The design and simulator do not have to change.

GitHub's documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

**Important:** A GitHub Free repository hosting Pages must be public. Do not include private student data, passwords, or unreleased team documents in the repository.

### Option B: Cloudflare Pages (quick drag-and-drop launch)

1. Create a free Cloudflare account.
2. Open Workers & Pages, create a new Pages project, and choose **Direct Upload**.
3. Drag this ZIP (or the extracted site folder) into the upload area and publish.
4. Your public address will use `pages.dev` unless you later connect a custom domain.
5. To publish changes, upload the updated assets. You do not need to write new CSS or rebuild the simulator.

Cloudflare docs: https://developers.cloudflare.com/pages/get-started/direct-upload/

**Important:** A Cloudflare Pages Direct Upload project cannot later be converted to the Git-integrated workflow. If you want easy GitHub-driven updates, start with the Git-integrated project instead.

## HOW YOU CAN UPDATE IT THROUGH CHATGPT

In another chat, say: “Update my Morrice Softball website. Add [games, results, roster edits, news, Toolbox materials]. Please return the revised `data/content.js`, without changing the design.”

All the site content is stored in **`data/content.js`**. That single file holds the current season, motto, hero text, program introduction, Instagram URL, games, roster, announcements, records, Toolbox resources, and optional Sheets feeds. You do not need to re-code the layout.

You can also open **Manage Content** in the site, edit the fields, and choose **Download content.js**. Your edits appear only in your browser until you replace the public file in your hosting account. This is intentionally not a password-based CMS and does not directly modify server files. Do not mistake its local save button for a public publish button.

### Format to send ChatGPT

```
Update my existing Morrice Softball website data/content.js:
- Game: 2027-04-08, opponent [school], home, Varsity, 4:00 PM, location [field]
- Result: 2027-04-08, [final score]
- Roster: #12, [public name], SS/2B, senior
- News: [date, headline and 1–2 sentence announcement]
- Leave the current layout, branding, and Defense Lab code unchanged.
```

### Optional Google Sheets CSV feeds (advanced / beta)

For truly live schedule/roster edits without new uploads, the content file includes two optional URLs: `sheets.gamesCsv` and `sheets.rosterCsv`. Set each to a publicly published, HTTPS CSV export. The website attempts to fetch the public CSV when the visitor opens the corresponding page.

Game CSV headers: `date,opponent,time,home,level,location,result,status` (home must be `home` or `away`).
Roster CSV headers: `number,name,position,grade`.

**Warning:** Only publish approved public-facing data. CSV cross-origin access depends on the sheet provider's headers and may need to be tested on the deployed website; otherwise use the reliable `data/content.js` file workflow.

## DEFENSE LAB — READ BEFORE TEACHING

The interactive routes illustrate a **coach-adjustable baseline**, not universal rules or guaranteed outcomes. The fielder-selection logic is simplified and may not anticipate speed, ball height, defensive depth, a slap, a tipped ball, a tag-up, a fielding error, or a called special play.

The program philosophy incorporated:

- Ball first always; sure out > hero out; make the routine play elite; eat it if no play.
- 1B initially holds a runner on first before the pitch.
- Corners read and charge bunts; middle infield rotates per team call.
- SS is the infield leader; CF calls the outfield.
- Cutoff assignment, backup, and throw target must be called and drilled as a unit.

The controls let the coach override both **who fields** and **where the ball is thrown**, precisely because actual game decisions depend on more factors than the board knows. The automatically drawn cutoff is a proposed baseline; confirm it matches your installed team system before using it to teach players.

Important rules distinction: the ball being hit with a runner on first alone does **not** create a force at third; a force at third needs runners on first and second. A tag may be needed where no force exists. The tool names the currently available forced bases before the play.

**Before student-facing use:** Review every built-in scenario with your coaching decisions, especially first-and-third, squeeze, CF gap coverage, and home cutoffs. The simulator is an interactive teaching prototype, not an official MHSAA/NFHS product.

## BRAND / CONTENT

All Morrice artwork in `assets/` comes from the images supplied for this design. Primary identity is the full-color Boop head, with the one-color bird, For Morrice pennant, vintage bird, and alternate letter marks used selectively.

Primary brand colors: orange `#f26726`, black `#0b0c0c`, warm white `#f4f1e9`.

No player photos or names were invented. The site deliberately leaves schedule, roster, and historical records ready for confirmed public data.

## PAGES AND SOURCE FILES

```
index.html       site shell, navigation, footer
styles.css       all visual styling and responsive rules
app.js           pages, content editor, optional public CSV feeds
defense.js       defensive scenario planner and animation
data/content.js  all editable public program content
assets/          your supplied Morrice logos (optimized WebP)
.nojekyll        tells GitHub Pages to publish files as-is
```

No paid builder subscription, backend, database, plugin or Node build step is required to run this starter site. Third-party services (hosting and optional fonts) remain subject to their providers' current policies.
