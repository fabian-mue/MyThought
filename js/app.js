/*
 * My Thought – Logik der Seite
 * Zeigt den Gedanken des heutigen Tages (oder eines gewählten Tages über #JJJJ-MM-TT).
 */
(function () {
  "use strict";

  // ---------- Hilfsfunktionen ----------

  // Datum als "JJJJ-MM-TT" in lokaler Zeit
  function toKey(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  // "JJJJ-MM-TT" -> Date (lokal, 12 Uhr, um Zeitzonen-Probleme zu vermeiden)
  function fromKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d, 12);
  }

  function formatDate(key) {
    return fromKey(key).toLocaleDateString("de-DE", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }

  const isValidKey = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);

  // ---------- Daten ----------

  const todayKey = toKey(new Date());

  // Nur Gedanken bis einschließlich heute sind sichtbar, sortiert nach Datum
  const visible = (typeof THOUGHTS !== "undefined" ? THOUGHTS : [])
    .filter((t) => isValidKey(t.date) && t.date <= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));

  // ---------- Elemente ----------

  const el = {
    date: document.getElementById("date"),
    title: document.getElementById("title"),
    body: document.getElementById("body"),
    prev: document.getElementById("prev"),
    next: document.getElementById("next"),
    todayLink: document.getElementById("today-link"),
    year: document.getElementById("year")
  };

  el.year.textContent = new Date().getFullYear();

  // ---------- Anzeige ----------

  function currentKey() {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (isValidKey(hash) && hash <= todayKey) return hash;
    return todayKey;
  }

  function render() {
    const key = currentKey();
    const thought = visible.find((t) => t.date === key);

    el.date.textContent = formatDate(key);
    el.date.setAttribute("datetime", key);
    el.body.innerHTML = "";

    if (thought) {
      el.title.textContent = thought.title || "";
      el.title.hidden = !thought.title;
      thought.text.trim().split(/\n\s*\n/).forEach((para) => {
        const p = document.createElement("p");
        p.textContent = para.trim();
        el.body.appendChild(p);
      });
      document.title = (thought.title ? thought.title + " – " : "") + "My Thought";
    } else {
      el.title.hidden = true;
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = "Für diesen Tag gibt es noch keinen Gedanken.";
      el.body.appendChild(p);
      document.title = "My Thought – Fabians Blog";
    }

    // Blättern: zum vorherigen/nächsten vorhandenen Gedanken
    const prev = [...visible].reverse().find((t) => t.date < key);
    const next = visible.find((t) => t.date > key);

    el.prev.disabled = !prev;
    el.next.disabled = !next;
    el.prev.onclick = () => prev && go(prev.date);
    el.next.onclick = () => next && go(next.date);

    el.todayLink.hidden = key === todayKey;
  }

  function go(key) {
    location.hash = key === todayKey ? "" : key;
  }

  // Pfeiltasten zum Blättern
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && !el.prev.disabled) el.prev.click();
    if (e.key === "ArrowRight" && !el.next.disabled) el.next.click();
  });

  window.addEventListener("hashchange", render);
  render();

  // ---------- App-Vorbereitung: Service Worker ----------
  // Funktioniert nur, wenn die Seite über http(s) geladen wird (nicht per Doppelklick / file://)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
