const correctPassword = "sQr13mpl3s";

function checkPassword() {
  const input = document.getElementById("password-input").value;
  const error = document.getElementById("error-message");

  if (input === correctPassword) {
    document.getElementById("password-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } else {
    error.textContent = "That's not the right password. Try again.";
  }
}

const sheetID    = '1OYgV0AQ2NlBZ1as9g_PFbRAzo82YQsMpSfdpjwBAINE';      // e.g. '1AbCDefGhIJK...'
const sheetName  = 'Sheet1';                  // case-sensitive!
const cellRange  = 'B1:B4';                      // any cell or range
const intervalMs = 1_000;                    // update every 10s
// ---------------------------

// map each column to its span ID:
const mapping = [
  'counter1',  // B1
  'counter2',  // B2
  'counter3',  // B3
  'counter4'   // B4
];

// Build the gviz URL
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq`
+ `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
+ `&range=${encodeURIComponent(cellRange)}`;


// store the last-seen values by element ID
const lastValues = {};

async function fetchCounters() {
  try {
    const res   = await fetch(url);
    const txt   = await res.text();
    const start = txt.indexOf('{');
    const end   = txt.lastIndexOf('}');
    const data  = JSON.parse(txt.slice(start, end + 1));
    const rows  = data.table.rows || [];

    rows.forEach((row, i) => {
      const elId     = mapping[i];
      const el       = document.getElementById(elId);
      if (!el) return;        // safety
      const cell     = row.c[0] || {};
      const newValue = (cell.v ?? cell.f ?? '').toString();

      const oldValue = lastValues[elId];
      if (oldValue === undefined) {
        // first-load: just set it, no animation
        el.textContent = newValue;
      }
      else if (newValue !== oldValue) {
        // only animate when it really changed
        el.classList.add('fade-out');
        setTimeout(() => {
          el.textContent = newValue;
          el.classList.remove('fade-out');
        }, 400); // match your CSS transition
      }
      // update our stored value
      lastValues[elId] = newValue;
    });
  }
  catch (err) {
    console.error('Error loading sheet data', err);
  }
}

// initial load + polling
fetchCounters();
setInterval(fetchCounters, 10000);
