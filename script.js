// ========== CONFIGURATION ==========
const schoolConfig = {
    schoolName: "The National Educators School System 335 W/B",
    session: "2024-2025",
    examType: "Annual Exam",
    passPercentage: 40
    // examDate is now auto (today) or pulled from the Sheet
};

// Subject list (order must match columns in Google Sheet)
const SUBJECTS = [
    { name: "English",        total: 100 },
    { name: "Urdu",           total: 100 },
    { name: "Math",           total: 100 },
    { name: "Science",        total: 100 },
    { name: "Islamic Studies",total: 70  },
    { name: "Reading Skills", total: 15  },
    { name: "Nazra Quran",    total: 15  }
];

let students = [];
let currentStudent = null;

// Fallback static data (used if the API fails)
const fallbackStudents = [
    { roll: "01", name: "Ali Raza",   father: "Ahmed Raza",  class: "8th", marks: [85,78,92,88,65,14,13], remarks: "Excellent performance!" },
    { roll: "02", name: "Sara Khan",  father: "Kamran Khan", class: "8th", marks: [78,82,79,85,60,12,12], remarks: "Good, keep it up." },
    { roll: "03", name: "Usman Ali",  father: "Rashid Ali",  class: "8th", marks: [45,38,52,48,35,8,9],   remarks: "Needs improvement." }
];

// ========== AUTO DATE ==========
function getTodayFormatted() {
    return new Date().toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" });
}

// ========== HELPER FUNCTIONS ==========
function getPassMark(total) {
    return Math.ceil((schoolConfig.passPercentage / 100) * total);
}

function getGrade(percentage) {
    if (percentage >= 90) return { grade: "A+", class: "grade-A" };
    if (percentage >= 80) return { grade: "A",  class: "grade-A" };
    if (percentage >= 70) return { grade: "B+", class: "grade-B" };
    if (percentage >= 60) return { grade: "B",  class: "grade-B" };
    if (percentage >= 50) return { grade: "C",  class: "grade-C" };
    if (percentage >= 40) return { grade: "D",  class: "grade-D" };
    return { grade: "F", class: "grade-F" };
}

function ordinal(n) {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function computePosition(student, classStudents) {
    const totals = classStudents
        .map(s => ({ roll: s.roll, total: s.marks.reduce((a,b) => a+b, 0) }))
        .sort((a,b) => b.total - a.total);
    const pos = totals.findIndex(s => s.roll === student.roll) + 1;
    return pos;
}

function getClassList() {
    return [...new Set(students.map(s => s.class))].sort();
}

// ========== DARK MODE ==========
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeBtn').textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function initTheme() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeBtn').textContent = saved === 'dark' ? '☀️' : '🌙';
}

// ========== SEARCH HISTORY ==========
const HISTORY_KEY = 'resultPortalHistory';
const MAX_HISTORY = 6;

function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
    catch { return []; }
}

function saveToHistory(cls, roll) {
    let hist = getHistory();
    // Remove duplicate
    hist = hist.filter(h => !(h.cls === cls && h.roll === roll));
    hist.unshift({ cls, roll });
    if (hist.length > MAX_HISTORY) hist = hist.slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    renderHistory();
}

function removeFromHistory(cls, roll) {
    let hist = getHistory().filter(h => !(h.cls === cls && h.roll === roll));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    renderHistory();
}

function renderHistory() {
    const hist = getHistory();
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (hist.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    list.innerHTML = hist.map(h => `
        <span class="history-chip" onclick="quickSearch('${h.cls}','${h.roll}')">
            📌 ${h.cls} · Roll ${h.roll}
            <span class="del-btn" onclick="event.stopPropagation();removeFromHistory('${h.cls}','${h.roll}')">✕</span>
        </span>
    `).join('');
}

function quickSearch(cls, roll) {
    document.getElementById('lkp_class').value = cls;
    document.getElementById('lkp_roll').value = roll;
    doLookup();
}

// ========== CLASS DROPDOWN ==========
function populateClassDropdown() {
    const sel = document.getElementById('lkp_class');
    const classes = getClassList();
    sel.innerHTML = '<option value="">— Select Class —</option>' +
        classes.map(c => `<option value="${c}">${c}</option>`).join('');
    // Restore last used class
    const lastClass = localStorage.getItem('lastClass');
    if (lastClass && classes.includes(lastClass)) sel.value = lastClass;
}

// ========== LEADERBOARD ==========
function populateLeaderboardFilter() {
    const sel = document.getElementById('lbClassFilter');
    sel.innerHTML = '<option value="">All Classes</option>' +
        getClassList().map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderLeaderboard() {
    const filter = document.getElementById('lbClassFilter').value;
    const filtered = filter ? students.filter(s => s.class === filter) : students;

    // Sort by total marks
    const ranked = filtered
        .map(s => ({
            ...s,
            total: s.marks.reduce((a,b) => a+b, 0),
            grandTotal: SUBJECTS.reduce((a,s) => a + s.total, 0)
        }))
        .sort((a,b) => b.total - a.total)
        .slice(0, 10);

    const body = document.getElementById('lbBody');
    body.innerHTML = ranked.map((s, i) => {
        const pct = ((s.total / s.grandTotal) * 100).toFixed(1);
        const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
        return `
            <div class="lb-row" style="animation-delay:${i * 0.05}s">
                <div class="lb-rank ${rankClass}">${medal}</div>
                <div class="lb-info">
                    <div class="lb-name">${s.name}</div>
                    <div class="lb-meta">Class ${s.class} · Roll ${s.roll} · ${s.father}</div>
                </div>
                <div class="lb-score">${s.total} <span style="font-size:.65rem;color:#aaa">/ ${s.grandTotal}<br>${pct}%</span></div>
            </div>
        `;
    }).join('');

    document.getElementById('leaderboardCard').style.display = 'block';
}

// ========== ANIMATED REVEAL ==========
function showReveal(message) {
    const overlay = document.getElementById('revealOverlay');
    document.getElementById('revealText').textContent = message;
    overlay.classList.add('active');
}

function hideReveal() {
    document.getElementById('revealOverlay').classList.remove('active');
}

// ========== DISPLAY RESULT CARD ==========
function showResultCard(student) {
    currentStudent = student;
    const wrapper = document.getElementById("cardWrapper");
    wrapper.style.display = "none";

    showReveal("Fetching your result...");

    setTimeout(() => {
        document.getElementById("revealText").textContent = "Calculating grades...";
    }, 600);

    setTimeout(() => {
        document.getElementById("revealText").textContent = "Almost there...";
    }, 1200);

    setTimeout(() => {
        hideReveal();
        _renderCard(student);
        wrapper.classList.remove('visible');
        wrapper.style.display = "block";
        void wrapper.offsetWidth; // force reflow
        wrapper.classList.add('visible');
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1800);
}

function _renderCard(student) {
    document.getElementById("cardSchoolName").textContent = schoolConfig.schoolName;
    document.getElementById("cardExamBadge").textContent  = schoolConfig.examType;
    document.getElementById("cardStudentName").textContent = student.name;
    document.getElementById("cardFatherName").textContent  = student.father || "—";
    document.getElementById("cardRoll").textContent        = student.roll;
    document.getElementById("cardClass").textContent       = student.class;
    document.getElementById("cardSession").textContent     = schoolConfig.session;
    document.getElementById("cardExam").textContent        = schoolConfig.examType;

    // AUTO DATE: use examDate from sheet if present, else today
    const dateStr = student.examDate || getTodayFormatted();
    document.getElementById("cardDate").textContent = dateStr;

    document.getElementById("cardRemarks").textContent = student.remarks || "Keep up the good work!";

    const tbody = document.getElementById("cardMarksBody");
    tbody.innerHTML = "";
    let grandTotal = 0, grandObtained = 0;
    let failedSubjects = [];

    SUBJECTS.forEach((subj, i) => {
        const total    = subj.total;
        const obtained = student.marks[i] || 0;
        grandTotal    += total;
        grandObtained += obtained;
        const passMark   = getPassMark(total);
        const percentage = (obtained / total) * 100;
        const { grade, class: gradeClass } = getGrade(percentage);
        const passed = obtained >= passMark;
        if (!passed) failedSubjects.push(subj.name);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="sno">${i+1}</td>
            <td>${subj.name}</td>
            <td>${total}</td>
            <td><b>${obtained}</b></td>
            <td>${passMark} <span style="font-size:.65rem;color:#999">(${schoolConfig.passPercentage}%)</span></td>
            <td><span class="grade-badge ${gradeClass}">${grade}</span></td>
            <td>${passed ? '<span class="status-pass">✅ Pass</span>' : '<span class="status-fail">❌ Fail</span>'}</td>
        `;
        tbody.appendChild(tr);
    });

    const overallPct = (grandObtained / grandTotal) * 100;
    const { grade: overallGrade } = getGrade(overallPct);

    document.getElementById("cTotal").textContent    = grandTotal;
    document.getElementById("cObtained").textContent = grandObtained;
    document.getElementById("cPct").textContent      = overallPct.toFixed(1) + "%";
    document.getElementById("cGrade").textContent    = overallGrade;

    const sameClass = students.filter(s => s.class === student.class);
    const pos       = computePosition(student, sameClass);
    document.getElementById("cPos").textContent = pos ? ordinal(pos) : "—";

    const banner = document.getElementById("cBanner");
    if (failedSubjects.length > 0) {
        banner.className = "result-banner banner-fail";
        document.getElementById("cBannerIcon").textContent = "❌";
        document.getElementById("cBannerText").textContent = "Failed in: " + failedSubjects.join(", ");
        document.getElementById("cBannerSub").textContent  = `Scored ${overallPct.toFixed(1)}% overall`;
    } else {
        banner.className = "result-banner banner-pass";
        document.getElementById("cBannerIcon").textContent = "🎉";
        document.getElementById("cBannerText").textContent = "PASS — Promoted to Next Class";
        document.getElementById("cBannerSub").textContent  = `Achieved ${overallPct.toFixed(1)}% — Grade ${overallGrade}`;
    }

    document.getElementById("cardActions").style.display = "flex";
}

// ========== WHATSAPP SHARE ==========
function shareWhatsApp() {
    if (!currentStudent) return;
    const name    = document.getElementById("cardStudentName").textContent;
    const cls     = document.getElementById("cardClass").textContent;
    const roll    = document.getElementById("cardRoll").textContent;
    const pct     = document.getElementById("cPct").textContent;
    const grade   = document.getElementById("cGrade").textContent;
    const pos     = document.getElementById("cPos").textContent;
    const banner  = document.getElementById("cBannerText").textContent;
    const school  = schoolConfig.schoolName;
    const session = schoolConfig.session;

    const msg = `📋 *Student Result*\n\n` +
        `🏫 *${school}*\n` +
        `📅 Session: ${session}\n\n` +
        `👤 *${name}*\n` +
        `📚 Class: ${cls} | Roll No: ${roll}\n` +
        `📊 Percentage: *${pct}*\n` +
        `🏅 Grade: *${grade}* | Position: *${pos}*\n\n` +
        `✅ *${banner}*\n\n` +
        `_Result checked via Student Result Portal_`;

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ========== LOOKUP ==========
function doLookup() {
    const inputClass = document.getElementById("lkp_class").value.trim().toLowerCase();
    const inputRoll  = document.getElementById("lkp_roll").value.trim();
    const msgDiv     = document.getElementById("lookupMsg");

    if (!inputRoll) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "⚠️ Please enter a Roll Number.";
        document.getElementById("cardWrapper").style.display = "none";
        document.getElementById("cardActions").style.display = "none";
        return;
    }

    if (!inputClass) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "⚠️ Please select a Class.";
        return;
    }

    if (students.length === 0) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "⚠️ Data is still loading. Please wait a moment and try again.";
        return;
    }

    const student = students.find(s =>
        s.roll.toLowerCase()  === inputRoll.toLowerCase() &&
        s.class.toLowerCase() === inputClass
    );

    if (!student) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = `❌ No result found for Roll No. <b>${inputRoll}</b> in class <b>${inputClass}</b>. Please check your details.`;
        document.getElementById("cardWrapper").style.display = "none";
        document.getElementById("cardActions").style.display = "none";
        return;
    }

    msgDiv.style.display = "none";
    localStorage.setItem('lastClass', inputClass);
    saveToHistory(inputClass, inputRoll);
    showResultCard(student);
}

function resetLookup() {
    document.getElementById("cardWrapper").style.display = "none";
    document.getElementById("cardActions").style.display = "none";
    document.getElementById("lkp_roll").value = "";
    document.getElementById("lookupMsg").style.display = "none";
    currentStudent = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== FETCH DATA ==========
async function fetchGoogleSheet() {
    const loadingDiv = document.getElementById("loadingMsg");
    loadingDiv.style.display = "block";
    try {
        const response = await fetch('/api/results');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("No data rows found");

        const dataRows = rows.slice(1);
        const parsed   = [];

        for (let row of dataRows) {
            if (row.length < 4 + SUBJECTS.length) continue;
            const roll      = row[0]?.trim() || "";
            const name      = row[1]?.trim() || "";
            const father    = row[2]?.trim() || "";
            const className = row[3]?.trim() || "";
            const marks     = [];

            for (let i = 0; i < SUBJECTS.length; i++) {
                let val = parseFloat(row[4 + i]);
                if (isNaN(val)) val = 0;
                marks.push(val);
            }

            // Optional: examDate column after Remarks (col 4+SUBJECTS.length+1)
            const remarks   = row[4 + SUBJECTS.length]?.trim() || "";
            const examDate  = row[4 + SUBJECTS.length + 1]?.trim() || "";

            if (roll && name) {
                parsed.push({ roll, name, father, class: className, marks, remarks, examDate });
            }
        }

        if (parsed.length === 0) throw new Error("No valid student records");
        students = parsed;
        console.log(`Loaded ${students.length} students from the backend.`);
        loadingDiv.style.display = "none";

        populateClassDropdown();
        populateLeaderboardFilter();
        renderLeaderboard();
        renderHistory();

    } catch (error) {
        console.error("Failed to load data:", error);
        loadingDiv.style.display = "none";
        students = fallbackStudents;
        document.getElementById("lookupMsg").style.display = "block";
        document.getElementById("lookupMsg").innerHTML =
            `⚠️ Could not load data from server. Using example data. (${error.message})`;

        populateClassDropdown();
        populateLeaderboardFilter();
        renderLeaderboard();
        renderHistory();
    }
}

// ========== EXPORT FUNCTIONS ==========
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const card   = document.getElementById("resultCard");
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: "#fffdf4" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height / canvas.width) * w;
    pdf.addImage(imgData, "PNG", 0, 0, w, Math.min(h, 297));
    const studentName = document.getElementById("cardStudentName").textContent || "result";
    pdf.save(`result_${studentName.replace(/\s+/g, "_")}.pdf`);
}

async function exportImage() {
    const card   = document.getElementById("resultCard");
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: "#fffdf4" });
    const a      = document.createElement("a");
    const studentName = document.getElementById("cardStudentName").textContent || "result";
    a.download = `result_${studentName.replace(/\s+/g, "_")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
}

// ========== INIT ==========
initTheme();
fetchGoogleSheet();
