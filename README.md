# JobSift

A small, static job-search site: one search box, readable listings, and a link
back to the original posting. Built with plain HTML/CSS/JS, served from GitHub
Pages at:

**https://vaibhavrohilla-03.github.io/job-search/**

## Structure

```
index.html      landing page + search
search.html     results page (renders from assets/app.js)
about.html      what the site is, where listings come from
contact.html    contact + removal requests
404.html        not-found page
assets/style.css
assets/app.js   search params, sample dataset, result rendering
robots.txt
.nojekyll       keep GitHub Pages from running Jekyll
```

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Pages is served from the `main` branch, repo root. Any commit pushed to `main`
goes live within a minute or two:

```bash
git add -A && git commit -m "update" && git push
```

## Wiring a live job feed

`assets/app.js` holds a `SAMPLE` array used for the demo results. To connect a
real feed, replace the `results` computation with a fetch against your provider,
e.g. Careerjet's Search API:

```
GET https://search.api.careerjet.net/v4/query
  ?locale_code=en_IN
  &keywords=...
  &location=...
  &user_ip=<end-user ip>      # required
  &user_agent=<end-user ua>   # required
Authorization: Basic base64(api_key + ":")
```

Note: that API's terms require `user_ip` / `user_agent` of the actual end user
and a key bound to this site's URL, so the request is normally proxied through a
small server-side function (Cloudflare Worker / Netlify function) that injects
the key rather than shipping it to the browser.

## Notes

- No analytics, no cookies, no tracking scripts.
- Sample listings are placeholder data and are labelled as such on the page.
- Listing removal requests: see `contact.html`.
