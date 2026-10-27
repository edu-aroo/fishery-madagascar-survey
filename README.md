# Enquête nationale — suivi des pêcheries à Madagascar

Online questionnaire (GitHub Pages) → Google Sheets (+ Google Drive for attachments) → R project → HTML report.
Same design and engine as the reef survey (`enquete-recifs`), with one addition: **Q14–Q40 are repeated for each resource ticked in Q13** (fish, octopus, crabs…).

```
enquete-peche/
├── index.html                  ← the questionnaire (GitHub Pages serves this)
├── assets/
│   ├── js/survey-config.js     ← THE file to edit: texts, logos, photos, questions, Apps Script URL
│   ├── js/app.js               ← form engine (no need to edit)
│   ├── css/style.css           ← colours / layout
│   └── img/logos/ , photos/    ← partner logos (ihsm.png, fapbm.png) and optional local photos
├── apps-script/Code.gs         ← receives answers → Google Sheets, attachments → Google Drive
├── tools/
│   ├── make_codebook.js        ← regenerates analysis/codebook.csv after editing questions
│   └── download_photos.R       ← downloads the photos into assets/img/photos/
├── analysis/                   ← R project (open enquete-peche.Rproj)
│   ├── R/00_packages.R  01_import.R  02_simulate.R  03_clean.R  functions.R  config.R
│   ├── report/rapport.Rmd
│   ├── codebook.csv            ← variable names, labels, options, sheet (Reponses / Ressources), conditions
│   ├── run_all.R               ← import + render both reports
│   └── data/                   ← raw data + internal report (git-ignored, never published)
└── rapport/index.html          ← rendered public report (currently built from FAKE data)
```

## How the form is organised

| Step | Questions | Shown to |
|---|---|---|
| A. Répondant | Q1–6 | everyone |
| B. Site | Q7–10 | everyone |
| C. Suivi de la pêcherie | Q11–13 | Q12 if Q11 = Oui; Q13 if Q12 = own org. or collaboration |
| **Per resource** (×1 per resource ticked in Q13) | Q14–19 · Q20–27 · Q28–33 · Q34–40 | organisations running a monitoring; only Q14–Q15 if that monitoring ended **before 2020** |
| G. Contraintes | Q41–42 | organisations running a monitoring |
| H. Gestion des données | Q43–45 | organisations running a monitoring |
| I. Harmonisation | Q46–54 (Q51 only if running a monitoring) | everyone |
| J. Pièces jointes | Q55 (optional) | everyone |

If Q11 = Non, or the monitoring is done only by another organisation (Q12), the form skips straight to section I (your choice).

---

## Step 1 — Customise the form (15 min)

Open `assets/js/survey-config.js` and fill the `META` block: `organizer`, `contactName`, `contactEmail`, `deadline`, `privacy` (all marked `[...]`). Check `estimatedTime` (I put "20 à 40 min" — time it yourself with 2 resources).

- **Logos**: copy the official files into `assets/img/logos/` as `ihsm.png` and `fapbm.png` (transparent PNG or SVG, ~120 px high). Until then the page shows the names as text.
- **Photos**: 11 photos of small-scale fishing in Madagascar from Wikimedia Commons (CC BY-SA 2.0/4.0; author, licence and link are displayed on each photo — keep them). I chose them from their titles and metadata without being able to view them: **open the page and replace any photo you don't like** (edit the `PHOTOS` list; `META.heroPhoto`, `introPhotos`, `thanksPhoto` choose which goes where). Your own field photos would be even better.
- To host the photos with the site: in R, from the `enquete-peche/` folder, `source("tools/download_photos.R")`, then commit `assets/img/photos/*.jpg`.

Preview locally: in the folder run `python -m http.server` and open <http://localhost:8000> (double-clicking `index.html` also works).

> ⚠️ Do not rename question `id`s once collection starts: they are the column names in Sheets and the variable names in R.
> After adding/removing questions or options: `node tools/make_codebook.js`.

## Step 2 — Connect the form to Google Sheets and Drive (10 min)

1. Create a Google Sheet (e.g. *Enquête pêcheries — réponses*) with the account that will own the data.
2. **Extensions → Apps Script**. Replace the default code with `apps-script/Code.gs`. Save.
3. (Optional) Put your e-mail in `NOTIFY_EMAIL`; put a Drive folder ID in `DRIVE_FOLDER_ID` (otherwise a folder *Enquête pêcheries — pièces jointes* is created in your Drive).
4. Select the function `autoriser` → **Run** → accept the permissions (Sheets + Drive; "unverified app" warning: *Advanced → Go to project*).
5. **Deploy → New deployment → Web app** · *Execute as*: **Me** · *Who has access*: **Anyone** → copy the URL ending in `/exec`.
6. Paste it into `appsScriptUrl` in `survey-config.js`.
7. Test: open the `/exec` URL → `{"ok":true,"message":"Service de collecte actif"}`. Then submit the form once with 2 resources and one PDF.

**What you get in the Sheet**
- `Reponses`: one row per organisation (Q1–13, Q41–55, plus `ressources_decrites`, `n_ressources_decrites`, `q055_fichiers` = Drive links).
- `Ressources`: one row per resource described (Q14–Q40), with `response_id`, `ressource_index`, `ressource_nom`. Join to `Reponses` on `response_id`.
- `Journal`: server errors. Duplicates are ignored using `response_id`.
- Multiple choices are separated by ` | `; "Autre" details are in `qXXX_autre`.

When you modify `Code.gs` later: **Deploy → Manage deployments → ✏️ → Version: New version** (keeps the same URL).

## Step 3 — Publish (GitHub Pages or GitLab Pages, 10 min)

**GitHub** (same as the reef survey)
1. New **public** repository `enquete-peche` (no data is stored in it: `analysis/data/` is git-ignored).
2. Upload the folder (*Add file → Upload files*, or `git init && git add . && git commit -m "v1.0" && git branch -M main && git remote add origin https://github.com/<user>/enquete-peche.git && git push -u origin main`).
3. **Settings → Pages → Deploy from a branch → main / (root)**.
4. Form: `https://<user>.github.io/enquete-peche/` · report: `.../enquete-peche/rapport/`.

**GitLab** (alternative): add a `.gitlab-ci.yml` at the root:
```yaml
pages:
  script: [mkdir -p public, "cp -r index.html assets rapport public/"]
  artifacts: { paths: [public] }
  rules: [{ if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH }]
```
The site appears under **Deploy → Pages**.

Before sending the link: fill it on a phone and a computer, then delete your test rows (both tabs) and test files in Drive.

## Step 4 — Analyse in R

1. Open `analysis/enquete-peche.Rproj` in RStudio (`R/00_packages.R` installs what is missing).
2. **Test with fake data now**: `DATA_SOURCE <- "simulated"` (default in `R/config.R`) → `source("run_all.R")`. Builds `rapport/index.html` (public) and `data/rapport_interne.html` (internal).
3. **Real data**: in `R/config.R` set `SHEET_URL` and `DATA_SOURCE <- "sheet"` → `source("run_all.R")`. First time, a browser window asks you to authorise *Tidyverse API Packages*; the token is cached in `analysis/.secrets/` (git-ignored). Each import saves a timestamped copy in `data/raw/`; `DATA_SOURCE <- "cache"` works offline on the last copy.
4. Interactive use:
   ```r
   source("R/01_import.R"); source("R/03_clean.R"); source("R/functions.R")
   CB  <- read_codebook()
   dat <- clean_data(load_raw("cache"), CB)
   REP <- dat$reponses      # 1 row per organisation (suivi_actif = runs a monitoring)
   RES <- dat$ressources    # 1 row per resource (+ org_type, region, en_cours, duree_ans, detail)
   plot_choice(REP, "q013")                                   # resources monitored
   plot_choice_grouped(filter(RES, detail), "q021")           # variables collected, by group
   heat_by(filter(RES, detail), "q021", group = "ressource")  # variables × resource
   plot_collect_vs_keep(REP, RES)                             # collected (Q21) vs to keep (Q51)
   ```

**Unit of analysis.** Q14–Q40 are analysed per *resource described*: an organisation monitoring octopus and crabs counts twice. For organisation-level statements (e.g. "x % of organisations measure mantle length"), aggregate first: `RES |> separate_rows(q021, sep = " \\| ") |> distinct(response_id, q021)`.

## Step 5 — Publish the report

After `run_all.R`: `git add rapport/index.html && git commit -m "Rapport mis à jour" && git push`.
The public version has no names, contacts, site names or free text. `data/rapport_interne.html` (contacts, open answers, Drive links) stays on your computer — never commit it. With few respondents, a category with one organisation can still be identifying: check before pushing.

---

## Changes made to the questionnaire — please check

| Q | Change | Why |
|---|---|---|
| 11–13 | Q12 shown if Q11 = Oui; Q13 if Q12 = own org. or collaboration; otherwise skip to section I | Your answer; note at Q12 said "fin des questionnaires" |
| 13 | Options split: Poissons commerciaux, Poulpes, Crabes, Crevettes, Langoustes, Autre (préciser) | "(n)" loop over each ticked resource |
| 14–40 | Repeated for each resource ("ressource n" removed from the wording, the resource name is shown in a banner) | Loop |
| 14 | Year field (1950–current year) | "Nombre" |
| 15 | "Avant 2020" → the rest of the loop (Q16–Q40) is skipped for that resource | Note "Avant 2020 fin du groupe de question" |
| 16 | "Suivi trajectométrie" appeared twice → kept once; options grouped (pêcheurs / acheteurs) | Duplicate |
| 18, 19 | Q18 if Q17 starts with "Oui"; Q19 if "Oui, mais adaptée" | As in the sheet |
| 21, 51 | 37 variables presented in 7 groups (sortie, zone, embarcation, captures, identification, biométrie, commercialisation); "nombre de sortie nombre de pirogue" split in two; spelling fixed | Readability — the grouping is mine, rename freely |
| 22, 42, 50 | Shown only if "Autre" is ticked in Q21 / Q41 / Q49; "Autre" added to Q41 | Q42 refers to "autre" but Q41 had no such option |
| 27 | "etc." → "Autre (préciser)" | |
| 33 | Shown if Q32 = Oui | |
| 35 | Number in MGA, shown if "Financière" ticked in Q34 | |
| 38, 40, 45 | Conditional on the previous answer (Q45 also for "Partiellement") | |
| 41–45 | Only for organisations running a monitoring | They refer to "le/les suivis décrits" |
| 51 | Only for organisations running a monitoring; "Autre (préciser)" opens a field | "Parmi les variables que vous collectez" |
| 54 | "suivi écologique des herbiers marins" → "suivi des pêcheries" | Copy-paste from the seagrass survey |
| 55 | PDF, Word, Excel, JPG, PNG; 5 files / 10 MB max; saved to Google Drive | Your answer |
| 8, 10 | Kept optional (no "Oui" in column F) | |

**Points I did not change — worth deciding before launch**
- **Q33 salary range**: per month? per day? per campaign? Add the period to the label, otherwise answers won't be comparable. Values below 20 000 MGA have no option.
- **Q35** "combien reçoivent-ils" — per what (per landing recorded, per month)? Same issue.
- **Q36** "coût mensuel *ou* total" mixes two scales in one answer: split into two questions, or choose one. No option below 2 000 000 MGA.
- **Q23** has no "Aucun indicateur calculé / données brutes seulement" option: a respondent who calculates nothing cannot answer this required question.
- **Q20–Q27 per resource**: they are inside your loop (Q14→Q40), so respondents with 4 resources answer them 4 times. If objectives (Q20) or recording tools (Q24) are the same for all resources, moving them out of the loop would shorten the form.
- **Q9** is single choice: a site spanning two regions cannot be described. Also, **one site per response** — an NGO working on several sites must fill the form several times (say it in the invitation e-mail, or tell me to add a note on the intro page).
- **Sections are lettered A–E, G–J** in your sheet (no F): kept as is.

## Limits

- Answers are saved on the respondent's device while filling (not across devices); attached files must be re-added after resuming a draft.
- The form is in French only.
- The `/exec` URL is public: a hidden anti-bot field and `response_id` de-duplication are included, but check for test/spam rows before analysis.
- Files larger than 10 MB in total: respondents are asked to send them by e-mail.
