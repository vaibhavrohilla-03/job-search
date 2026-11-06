/* JobSift — shared behaviour */
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- sample dataset (replaced by the live job feed) ---- */
  var SAMPLE = [
    { t: "Backend Engineer (Go)", c: "Northwind Systems", l: "Bengaluru, India", s: "₹18–28 LPA", ty: "Full-time", r: "Remote", d: "2 days ago" },
    { t: "Python Developer", c: "Ardent Data", l: "Pune, India", s: "₹10–16 LPA", ty: "Full-time", r: "Hybrid", d: "4 days ago" },
    { t: "Frontend Developer (React)", c: "Kite Labs", l: "India", s: "Not disclosed", ty: "Contract", r: "Remote", d: "5 days ago" },
    { t: "Data Analyst", c: "Meridian Retail Group", l: "Gurugram, India", s: "₹8–14 LPA", ty: "Full-time", r: "On-site", d: "1 week ago" },
    { t: "DevOps Engineer", c: "Sable Cloud", l: "Hyderabad, India", s: "₹15–24 LPA", ty: "Full-time", r: "Remote", d: "1 week ago" },
    { t: "Machine Learning Engineer", c: "Kestrel AI", l: "Bengaluru, India", s: "₹22–35 LPA", ty: "Full-time", r: "Hybrid", d: "3 days ago" },
    { t: "Full Stack Developer (Node/React)", c: "Paperplane", l: "Remote, India", s: "₹14–22 LPA", ty: "Full-time", r: "Remote", d: "6 days ago" },
    { t: "Site Reliability Engineer", c: "Orbit Payments", l: "Mumbai, India", s: "₹20–30 LPA", ty: "Full-time", r: "On-site", d: "2 weeks ago" },
    { t: "QA Automation Engineer", c: "Fathom Software", l: "Noida, India", s: "₹9–15 LPA", ty: "Full-time", r: "Hybrid", d: "1 week ago" },
    { t: "Software Engineering Intern", c: "Northwind Systems", l: "Bengaluru, India", s: "₹40,000/mo", ty: "Internship", r: "On-site", d: "1 day ago" },
    { t: "Product Designer", c: "Kite Labs", l: "Remote", s: "₹12–20 LPA", ty: "Full-time", r: "Remote", d: "9 days ago" },
    { t: "Android Developer (Kotlin)", c: "Trailhead Apps", l: "Chennai, India", s: "₹11–18 LPA", ty: "Full-time", r: "Hybrid", d: "1 week ago" }
  ];

  var params = new URLSearchParams(window.location.search);
  var q = (params.get("q") || "").trim();
  var loc = (params.get("l") || "").trim();

  var qInput = document.getElementById("q-input");
  var lInput = document.getElementById("l-input");
  if (qInput) qInput.value = q;
  if (lInput) lInput.value = loc;

  var title = document.getElementById("results-title");
  var sub = document.getElementById("results-sub");
  var list = document.getElementById("joblist");

  if (!list) return; /* not the results page */

  var words = q.toLowerCase().split(/[\s,+]+/).filter(function (w) { return w.length > 1; });

  function score(job) {
    var hay = (job.t + " " + job.c + " " + job.l + " " + job.ty + " " + job.r).toLowerCase();
    var hits = 0;
    words.forEach(function (w) { if (hay.indexOf(w) !== -1) hits++; });
    if (loc && job.l.toLowerCase().indexOf(loc.toLowerCase()) !== -1) hits += 1;
    return hits;
  }

  var results = words.length || loc
    ? SAMPLE.map(function (j) { return { j: j, s: score(j) }; })
            .filter(function (x) { return x.s > 0; })
            .sort(function (a, b) { return b.s - a.s; })
            .map(function (x) { return x.j; })
    : SAMPLE.slice(0, 8);

  var label = q || loc
    ? "Results for “" + [q, loc].filter(Boolean).join(" in ") + "”"
    : "Recent openings";

  if (title) title.textContent = label;
  if (sub) {
    sub.textContent = results.length
      ? results.length + " opening" + (results.length === 1 ? "" : "s") + " found · sorted by relevance"
      : "No matches in the sample set — try a broader keyword.";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  list.innerHTML = results.map(function (j) {
    return '<a class="job" href="search.html?q=' + encodeURIComponent(j.t) + '">' +
      '<div class="job-top"><h3>' + esc(j.t) + '</h3><span class="co">' + esc(j.c) + '</span>' +
      '<span class="tag' + (j.r === "Remote" ? "" : " neutral") + '">' + esc(j.r) + '</span></div>' +
      '<div class="meta"><span><b>' + esc(j.ty) + '</b></span><span>' + esc(j.l) + '</span>' +
      '<span>' + esc(j.s) + '</span><span>' + esc(j.d) + '</span></div></a>';
  }).join("");
})();
