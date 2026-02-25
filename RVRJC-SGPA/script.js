/**
 * ============================================================
 *  RVRJC R24 SGPA & CGPA Calculator — Main Logic (script.js)
 * ============================================================
 *
 *  SGPA = Σ(Credit × Grade Point) / Σ(Credits)
 *  CGPA = Average of all semester SGPAs
 *  Percentage = (CGPA − 0.50) × 10
 *
 *  Zero-credit (mandatory) courses are excluded from SGPA.
 * ============================================================
 */

// ── DOM References ──────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    sidebar: $("#sidebar"),
    sidebarOverlay: $("#sidebarOverlay"),
    sidebarClose: $("#sidebarClose"),
    hamburger: $("#hamburger"),
    themeToggle: $("#themeToggle"),
    themeIcon: $("#themeIcon"),

    branchSelect: $("#branchSelect"),
    yearSelect: $("#yearSelect"),
    semesterSelect: $("#semesterSelect"),
    studentName: $("#studentName"),
    rollNumber: $("#rollNumber"),

    subjectTableCard: $("#subjectTableCard"),
    subjectTableBody: $("#subjectTableBody"),
    resultsDashboard: $("#resultsDashboard"),
    validationMsg: $("#validationMsg"),

    totalCredits: $("#totalCredits"),
    earnedCredits: $("#earnedCredits"),
    sgpaValue: $("#sgpaValue"),
    cgpaValue: $("#cgpaValue"),
    percentageValue: $("#percentageValue"),
    classValue: $("#classValue"),

    resetSemBtn: $("#resetSemBtn"),
    saveSemBtn: $("#saveSemBtn"),
    printBtn: $("#printBtn"),
    downloadPdfBtn: $("#downloadPdfBtn"),
    clearHistoryBtn: $("#clearHistoryBtn"),

    historyContainer: $("#historyContainer"),
    cgpaChart: $("#cgpaChart"),

    // AI tools
    predictBtn: $("#predictBtn"),
    predictionResult: $("#predictionResult"),
    reqSgpaBtn: $("#reqSgpaBtn"),
    reqSgpaResult: $("#reqSgpaResult"),
    simBacklogBtn: $("#simBacklogBtn"),
    simBacklogResult: $("#simBacklogResult"),

    pdfReport: $("#pdfReport"),
    pdfBody: $("#pdfBody"),
};

// ── State ───────────────────────────────────────────────────
let chartInstance = null;
const STORAGE_KEY = "rvrjc_r24_history";

// ── Initialize ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    populateBranches();
    bindEvents();
    loadHistory();
    renderHistorySection();
    renderChart();
});

// ============================================================
//  THEME (Dark / Light)
// ============================================================

function initTheme() {
    const saved = localStorage.getItem("rvrjc_theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeUI(saved);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("rvrjc_theme", next);
    updateThemeUI(next);
    // Rebuild chart with new theme colours
    renderChart();
}

function updateThemeUI(theme) {
    DOM.themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
    DOM.themeToggle.querySelector(".nav-label").textContent =
        theme === "dark" ? "Dark Mode" : "Light Mode";
}

// ============================================================
//  SIDEBAR & NAVIGATION
// ============================================================

function openSidebar() {
    DOM.sidebar.classList.add("open");
    DOM.sidebarOverlay.classList.add("active");
}

function closeSidebar() {
    DOM.sidebar.classList.remove("open");
    DOM.sidebarOverlay.classList.remove("active");
}

function switchSection(sectionId) {
    $$(".content-section").forEach((s) => s.classList.remove("active"));
    $(`#section-${sectionId}`).classList.add("active");

    $$(".nav-item").forEach((n) => n.classList.remove("active"));
    $(`.nav-item[data-section="${sectionId}"]`).classList.add("active");

    // Refresh chart when switching to progress section
    if (sectionId === "progress") renderChart();
    if (sectionId === "history") renderHistorySection();
    if (sectionId === "ai-tools") autoFillAITools();

    closeSidebar();
}

// ============================================================
//  POPULATE DROPDOWNS
// ============================================================

function populateBranches() {
    BRANCHES.forEach((b) => {
        const opt = document.createElement("option");
        opt.value = b;
        opt.textContent = b;
        DOM.branchSelect.appendChild(opt);
    });
}

function updateSemesterDropdown() {
    const year = DOM.yearSelect.value;
    DOM.semesterSelect.innerHTML = '<option value="">— Select Semester —</option>';
    if (!year) return;

    const y = parseInt(year);
    const sem1 = (y - 1) * 2 + 1;
    const sem2 = sem1 + 1;

    [sem1, sem2].forEach((s) => {
        if (s <= 8) {
            const opt = document.createElement("option");
            opt.value = s;
            opt.textContent = `Semester ${toRoman(s)}`;
            DOM.semesterSelect.appendChild(opt);
        }
    });
}

function toRoman(n) {
    const map = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    return map[n] || n;
}

// ============================================================
//  LOAD SUBJECTS INTO TABLE
// ============================================================

function loadSubjects() {
    const branch = DOM.branchSelect.value;
    const sem = DOM.semesterSelect.value;

    if (!branch || !sem) {
        DOM.subjectTableCard.style.display = "none";
        DOM.resultsDashboard.style.display = "none";
        return;
    }

    const key = `${branch}__${sem}`;
    const subjects = CURRICULUM[key];

    if (!subjects || subjects.length === 0) {
        DOM.subjectTableBody.innerHTML =
            '<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-muted);">No subjects found for this selection.</td></tr>';
        DOM.subjectTableCard.style.display = "block";
        DOM.resultsDashboard.style.display = "none";
        return;
    }

    DOM.subjectTableBody.innerHTML = "";

    subjects.forEach((subj, i) => {
        const isMandatoryZero = subj.credits === 0;
        const tr = document.createElement("tr");
        if (isMandatoryZero) tr.classList.add("mandatory-row");

        // Badge class for type
        const badgeClass = `badge-${subj.type || "theory"}`;
        const typeLabel = (subj.type || "theory").charAt(0).toUpperCase() + (subj.type || "theory").slice(1);

        tr.innerHTML = `
      <td>${i + 1}</td>
      <td class="code-cell">${subj.code}</td>
      <td>${subj.name}</td>
      <td><span class="badge ${badgeClass}">${typeLabel}</span></td>
      <td>${subj.credits}</td>
      <td>
        ${isMandatoryZero
                ? '<span style="color:var(--text-muted);font-size:0.8rem;">N/A</span>'
                : `<select class="grade-select" data-index="${i}" data-credits="${subj.credits}">
              <option value="">—</option>
              <option value="A+">A+ (10)</option>
              <option value="A">A (9)</option>
              <option value="B">B (8)</option>
              <option value="C">C (7)</option>
              <option value="D">D (6)</option>
              <option value="E">E (5)</option>
              <option value="F">F (0)</option>
              <option value="W">W (0)</option>
              <option value="Ab">Ab (0)</option>
            </select>`
            }
      </td>
      <td class="gp-cell" id="gp-${i}">${isMandatoryZero ? "—" : ""}</td>
      <td class="cxgp-cell" id="cxgp-${i}">${isMandatoryZero ? "—" : ""}</td>
    `;

        DOM.subjectTableBody.appendChild(tr);
    });

    // Show cards
    DOM.subjectTableCard.style.display = "block";
    DOM.resultsDashboard.style.display = "block";

    // Bind grade change events
    $$(".grade-select").forEach((sel) => {
        sel.addEventListener("change", onGradeChange);
    });

    // Reset results
    recalculate();
    hideValidation();
}

// ============================================================
//  REAL-TIME SGPA CALCULATION
// ============================================================

/**
 * Called whenever any grade dropdown changes.
 * Recalculates GP, C×GP columns and the SGPA / dashboard stats.
 */
function onGradeChange() {
    recalculate();
}

function recalculate() {
    let totalCredits = 0;
    let earnedCredits = 0;
    let sumCxGP = 0;
    let filledCount = 0;

    $$(".grade-select").forEach((sel) => {
        const idx = sel.dataset.index;
        const credits = parseFloat(sel.dataset.credits);
        const grade = sel.value;
        const gpCell = $(`#gp-${idx}`);
        const cxgpCell = $(`#cxgp-${idx}`);
        const row = sel.closest("tr");

        totalCredits += credits;

        // Reset row styling
        row.classList.remove("row-fail", "row-pass", "row-top");

        if (grade === "") {
            gpCell.textContent = "";
            cxgpCell.textContent = "";
            return;
        }

        filledCount++;
        const gp = GRADES[grade];
        const cxgp = credits * gp;

        gpCell.textContent = gp;
        cxgpCell.textContent = cxgp.toFixed(1);

        sumCxGP += cxgp;
        if (gp > 0) earnedCredits += credits;

        // Row color feedback
        if (gp === 0) row.classList.add("row-fail");
        else if (gp >= 9) row.classList.add("row-top");
        else row.classList.add("row-pass");
    });

    // SGPA = Σ(C × GP) / Σ(Credits)
    const sgpa = totalCredits > 0 ? sumCxGP / totalCredits : 0;

    // Update dashboard
    DOM.totalCredits.textContent = totalCredits;
    DOM.earnedCredits.textContent = earnedCredits;
    DOM.sgpaValue.textContent = sgpa.toFixed(2);

    // Calculate CGPA from history + current semester (only if at least one grade is filled)
    const history = loadHistory();
    const currentSem = DOM.semesterSelect.value ? parseInt(DOM.semesterSelect.value) : null;
    const currentBranch = DOM.branchSelect.value;

    // Filter out the currently-editing semester from history to avoid double-counting
    const otherSgpas = history
        .filter((h) => !(h.branch === currentBranch && h.semester === currentSem))
        .map((h) => h.sgpa);

    const sgpas = [...otherSgpas];
    if (filledCount > 0) sgpas.push(sgpa);

    const cgpa = sgpas.length > 0 ? sgpas.reduce((a, b) => a + b, 0) / sgpas.length : 0;

    DOM.cgpaValue.textContent = cgpa.toFixed(2);

    // Percentage = (CGPA − 0.50) × 10
    const percentage = cgpa > 0 ? (cgpa - 0.5) * 10 : 0;
    DOM.percentageValue.textContent = percentage.toFixed(2) + "%";

    // Class prediction
    DOM.classValue.textContent = getClassification(cgpa);

    // Color the class value
    const cls = DOM.classValue;
    cls.style.color = "";
    if (cgpa >= 7.5) cls.style.color = "var(--success)";
    else if (cgpa >= 6.5) cls.style.color = "var(--info)";
    else if (cgpa >= 5.5) cls.style.color = "var(--warning)";
    else if (cgpa >= 5.0) cls.style.color = "var(--text-secondary)";
    else if (cgpa > 0) cls.style.color = "var(--danger)";
}

function getClassification(cgpa) {
    if (cgpa >= 7.5) return "Distinction";
    if (cgpa >= 6.5) return "First Class";
    if (cgpa >= 5.5) return "Second Class";
    if (cgpa >= 5.0) return "Pass";
    if (cgpa > 0) return "Fail";
    return "—";
}

// ============================================================
//  VALIDATION
// ============================================================

function validateAllGrades() {
    const selects = $$(".grade-select");
    const missing = [];
    selects.forEach((sel) => {
        if (sel.value === "") {
            const idx = parseInt(sel.dataset.index);
            const branch = DOM.branchSelect.value;
            const sem = DOM.semesterSelect.value;
            const subjects = CURRICULUM[`${branch}__${sem}`] || [];
            if (subjects[idx]) missing.push(subjects[idx].name);
        }
    });

    if (missing.length > 0) {
        showValidation(
            `⚠️ Please select grades for: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` and ${missing.length - 3} more` : ""}`,
            "error"
        );
        return false;
    }

    showValidation("✅ All grades filled. Results are ready!", "success");
    return true;
}

function showValidation(msg, type) {
    DOM.validationMsg.textContent = msg;
    DOM.validationMsg.className = `validation-msg show ${type}`;
}

function hideValidation() {
    DOM.validationMsg.className = "validation-msg";
}

// ============================================================
//  SEMESTER SAVE / HISTORY (LocalStorage)
// ============================================================

function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveHistory(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function saveSemester() {
    if (!validateAllGrades()) return;

    const branch = DOM.branchSelect.value;
    const sem = DOM.semesterSelect.value;
    const name = DOM.studentName.value.trim();
    const roll = DOM.rollNumber.value.trim();

    if (!branch || !sem) {
        showValidation("⚠️ Please select branch and semester first.", "error");
        return;
    }

    // Collect grades
    const grades = {};
    $$(".grade-select").forEach((sel) => {
        const idx = sel.dataset.index;
        grades[idx] = sel.value;
    });

    const sgpa = parseFloat(DOM.sgpaValue.textContent);

    const entry = {
        id: Date.now(),
        branch,
        semester: parseInt(sem),
        studentName: name,
        rollNumber: roll,
        sgpa,
        grades,
        totalCredits: parseFloat(DOM.totalCredits.textContent),
        earnedCredits: parseFloat(DOM.earnedCredits.textContent),
        savedAt: new Date().toISOString(),
    };

    const history = loadHistory();

    // Replace if same branch + semester already exists
    const existingIdx = history.findIndex(
        (h) => h.branch === branch && h.semester === parseInt(sem)
    );
    if (existingIdx !== -1) {
        history[existingIdx] = entry;
    } else {
        history.push(entry);
    }

    // Sort by semester
    history.sort((a, b) => a.semester - b.semester);

    saveHistory(history);
    showValidation("✅ Semester saved successfully!", "success");

    // Recalculate with updated history
    recalculate();
}

function deleteSemester(id) {
    let history = loadHistory();
    history = history.filter((h) => h.id !== id);
    saveHistory(history);
    renderHistorySection();
    recalculate();
    renderChart();
}

function renderHistorySection() {
    const history = loadHistory();
    const container = DOM.historyContainer;

    if (history.length === 0) {
        container.innerHTML =
            '<p class="empty-state">No semesters saved yet. Calculate &amp; save a semester to see it here.</p>';
        return;
    }

    container.innerHTML = history
        .map(
            (h) => `
    <div class="history-item">
      <div class="history-item-info">
        <div class="history-item-title">${h.branch} — Semester ${toRoman(h.semester)}</div>
        <div class="history-item-meta">
          ${h.studentName ? h.studentName + " | " : ""}${h.rollNumber ? h.rollNumber + " | " : ""}
          Credits: ${h.totalCredits} | Earned: ${h.earnedCredits} |
          Saved: ${new Date(h.savedAt).toLocaleDateString()}
        </div>
      </div>
      <div class="history-item-sgpa">${h.sgpa.toFixed(2)}</div>
      <div class="history-item-actions">
        <button class="btn btn-ghost btn-sm" onclick="loadSemesterFromHistory(${h.id})" title="Load">📂</button>
        <button class="btn btn-danger btn-sm" onclick="deleteSemester(${h.id})" title="Delete">🗑️</button>
      </div>
    </div>
  `
        )
        .join("");
}

function loadSemesterFromHistory(id) {
    const history = loadHistory();
    const entry = history.find((h) => h.id === id);
    if (!entry) return;

    // Set dropdowns
    DOM.branchSelect.value = entry.branch;
    DOM.studentName.value = entry.studentName || "";
    DOM.rollNumber.value = entry.rollNumber || "";

    // Determine year from semester
    const year = Math.ceil(entry.semester / 2);
    DOM.yearSelect.value = year;
    updateSemesterDropdown();
    DOM.semesterSelect.value = entry.semester;

    // Load subjects
    loadSubjects();

    // Restore grades
    setTimeout(() => {
        $$(".grade-select").forEach((sel) => {
            const idx = sel.dataset.index;
            if (entry.grades[idx]) {
                sel.value = entry.grades[idx];
            }
        });
        recalculate();
    }, 50);

    // Switch to calculator section
    switchSection("calculator");
}

function clearAllHistory() {
    if (confirm("Are you sure you want to clear all saved semester data? This cannot be undone.")) {
        localStorage.removeItem(STORAGE_KEY);
        renderHistorySection();
        recalculate();
        renderChart();
    }
}

// ============================================================
//  RESET SEMESTER
// ============================================================

function resetSemester() {
    $$(".grade-select").forEach((sel) => (sel.value = ""));
    recalculate();
    hideValidation();
}

// ============================================================
//  PROGRESS CHART (Chart.js)
// ============================================================

function renderChart() {
    const history = loadHistory();

    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    const ctx = DOM.cgpaChart.getContext("2d");

    const labels = history.map((h) => `Sem ${toRoman(h.semester)}`);
    const sgpaData = history.map((h) => h.sgpa);

    // Calculate running CGPA
    const cgpaData = [];
    let runningSum = 0;
    sgpaData.forEach((s, i) => {
        runningSum += s;
        cgpaData.push(parseFloat((runningSum / (i + 1)).toFixed(2)));
    });

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
    const textColor = isDark ? "#94a3b8" : "#475569";

    if (history.length === 0) {
        // Show empty state on canvas
        ctx.clearRect(0, 0, DOM.cgpaChart.width, DOM.cgpaChart.height);
        ctx.font = "14px Inter, sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "center";
        ctx.fillText(
            "Save semester results to see your progress chart",
            DOM.cgpaChart.width / 2,
            DOM.cgpaChart.height / 2
        );
        return;
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "SGPA",
                    data: sgpaData,
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99,102,241,0.1)",
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: "#6366f1",
                    pointBorderColor: isDark ? "#0a0e1a" : "#fff",
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: true,
                },
                {
                    label: "CGPA",
                    data: cgpaData,
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.08)",
                    borderWidth: 3,
                    pointRadius: 6,
                    pointBackgroundColor: "#22c55e",
                    pointBorderColor: isDark ? "#0a0e1a" : "#fff",
                    pointBorderWidth: 2,
                    tension: 0.3,
                    fill: true,
                    borderDash: [6, 3],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: { intersect: false, mode: "index" },
            plugins: {
                legend: {
                    labels: { color: textColor, font: { family: "Inter", weight: "600" }, padding: 16 },
                },
                tooltip: {
                    backgroundColor: isDark ? "#1e293b" : "#fff",
                    titleColor: isDark ? "#f1f5f9" : "#0f172a",
                    bodyColor: isDark ? "#94a3b8" : "#475569",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: { family: "Inter", weight: "700" },
                    bodyFont: { family: "JetBrains Mono" },
                },
            },
            scales: {
                y: {
                    min: 0,
                    max: 10,
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: "Inter" }, stepSize: 1 },
                },
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: "Inter" } },
                },
            },
        },
    });
}

// ============================================================
//  PDF DOWNLOAD
// ============================================================

function downloadPDF() {
    if (!DOM.branchSelect.value || !DOM.semesterSelect.value) {
        alert("Please select a branch and semester, and fill in grades before downloading.");
        return;
    }

    const branch = DOM.branchSelect.value;
    const sem = DOM.semesterSelect.value;
    const name = DOM.studentName.value.trim() || "Student";
    const roll = DOM.rollNumber.value.trim() || "N/A";

    // Build PDF content
    let html = `
    <p><strong>Student:</strong> ${name} &nbsp;&nbsp; <strong>Roll No:</strong> ${roll}</p>
    <p><strong>Branch:</strong> ${branch} &nbsp;&nbsp; <strong>Semester:</strong> ${toRoman(parseInt(sem))} &nbsp;&nbsp; <strong>Regulation:</strong> R24</p>
    <table>
      <thead>
        <tr><th>#</th><th>Code</th><th>Subject</th><th>Credits</th><th>Grade</th><th>GP</th><th>C×GP</th></tr>
      </thead>
      <tbody>
  `;

    const subjects = CURRICULUM[`${branch}__${sem}`] || [];
    const gradeSelects = $$(".grade-select");
    let sNo = 0;

    subjects.forEach((subj, i) => {
        if (subj.credits === 0) return; // skip mandatory zero-credit
        sNo++;
        const sel = [...gradeSelects].find((s) => parseInt(s.dataset.index) === i);
        const grade = sel ? sel.value : "—";
        const gp = grade && GRADES[grade] !== undefined ? GRADES[grade] : "—";
        const cxgp = grade && gp !== "—" ? (subj.credits * gp).toFixed(1) : "—";

        html += `<tr><td>${sNo}</td><td style="font-size:0.75rem;">${subj.code}</td><td>${subj.name}</td><td>${subj.credits}</td><td>${grade || "—"}</td><td>${gp}</td><td>${cxgp}</td></tr>`;
    });

    html += `</tbody></table>`;

    html += `
    <div class="pdf-stats">
      <strong>Total Credits:</strong> ${DOM.totalCredits.textContent} &nbsp;|&nbsp;
      <strong>Earned Credits:</strong> ${DOM.earnedCredits.textContent}<br/>
      <strong>SGPA:</strong> ${DOM.sgpaValue.textContent} &nbsp;|&nbsp;
      <strong>CGPA:</strong> ${DOM.cgpaValue.textContent} &nbsp;|&nbsp;
      <strong>Percentage:</strong> ${DOM.percentageValue.textContent}<br/>
      <strong>Classification:</strong> ${DOM.classValue.textContent}
    </div>
  `;

    DOM.pdfBody.innerHTML = html;
    DOM.pdfReport.style.display = "block";

    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `RVRJC_R24_${branch.replace(/[^a-zA-Z0-9]/g, "_")}_Sem${sem}_Report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
        .set(opt)
        .from(DOM.pdfReport)
        .save()
        .then(() => {
            DOM.pdfReport.style.display = "none";
        });
}

// ============================================================
//  PRINT
// ============================================================

function printResult() {
    window.print();
}

// ============================================================
//  AI TOOLS
// ============================================================

// ── GPA Prediction ──────────────────────────────────────
function predictGPA() {
    const currentCgpa = parseFloat($("#currentCgpaInput").value);
    const completed = parseInt($("#completedSems").value);
    const target = parseFloat($("#targetCgpa").value);

    if (isNaN(currentCgpa) || isNaN(completed) || isNaN(target)) {
        DOM.predictionResult.innerHTML = "⚠️ Please fill in all fields.";
        DOM.predictionResult.classList.add("show");
        return;
    }

    const totalSems = 8;
    const remaining = totalSems - completed;

    if (remaining <= 0) {
        DOM.predictionResult.innerHTML = `
      Your final CGPA is <span class="highlight">${currentCgpa.toFixed(2)}</span>.<br/>
      Classification: <strong>${getClassification(currentCgpa)}</strong>.<br/>
      Percentage: <strong>${((currentCgpa - 0.5) * 10).toFixed(2)}%</strong>.
    `;
        DOM.predictionResult.classList.add("show");
        return;
    }

    // Required average SGPA in remaining semesters
    const requiredAvgSGPA = ((target * totalSems) - (currentCgpa * completed)) / remaining;

    let resultHTML = `
    <strong>📊 Analysis:</strong><br/>
    Currently: <span class="highlight">${currentCgpa.toFixed(2)}</span> CGPA over ${completed} semester(s).<br/>
    Remaining: ${remaining} semester(s).<br/><br/>
  `;

    if (requiredAvgSGPA > 10) {
        resultHTML += `<span class="warn-text">❌ Target CGPA of ${target.toFixed(2)} is NOT achievable.</span><br/>
    Maximum possible CGPA: <span class="highlight">${(((currentCgpa * completed) + (10 * remaining)) / totalSems).toFixed(2)}</span> (if you score 10.0 in every remaining semester).`;
    } else if (requiredAvgSGPA < 0) {
        resultHTML += `<span class="success-text">✅ You've already exceeded your target!</span><br/>
    Even with 0.00 SGPA in remaining semesters, your CGPA would be: <span class="highlight">${((currentCgpa * completed) / totalSems).toFixed(2)}</span>.`;
    } else {
        resultHTML += `To achieve <span class="highlight">${target.toFixed(2)}</span> CGPA, you need an average SGPA of <span class="highlight">${requiredAvgSGPA.toFixed(2)}</span> in each of the remaining ${remaining} semester(s).<br/><br/>`;
        if (requiredAvgSGPA >= 9.5) resultHTML += `<span class="warn-text">⚡ This is extremely challenging. Aim for A+ in most subjects.</span>`;
        else if (requiredAvgSGPA >= 8.5) resultHTML += `<span class="warn-text">💪 Challenging but achievable with consistent effort.</span>`;
        else resultHTML += `<span class="success-text">✅ Very achievable! Keep up the good work.</span>`;
    }

    // Predicted CGPA if current trend continues
    const predictedFinal = currentCgpa; // Same performance assumed
    resultHTML += `<br/><br/><strong>🔮 If you maintain current performance:</strong><br/>
  Predicted Final CGPA: <span class="highlight">${predictedFinal.toFixed(2)}</span> | 
  Percentage: <strong>${((predictedFinal - 0.5) * 10).toFixed(2)}%</strong> | 
  Class: <strong>${getClassification(predictedFinal)}</strong>`;

    DOM.predictionResult.innerHTML = resultHTML;
    DOM.predictionResult.classList.add("show");
}

// ── Required SGPA Calculator ────────────────────────────
function calcRequiredSGPA() {
    const currentCgpa = parseFloat($("#reqCurrentCgpa").value);
    const completed = parseInt($("#reqCompletedSems").value);
    const target = parseFloat($("#reqTargetCgpa").value);

    if (isNaN(currentCgpa) || isNaN(completed) || isNaN(target)) {
        DOM.reqSgpaResult.innerHTML = "⚠️ Please fill in all fields.";
        DOM.reqSgpaResult.classList.add("show");
        return;
    }

    const totalSems = 8;
    const remaining = totalSems - completed;

    if (remaining <= 0) {
        DOM.reqSgpaResult.innerHTML = "All semesters are already completed.";
        DOM.reqSgpaResult.classList.add("show");
        return;
    }

    let html = `<strong>🎯 Required SGPA Breakdown:</strong><br/><br/>`;

    // Show required SGPA for each remaining semester individually
    const requiredTotal = (target * totalSems) - (currentCgpa * completed);
    const requiredPerSem = requiredTotal / remaining;

    if (requiredPerSem > 10) {
        html += `<span class="warn-text">❌ Target CGPA of ${target.toFixed(2)} is not achievable with ${remaining} remaining semester(s).</span><br/>`;
        const maxCgpa = ((currentCgpa * completed) + (10 * remaining)) / totalSems;
        html += `Maximum achievable CGPA: <span class="highlight">${maxCgpa.toFixed(2)}</span>`;
    } else if (requiredPerSem < 0) {
        html += `<span class="success-text">✅ Already achieved! Your current CGPA exceeds the target.</span>`;
    } else {
        html += `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:0.5rem;">
      <tr style="border-bottom:1px solid var(--border-glass);">
        <th style="text-align:left;padding:0.4rem;">Semester</th>
        <th style="text-align:center;padding:0.4rem;">Required SGPA</th>
        <th style="text-align:center;padding:0.4rem;">Resulting CGPA</th>
      </tr>`;

        let runSum = currentCgpa * completed;
        for (let i = 1; i <= remaining; i++) {
            const semNum = completed + i;
            runSum += requiredPerSem;
            const resultingCgpa = runSum / (completed + i);
            html += `<tr style="border-bottom:1px solid var(--border-glass);">
        <td style="padding:0.4rem;">Semester ${toRoman(semNum)}</td>
        <td style="text-align:center;padding:0.4rem;"><span class="highlight">${requiredPerSem.toFixed(2)}</span></td>
        <td style="text-align:center;padding:0.4rem;">${resultingCgpa.toFixed(2)}</td>
      </tr>`;
        }

        html += `</table>`;
        html += `<br/><em style="color:var(--text-muted);font-size:0.8rem;">* Assumes equal SGPA in each remaining semester.</em>`;
    }

    DOM.reqSgpaResult.innerHTML = html;
    DOM.reqSgpaResult.classList.add("show");
}

// ── Backlog Simulation ──────────────────────────────────
function simulateBacklog() {
    const currentCgpa = parseFloat($("#simCurrentCgpa").value);
    const totalCreds = parseFloat($("#simTotalCredits").value);
    const backlogCreds = parseFloat($("#simBacklogCredits").value);
    const clearGP = parseFloat($("#simClearGrade").value);

    if (isNaN(currentCgpa) || isNaN(totalCreds) || isNaN(backlogCreds) || isNaN(clearGP)) {
        DOM.simBacklogResult.innerHTML = "⚠️ Please fill in all fields.";
        DOM.simBacklogResult.classList.add("show");
        return;
    }

    // Current total grade points = CGPA × total credits
    // When backlog had F (0), the credits were counted with 0 GP
    // When cleared, the backlog credits get GP = clearGP
    // New sum = old sum + (backlogCredits × clearGP) - (backlogCredits × 0)

    const currentTotalGP = currentCgpa * totalCreds;
    const newTotalGP = currentTotalGP + (backlogCreds * clearGP);
    const newCgpa = newTotalGP / totalCreds;

    const improvement = newCgpa - currentCgpa;

    let html = `
    <strong>⚠️ Backlog Impact Analysis:</strong><br/><br/>
    <strong>Current State:</strong><br/>
    CGPA: <span class="highlight">${currentCgpa.toFixed(2)}</span> | 
    Total Credits: ${totalCreds} | 
    Classification: ${getClassification(currentCgpa)}<br/><br/>
    <strong>After Clearing ${backlogCreds} credit(s) with grade point ${clearGP}:</strong><br/>
    New CGPA: <span class="highlight">${newCgpa.toFixed(2)}</span> | 
    Improvement: <span class="success-text">+${improvement.toFixed(3)}</span><br/>
    New Percentage: <strong>${((newCgpa - 0.5) * 10).toFixed(2)}%</strong> | 
    New Classification: <strong>${getClassification(newCgpa)}</strong><br/><br/>
  `;

    // Show impact for different grades
    html += `<strong>📊 Impact with Different Grades:</strong><br/>
  <table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:0.5rem;">
    <tr style="border-bottom:1px solid var(--border-glass);">
      <th style="text-align:left;padding:0.4rem;">Grade</th>
      <th style="text-align:center;padding:0.4rem;">GP</th>
      <th style="text-align:center;padding:0.4rem;">New CGPA</th>
      <th style="text-align:center;padding:0.4rem;">Δ</th>
    </tr>`;

    [["E", 5], ["D", 6], ["C", 7], ["B", 8], ["A", 9], ["A+", 10]].forEach(([grade, gp]) => {
        const nGP = currentTotalGP + (backlogCreds * gp);
        const nCgpa = nGP / totalCreds;
        const delta = nCgpa - currentCgpa;
        html += `<tr style="border-bottom:1px solid var(--border-glass);">
      <td style="padding:0.4rem;">${grade}</td>
      <td style="text-align:center;padding:0.4rem;">${gp}</td>
      <td style="text-align:center;padding:0.4rem;">${nCgpa.toFixed(3)}</td>
      <td style="text-align:center;padding:0.4rem;color:var(--success);">+${delta.toFixed(3)}</td>
    </tr>`;
    });

    html += `</table>`;

    DOM.simBacklogResult.innerHTML = html;
    DOM.simBacklogResult.classList.add("show");
}

// ============================================================
//  EVENT BINDINGS
// ============================================================

function bindEvents() {
    // Sidebar
    DOM.hamburger.addEventListener("click", openSidebar);
    DOM.sidebarClose.addEventListener("click", closeSidebar);
    DOM.sidebarOverlay.addEventListener("click", closeSidebar);

    // Nav items
    $$(".nav-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });

    // Theme
    DOM.themeToggle.addEventListener("click", toggleTheme);

    // Dropdowns
    DOM.branchSelect.addEventListener("change", () => {
        loadSubjects();
    });

    DOM.yearSelect.addEventListener("change", () => {
        updateSemesterDropdown();
        DOM.subjectTableCard.style.display = "none";
        DOM.resultsDashboard.style.display = "none";
    });

    DOM.semesterSelect.addEventListener("change", () => {
        loadSubjects();
    });

    // Buttons
    DOM.resetSemBtn.addEventListener("click", resetSemester);
    DOM.saveSemBtn.addEventListener("click", saveSemester);
    DOM.printBtn.addEventListener("click", printResult);
    DOM.downloadPdfBtn.addEventListener("click", downloadPDF);
    DOM.clearHistoryBtn.addEventListener("click", clearAllHistory);

    // AI tools
    DOM.predictBtn.addEventListener("click", predictGPA);
    DOM.reqSgpaBtn.addEventListener("click", calcRequiredSGPA);
    DOM.simBacklogBtn.addEventListener("click", simulateBacklog);

    // Keyboard shortcut: Ctrl+S to save semester
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            if (DOM.branchSelect.value && DOM.semesterSelect.value) {
                saveSemester();
            }
        }
    });
}

// ============================================================
//  AUTO-FILL AI TOOLS from saved history
// ============================================================

function autoFillAITools() {
    const history = loadHistory();
    if (history.length === 0) return;

    // Calculate CGPA from history
    const sgpas = history.map((h) => h.sgpa);
    const cgpa = sgpas.reduce((a, b) => a + b, 0) / sgpas.length;
    const completed = history.length;
    const totalCredits = history.reduce((sum, h) => sum + h.totalCredits, 0);

    // Fill GPA Prediction fields
    const curCgpaInput = $("#currentCgpaInput");
    const compSemsInput = $("#completedSems");
    if (!curCgpaInput.value) curCgpaInput.value = cgpa.toFixed(2);
    if (!compSemsInput.value) compSemsInput.value = completed;

    // Fill Required SGPA fields
    const reqCgpa = $("#reqCurrentCgpa");
    const reqSems = $("#reqCompletedSems");
    if (!reqCgpa.value) reqCgpa.value = cgpa.toFixed(2);
    if (!reqSems.value) reqSems.value = completed;

    // Fill Backlog Simulation fields
    const simCgpa = $("#simCurrentCgpa");
    const simCreds = $("#simTotalCredits");
    if (!simCgpa.value) simCgpa.value = cgpa.toFixed(2);
    if (!simCreds.value) simCreds.value = totalCredits;
}
