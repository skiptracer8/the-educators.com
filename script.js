// ========== SCHOOL CONFIG ==========
const schoolConfig = {
    schoolName: "The National Educators School System 335 W/B",
    session: "2025-2026",
    examType: "Annual Exam",
    passPercentage: 40
};

// ========== PER-CLASS SUBJECTS ==========
// Each class has its own subject list with individual total marks.
// The ORDER here must match the column order in your Google Sheet (columns E onward).
// ✏️  To add a subject: add a new line { name: "Subject", total: XX }
// ✏️  To change total marks: edit the total number
// ✏️  To remove a subject: delete its line
// ⚠️  After any change here, update your Google Sheet columns to match.

const CLASS_SUBJECTS = {
    "1st": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Islamic Studies", total: 50  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "2nd": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Islamic Studies", total: 50  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "3rd": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "General Science", total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "4th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "General Science", total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "5th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "General Science", total: 100 },
        { name: "Social Studies",  total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "6th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Science",         total: 100 },
        { name: "Social Studies",  total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Reading Skills",  total: 15  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "7th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Science",         total: 100 },
        { name: "Social Studies",  total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Reading Skills",  total: 15  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "8th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Science",         total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Reading Skills",  total: 15  },
        { name: "Nazra Quran",     total: 15  }
    ],
    "9th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Physics",         total: 100 },
        { name: "Chemistry",       total: 100 },
        { name: "Biology",         total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Computer",        total: 50  }
    ],
    "10th": [
        { name: "English",         total: 100 },
        { name: "Urdu",            total: 100 },
        { name: "Math",            total: 100 },
        { name: "Physics",         total: 100 },
        { name: "Chemistry",       total: 100 },
        { name: "Biology",         total: 100 },
        { name: "Islamic Studies", total: 70  },
        { name: "Computer",        total: 50  }
    ]
};

// Helper: get subjects for a given class label (case-insensitive)
function getSubjectsForClass(className) {
    if (!className) return [];
    const key = Object.keys(CLASS_SUBJECTS).find(
        k => k.toLowerCase() === className.trim().toLowerCase()
    );
    return key ? CLASS_SUBJECTS[key] : [];
}

// ========== STUDENT DATA ==========
let students = [];
let currentStudent = null;

// Fallback sample data shown when Google Sheet cannot be reached
const fallbackStudents = [
    { roll:"01", name:"Ali Raza",    father:"Ahmed Raza",   class:"8th",  marks:[85,78,92,88,65,14,13],       remarks:"Excellent performance!", examDate:"" },
    { roll:"02", name:"Sara Khan",   father:"Kamran Khan",  class:"8th",  marks:[78,82,79,85,60,12,12],       remarks:"Good, keep it up.",       examDate:"" },
    { roll:"01", name:"Bilal Asif",  father:"Asif Mehmood", class:"9th",  marks:[70,65,80,75,68,72,60,45],   remarks:"Well done!",              examDate:"" },
    { roll:"01", name:"Hina Naz",    father:"Naz Ahmed",    class:"5th",  marks:[90,85,95,88,80,65,14],       remarks:"Outstanding!",            examDate:"" }
];

// ========== PARTICLE BACKGROUND ==========
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    for (let i = 0; i < 55; i++) {
        particles.push({
            x: Math.random() * 1200,
            y: Math.random() * 900,
            r: Math.random() * 1.8 + 0.3,
            dx: (Math.random() - 0.5) * 0.25,
            dy: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.5 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const color = isDark() ? '201,162,39' : '15,32,68';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color},${p.opacity})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
        });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x % W, particles[i].y % H);
                    ctx.lineTo(particles[j].x % W, particles[j].y % H);
                    ctx.strokeStyle = `rgba(${color},${0.06 * (1 - dist/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ========== HELPERS ==========
function getTodayFormatted() {
    return new Date().toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" });
}
function getPassMark(total) { return Math.ceil((schoolConfig.passPercentage / 100) * total); }
function getGrade(pct) {
    if (pct >= 90) return { grade:"A+", cls:"grade-A" };
    if (pct >= 80) return { grade:"A",  cls:"grade-A" };
    if (pct >= 70) return { grade:"B+", cls:"grade-B" };
    if (pct >= 60) return { grade:"B",  cls:"grade-B" };
    if (pct >= 50) return { grade:"C",  cls:"grade-C" };
    if (pct >= 40) return { grade:"D",  cls:"grade-D" };
    return { grade:"F", cls:"grade-F" };
}

// Returns class list sorted in proper school order (1st … 10th)
const CLASS_ORDER = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];
function getClassList() {
    const found = [...new Set(students.map(s => s.class.trim()))];
    return CLASS_ORDER.filter(c => found.some(f => f.toLowerCase() === c.toLowerCase()));
}

// ========== DARK MODE ==========
function toggleTheme() {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark');
    document.getElementById('themeBtn').querySelector('.theme-icon').textContent = dark ? '🌙' : '☀️';
    localStorage.setItem('theme', dark ? 'light' : 'dark');
}
function initTheme() {
    const saved = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeBtn').querySelector('.theme-icon').textContent = saved==='dark' ? '☀️' : '🌙';
}

// ========== HISTORY ==========
const HISTORY_KEY = 'resultPortalHistory';
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]'); } catch { return []; } }
function saveToHistory(cls, roll) {
    let h = getHistory().filter(x => !(x.cls===cls && x.roll===roll));
    h.unshift({cls, roll});
    if (h.length > 6) h = h.slice(0,6);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
    renderHistory();
}
function removeFromHistory(cls, roll) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter(x=>!(x.cls===cls&&x.roll===roll))));
    renderHistory();
}
function renderHistory() {
    const hist = getHistory();
    const sec  = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (!hist.length) { sec.style.display='none'; return; }
    sec.style.display = 'block';
    list.innerHTML = hist.map(h => `
        <span class="history-chip" onclick="quickSearch('${h.cls}','${h.roll}')">
            📌 ${h.cls} · ${h.roll}
            <span class="del-btn" onclick="event.stopPropagation();removeFromHistory('${h.cls}','${h.roll}')">✕</span>
        </span>`).join('');
}
function quickSearch(cls, roll) {
    document.getElementById('lkp_class').value = cls;
    document.getElementById('lkp_roll').value  = roll;
    doLookup();
}

// ========== CLASS DROPDOWN ==========
function populateClassDropdown() {
    const sel = document.getElementById('lkp_class');
    const classes = getClassList();
    sel.innerHTML = '<option value="">— Select Class —</option>' +
        classes.map(c=>`<option value="${c}">${c}</option>`).join('');
    const last = localStorage.getItem('lastClass');
    if (last && classes.some(c => c.toLowerCase() === last.toLowerCase())) sel.value = last;
}

// ========== REVEAL ANIMATION ==========
function showReveal(msg) {
    const ov = document.getElementById('revealOverlay');
    document.getElementById('revealText').textContent = msg;
    const bar = document.getElementById('revealProgress');
    bar.style.animation = 'none';
    void bar.offsetWidth;
    bar.style.animation = '';
    ov.classList.add('active');
}
function hideReveal() { document.getElementById('revealOverlay').classList.remove('active'); }

// ========== SHOW RESULT ==========
function showResultCard(student) {
    currentStudent = student;
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('cardActions').style.display   = 'none';

    showReveal('Searching your result…');
    setTimeout(() => { document.getElementById('revealText').textContent = 'Calculating grades…'; }, 700);
    setTimeout(() => { document.getElementById('revealText').textContent = 'Almost ready…'; }, 1300);
    setTimeout(() => {
        hideReveal();
        _renderCard(student);
        const sec = document.getElementById('resultSection');
        sec.style.display = 'block';
        sec.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 1900);
}

function _renderCard(student) {
    // Load subjects specific to this student's class
    const subjects = getSubjectsForClass(student.class);

    document.getElementById('cardSchoolName').textContent  = schoolConfig.schoolName;
    document.getElementById('cardExamBadge').textContent   = schoolConfig.examType;
    document.getElementById('cardStudentName').textContent = student.name;
    document.getElementById('cardFatherName').textContent  = student.father || '—';
    document.getElementById('cardRoll').textContent        = student.roll;
    document.getElementById('cardClass').textContent       = student.class;
    document.getElementById('cardSession').textContent     = schoolConfig.session;
    document.getElementById('cardExam').textContent        = schoolConfig.examType;
    document.getElementById('cardDate').textContent        = student.examDate || getTodayFormatted();
    document.getElementById('footerDate').textContent      = getTodayFormatted();
    document.getElementById('cardRemarks').textContent     = student.remarks || 'Keep up the good work!';

    const tbody = document.getElementById('cardMarksBody');
    tbody.innerHTML = '';
    let grandTotal=0, grandObtained=0, failedSubjects=[];

    subjects.forEach((subj, i) => {
        const total    = subj.total;
        const obtained = student.marks[i] !== undefined ? student.marks[i] : 0;
        grandTotal    += total;
        grandObtained += obtained;
        const passMark = getPassMark(total);
        const pct      = (obtained / total) * 100;
        const {grade, cls} = getGrade(pct);
        const passed   = obtained >= passMark;
        if (!passed) failedSubjects.push(subj.name);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${subj.name}</td>
            <td>${total}</td>
            <td><strong>${obtained}</strong></td>
            <td>${passMark} <span style="font-size:.6rem;color:#aaa">(${schoolConfig.passPercentage}%)</span></td>
            <td><span class="grade-badge ${cls}">${grade}</span></td>
            <td>${passed ? '<span class="status-pass">✅ Pass</span>' : '<span class="status-fail">❌ Fail</span>'}</td>`;
        tbody.appendChild(tr);
    });

    const overallPct = grandTotal > 0 ? (grandObtained / grandTotal) * 100 : 0;
    const {grade: overallGrade} = getGrade(overallPct);

    document.getElementById('cTotal').textContent    = grandTotal;
    document.getElementById('cObtained').textContent = grandObtained;
    document.getElementById('cPct').textContent      = overallPct.toFixed(1) + '%';
    document.getElementById('cGrade').textContent    = overallGrade;

    const banner = document.getElementById('cBanner');
    if (failedSubjects.length > 0) {
        banner.className = 'rc-banner banner-fail';
        document.getElementById('cBannerIcon').textContent = '❌';
        document.getElementById('cBannerText').textContent = 'Failed in: ' + failedSubjects.join(', ');
        document.getElementById('cBannerSub').textContent  = `Scored ${overallPct.toFixed(1)}% overall`;
    } else {
        banner.className = 'rc-banner banner-pass';
        document.getElementById('cBannerIcon').textContent = '🎉';
        document.getElementById('cBannerText').textContent = 'PASS — Promoted to Next Class';
        document.getElementById('cBannerSub').textContent  = `Achieved ${overallPct.toFixed(1)}% · Grade ${overallGrade}`;
    }

    document.getElementById('cardActions').style.display = 'flex';
}

// ========== WHATSAPP ==========
function shareWhatsApp() {
    if (!currentStudent) return;
    const msg = `📋 *Student Result*\n\n` +
        `🏫 *${schoolConfig.schoolName}*\n` +
        `📅 Session: ${schoolConfig.session}\n\n` +
        `👤 *${document.getElementById('cardStudentName').textContent}*\n` +
        `📚 Class: ${document.getElementById('cardClass').textContent} · Roll: ${document.getElementById('cardRoll').textContent}\n` +
        `📊 Percentage: *${document.getElementById('cPct').textContent}*\n` +
        `🏅 Grade: *${document.getElementById('cGrade').textContent}*\n\n` +
        `✅ *${document.getElementById('cBannerText').textContent}*\n\n` +
        `_Official Result · ${getTodayFormatted()}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// ========== LOOKUP ==========
function doLookup() {
    const cls    = document.getElementById('lkp_class').value.trim();
    const roll   = document.getElementById('lkp_roll').value.trim();
    const msgDiv = document.getElementById('lookupMsg');

    msgDiv.style.display = 'none';

    if (!roll) { msgDiv.style.display='block'; msgDiv.innerHTML='⚠️ Please enter your Roll Number.'; return; }
    if (!cls)  { msgDiv.style.display='block'; msgDiv.innerHTML='⚠️ Please select your Class.'; return; }
    if (!students.length) { msgDiv.style.display='block'; msgDiv.innerHTML='⚠️ Data is still loading. Please try again.'; return; }

    const student = students.find(s =>
        s.roll.trim().toLowerCase() === roll.toLowerCase() &&
        s.class.trim().toLowerCase() === cls.toLowerCase()
    );

    if (!student) {
        msgDiv.style.display = 'block';
        msgDiv.innerHTML = `❌ No result found for Roll <strong>${roll}</strong> in Class <strong>${cls}</strong>. Please check your details.`;
        document.getElementById('resultSection').style.display = 'none';
        return;
    }

    localStorage.setItem('lastClass', cls);
    saveToHistory(cls, roll);
    showResultCard(student);
}

function resetLookup() {
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('cardActions').style.display   = 'none';
    document.getElementById('lkp_roll').value  = '';
    document.getElementById('lookupMsg').style.display = 'none';
    currentStudent = null;
    window.scrollTo({ top:0, behavior:'smooth' });
}

// ========== FETCH DATA FROM GOOGLE SHEET ==========
//
// Google Sheet column layout (all classes in ONE sheet):
// ┌──────┬──────┬────────┬───────┬─────────────────────────────────────────┬─────────┬──────────┐
// │  A   │  B   │   C    │   D   │           E → E+n  (marks)              │ Remarks │ ExamDate │
// │ Roll │ Name │ Father │ Class │  Subject 1 … Subject N (for that class) │         │(optional)│
// └──────┴──────┴────────┴───────┴─────────────────────────────────────────┴─────────┴──────────┘
//
// Each class has a DIFFERENT number of mark columns (defined in CLASS_SUBJECTS above).
// Remarks always comes right after the last mark column for that class.
// ExamDate is the column after Remarks (optional — leave blank to show today's date).
//
// Example — 8th class has 7 subjects → marks in E,F,G,H,I,J,K → Remarks in L → ExamDate in M
// Example — 9th class has 8 subjects → marks in E,F,G,H,I,J,K,L → Remarks in M → ExamDate in N
//
// All classes can share the same sheet as long as each row's Class column (D) is set correctly.

async function fetchGoogleSheet() {
    const loading = document.getElementById('loadingMsg');
    loading.style.display = 'flex';
    try {
        const res = await fetch('/api/results');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error('No data rows found');

        const parsed = [];
        for (const row of rows.slice(1)) {
            if (row.length < 4) continue;

            const roll      = row[0]?.trim() || '';
            const name      = row[1]?.trim() || '';
            const father    = row[2]?.trim() || '';
            const className = row[3]?.trim() || '';

            if (!roll || !name || !className) continue;

            // Get this class's subject list to know how many mark columns to read
            const subjects = getSubjectsForClass(className);
            if (!subjects.length) continue; // skip unrecognised class names

            // Read exactly subjects.length mark columns starting at column index 4 (E)
            const marks = subjects.map((_, i) => {
                const v = parseFloat(row[4 + i]);
                return isNaN(v) ? 0 : v;
            });

            // Remarks and ExamDate sit AFTER the mark columns — index shifts per class
            const remarksIdx  = 4 + subjects.length;
            const examDateIdx = 4 + subjects.length + 1;
            const remarks     = row[remarksIdx]?.trim()  || '';
            const examDate    = row[examDateIdx]?.trim() || '';

            parsed.push({ roll, name, father, class: className, marks, remarks, examDate });
        }

        if (!parsed.length) throw new Error('No valid student records found');
        students = parsed;
        loading.style.display = 'none';

    } catch(err) {
        console.error('Fetch error:', err);
        loading.style.display = 'none';
        students = fallbackStudents;
        const msg = document.getElementById('lookupMsg');
        msg.style.display = 'block';
        msg.innerHTML = `⚠️ Could not load live data — showing example data. (${err.message})`;
    }

    populateClassDropdown();
    renderHistory();
}

// ========== EXPORT ==========
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById('resultCard'), { scale:2, useCORS:true, backgroundColor:'#fffdf4' });
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const w = pdf.internal.pageSize.getWidth();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, Math.min((canvas.height/canvas.width)*w, 297));
    pdf.save(`result_${(document.getElementById('cardStudentName').textContent||'student').replace(/\s+/g,'_')}.pdf`);
}
async function exportImage() {
    const canvas = await html2canvas(document.getElementById('resultCard'), { scale:2, useCORS:true, backgroundColor:'#fffdf4' });
    const a = document.createElement('a');
    a.download = `result_${(document.getElementById('cardStudentName').textContent||'student').replace(/\s+/g,'_')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
}

// ========== INIT ==========
initTheme();
initCanvas();
fetchGoogleSheet();
