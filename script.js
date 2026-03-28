// ================================================================
//  NATIONAL EDUCATORS RESULT PORTAL — SCRIPT
//  ✏️  Edit CLASS_SUBJECTS below to add/remove subjects per class.
//      Order must match your Google Sheet column order (col E+).
// ================================================================

// ===== SCHOOL CONFIG =====
const schoolConfig = {
    schoolName:     "The National Educators School System 335 W/B",
    session:        "2025-2026",
    examType:       "Annual Exam",
    passPercentage: 40
};

// ===== PER-CLASS SUBJECT DEFINITIONS =====
// Keys must exactly match what you write in the "Class" column (column D) of your Google Sheet.
// ✏️  To add a subject  : { name: "SubjectName", total: XX }
// ✏️  To change marks   : edit the total number
// ✏️  To remove subject : delete its line
// ⚠️  After any change, update Google Sheet columns to match (same order, starting at col E).

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

// Canonical display order for class tabs
const CLASS_ORDER = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th"];

// ===== HELPERS =====
function getSubjectsForClass(className) {
    if (!className) return [];
    const key = CLASS_ORDER.find(k => k.toLowerCase() === className.trim().toLowerCase());
    return key ? (CLASS_SUBJECTS[key] || []) : [];
}
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

// ===== STATE =====
let students       = [];
let currentStudent = null;
let activeClass    = null;   // currently selected class tab

// Fallback demo data when sheet is unavailable
const fallbackStudents = [
    { roll:"01", name:"Ali Raza",    father:"Ahmed Raza",   class:"8th",  marks:[85,78,92,88,65,14,13],       remarks:"Excellent performance!", examDate:"" },
    { roll:"02", name:"Sara Khan",   father:"Kamran Khan",  class:"8th",  marks:[78,82,79,85,60,12,12],       remarks:"Good, keep it up.",       examDate:"" },
    { roll:"01", name:"Bilal Asif",  father:"Asif Mehmood", class:"9th",  marks:[70,65,80,75,68,72,60,45],   remarks:"Well done!",              examDate:"" },
    { roll:"01", name:"Hina Naz",    father:"Naz Ahmed",    class:"5th",  marks:[90,85,95,88,80,65,14],       remarks:"Outstanding!",            examDate:"" }
];

// ===== PARTICLE CANVAS =====
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';
    for (let i = 0; i < 48; i++) pts.push({
        x:Math.random()*1400, y:Math.random()*900,
        r:Math.random()*1.6+0.3,
        dx:(Math.random()-0.5)*0.22, dy:(Math.random()-0.5)*0.22,
        op:Math.random()*0.45+0.1
    });
    (function draw() {
        ctx.clearRect(0,0,W,H);
        const c = isDark()?'200,162,39':'11,29,58';
        pts.forEach(p=>{
            ctx.beginPath(); ctx.arc(p.x%W,p.y%H,p.r,0,Math.PI*2);
            ctx.fillStyle=`rgba(${c},${p.op})`; ctx.fill();
            p.x+=p.dx; p.y+=p.dy;
            if(p.x<0)p.x=W; if(p.x>W)p.x=0;
            if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        });
        for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
            const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
            if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x%W,pts[i].y%H); ctx.lineTo(pts[j].x%W,pts[j].y%H);
                ctx.strokeStyle=`rgba(${c},${0.05*(1-d/90)})`; ctx.lineWidth=0.5; ctx.stroke(); }
        }
        requestAnimationFrame(draw);
    })();
}

// ===== THEME =====
function toggleTheme() {
    const html = document.documentElement;
    const dark = html.getAttribute('data-theme')==='dark';
    html.setAttribute('data-theme', dark?'light':'dark');
    document.getElementById('themeIcon').textContent = dark?'🌙':'☀️';
    localStorage.setItem('ne_theme', dark?'light':'dark');
}
function initTheme() {
    const saved = localStorage.getItem('ne_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    document.getElementById('themeIcon').textContent = saved==='dark'?'☀️':'🌙';
}

// ===== CLASS TABS =====
function buildClassTabs() {
    const track   = document.getElementById('classTabs');
    // Only show tabs for classes that appear in the loaded student data
    const present = CLASS_ORDER.filter(c =>
        students.some(s => s.class.trim().toLowerCase() === c.toLowerCase())
    );
    if (!present.length) { track.innerHTML = '<div class="tabs-skeleton">No class data loaded.</div>'; return; }

    track.innerHTML = present.map(c =>
        `<button class="class-tab" data-class="${c}" onclick="selectClass('${c}')">${c} Class</button>`
    ).join('');

    // Re-select if a class was already active
    if (activeClass && present.includes(activeClass)) {
        selectClass(activeClass, false);
    }
}

function selectClass(cls, scrollIntoView = true) {
    activeClass = cls;
    // Update tab highlights
    document.querySelectorAll('.class-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.class === cls);
    });
    // Update info bar
    const subjects = getSubjectsForClass(cls);
    document.getElementById('cibClass').textContent     = `Class ${cls}`;
    document.getElementById('cibSubjects').textContent  = subjects.map(s=>s.name).join(' · ');
    const grandTotal = subjects.reduce((a,s)=>a+s.total, 0);
    document.getElementById('cibTotal').textContent     = grandTotal;
    document.getElementById('cibRight').style.display   = 'block';
    // Clear any previous error
    document.getElementById('lookupMsg').style.display  = 'none';
    document.getElementById('lkp_roll').value           = '';
    document.getElementById('lkp_roll').focus();
    if (scrollIntoView) document.querySelector('.lookup-card')?.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ===== HISTORY =====
const HK = 'ne_hist';
function getHistory() { try { return JSON.parse(localStorage.getItem(HK)||'[]'); } catch { return []; } }
function saveHistory(cls, roll) {
    let h = getHistory().filter(x=>!(x.cls===cls&&x.roll===roll));
    h.unshift({cls,roll}); if(h.length>8) h=h.slice(0,8);
    localStorage.setItem(HK, JSON.stringify(h)); renderHistory();
}
function removeHistory(cls, roll) {
    localStorage.setItem(HK, JSON.stringify(getHistory().filter(x=>!(x.cls===cls&&x.roll===roll))));
    renderHistory();
}
function renderHistory() {
    const hist = getHistory();
    const sec  = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (!hist.length) { sec.style.display='none'; return; }
    sec.style.display = 'block';
    list.innerHTML = hist.map(h=>`
        <span class="history-chip" onclick="quickSearch('${h.cls}','${h.roll}')">
            📌 ${h.cls} · #${h.roll}
            <span class="hchip-del" onclick="event.stopPropagation();removeHistory('${h.cls}','${h.roll}')">✕</span>
        </span>`).join('');
}
function quickSearch(cls, roll) {
    selectClass(cls);
    document.getElementById('lkp_roll').value = roll;
    doLookup();
}

// ===== LOOKUP =====
function doLookup() {
    const cls    = activeClass;
    const roll   = document.getElementById('lkp_roll').value.trim();
    const msgDiv = document.getElementById('lookupMsg');
    msgDiv.style.display = 'none';

    if (!cls)  { msgDiv.style.display='flex'; msgDiv.innerHTML='⚠️ Please select a class tab first.'; return; }
    if (!roll) { msgDiv.style.display='flex'; msgDiv.innerHTML='⚠️ Please enter your Roll Number.'; return; }
    if (!students.length) { msgDiv.style.display='flex'; msgDiv.innerHTML='⚠️ Data is still loading, please try again.'; return; }

    const student = students.find(s =>
        s.roll.trim().toLowerCase()  === roll.toLowerCase() &&
        s.class.trim().toLowerCase() === cls.toLowerCase()
    );
    if (!student) {
        msgDiv.style.display = 'flex';
        msgDiv.innerHTML = `❌ No result found for Roll <strong>${roll}</strong> in Class <strong>${cls}</strong>. Check your details.`;
        document.getElementById('resultSection').style.display = 'none';
        return;
    }
    saveHistory(cls, roll);
    showResultCard(student);
}

function resetLookup() {
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('cardActions').style.display   = 'none';
    document.getElementById('lkp_roll').value = '';
    document.getElementById('lookupMsg').style.display = 'none';
    currentStudent = null;
    window.scrollTo({top:0,behavior:'smooth'});
}

// ===== REVEAL =====
function showReveal(msg) {
    const ov  = document.getElementById('revealOverlay');
    const bar = document.getElementById('revealProgress');
    document.getElementById('revealText').textContent = msg;
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    ov.classList.add('active');
}
function hideReveal() { document.getElementById('revealOverlay').classList.remove('active'); }

// ===== RENDER RESULT CARD =====
function showResultCard(student) {
    currentStudent = student;
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('cardActions').style.display   = 'none';
    showReveal('Searching your result…');
    setTimeout(()=>{ document.getElementById('revealText').textContent='Calculating grades…'; }, 700);
    setTimeout(()=>{ document.getElementById('revealText').textContent='Almost ready…'; }, 1350);
    setTimeout(()=>{
        hideReveal(); _renderCard(student);
        const sec = document.getElementById('resultSection');
        sec.style.display = 'block';
        sec.scrollIntoView({behavior:'smooth',block:'start'});
    }, 1950);
}

function _renderCard(student) {
    const subjects = getSubjectsForClass(student.class);

    // Header info
    document.getElementById('cardSchoolName').textContent  = schoolConfig.schoolName;
    document.getElementById('cardExamBadge').textContent   = schoolConfig.examType;
    document.getElementById('cardStudentName').textContent = student.name;
    document.getElementById('cardFatherName').textContent  = student.father || '—';
    document.getElementById('cardRoll').textContent        = student.roll;
    document.getElementById('cardClass').textContent       = student.class;
    document.getElementById('cardSession').textContent     = schoolConfig.session;
    document.getElementById('cardExam').textContent        = schoolConfig.examType;

    // ✅ DATE FIX: examDate is stored explicitly on the student object.
    //    It is read from the sheet column AFTER the marks columns (correct offset per class).
    //    If blank/missing, fall back to today's date — never a marks value.
    const dateValue = (student.examDate && student.examDate.trim()) ? student.examDate.trim() : getTodayFormatted();
    document.getElementById('cardDate').textContent   = dateValue;
    document.getElementById('footerDate').textContent = getTodayFormatted();

    document.getElementById('cardRemarks').textContent = student.remarks || 'Keep up the good work!';

    // Build marks table
    const tbody = document.getElementById('cardMarksBody');
    tbody.innerHTML = '';
    let grandTotal=0, grandObtained=0, failedSubjects=[];

    subjects.forEach((subj, i) => {
        const total    = subj.total;
        const obtained = Number.isFinite(student.marks[i]) ? student.marks[i] : 0;
        grandTotal    += total;
        grandObtained += obtained;
        const passMark = getPassMark(total);
        const pct      = total > 0 ? (obtained/total)*100 : 0;
        const {grade,cls} = getGrade(pct);
        const passed   = obtained >= passMark;
        if (!passed) failedSubjects.push(subj.name);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>${subj.name}</td>
            <td>${total}</td>
            <td><strong>${obtained}</strong></td>
            <td>${passMark} <span style="font-size:.58rem;color:#bbb">(${schoolConfig.passPercentage}%)</span></td>
            <td><span class="grade-badge ${cls}">${grade}</span></td>
            <td>${passed?'<span class="status-pass">✅ Pass</span>':'<span class="status-fail">❌ Fail</span>'}</td>`;
        tbody.appendChild(tr);
    });

    const overallPct   = grandTotal > 0 ? (grandObtained/grandTotal)*100 : 0;
    const {grade:olvGrade} = getGrade(overallPct);

    document.getElementById('cTotal').textContent    = grandTotal;
    document.getElementById('cObtained').textContent = grandObtained;
    document.getElementById('cPct').textContent      = overallPct.toFixed(1) + '%';
    document.getElementById('cGrade').textContent    = olvGrade;

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
        document.getElementById('cBannerSub').textContent  = `Achieved ${overallPct.toFixed(1)}% · Grade ${olvGrade}`;
    }
    document.getElementById('cardActions').style.display = 'flex';
}

// ===== WHATSAPP =====
function shareWhatsApp() {
    if (!currentStudent) return;
    const msg = `📋 *Student Result*\n\n` +
        `🏫 *${schoolConfig.schoolName}*\n📅 Session: ${schoolConfig.session}\n\n` +
        `👤 *${document.getElementById('cardStudentName').textContent}*\n` +
        `📚 Class: ${document.getElementById('cardClass').textContent} · Roll: ${document.getElementById('cardRoll').textContent}\n` +
        `📊 Percentage: *${document.getElementById('cPct').textContent}*\n` +
        `🏅 Grade: *${document.getElementById('cGrade').textContent}*\n\n` +
        `✅ *${document.getElementById('cBannerText').textContent}*\n\n` +
        `_Official Result · ${getTodayFormatted()}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// ===== FETCH DATA =====
// ─────────────────────────────────────────────────────────────────────────────
//  Google Sheet column layout (all classes in ONE sheet, one student per row):
//
//  A        B       C        D       E … E+n-1        E+n      E+n+1
//  Roll  |  Name  | Father | Class | Marks (n cols) | Remarks | ExamDate
//
//  Where n = number of subjects for that class (from CLASS_SUBJECTS above).
//  Remarks and ExamDate positions shift depending on the class — the code
//  calculates the correct index dynamically, fixing the date-showing-as-total bug.
//
//  ExamDate format: dd-Mon-yyyy (e.g. 15-Mar-2025) or leave blank for today's date.
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGoogleSheet() {
    const loading = document.getElementById('loadingMsg');
    loading.style.display = 'flex';
    try {
        const res = await fetch('/api/results');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error('Sheet has no data rows');

        const parsed = [];
        for (const row of rows.slice(1)) {
            if (row.length < 4) continue;

            const roll      = (row[0] ?? '').trim();
            const name      = (row[1] ?? '').trim();
            const father    = (row[2] ?? '').trim();
            const className = (row[3] ?? '').trim();

            if (!roll || !name || !className) continue;

            // Look up how many subjects this class has
            const subjects = getSubjectsForClass(className);
            if (!subjects.length) continue; // unknown class — skip

            const n = subjects.length;

            // Read exactly n mark columns starting at column index 4 (column E)
            const marks = subjects.map((_, i) => {
                const raw = row[4 + i];
                const v   = parseFloat(raw);
                return Number.isFinite(v) ? v : 0;
            });

            // ✅ Remarks and ExamDate are at FIXED offsets AFTER the marks:
            //    remarksIdx  = 4 + n      (the column right after the last mark)
            //    examDateIdx = 4 + n + 1  (one after remarks)
            const remarksIdx  = 4 + n;
            const examDateIdx = 4 + n + 1;

            const remarks  = (row[remarksIdx]  ?? '').trim();
            const examDate = (row[examDateIdx] ?? '').trim();

            parsed.push({ roll, name, father, class: className, marks, remarks, examDate });
        }

        if (!parsed.length) throw new Error('No valid student records in sheet');
        students = parsed;
        loading.style.display = 'none';

    } catch (err) {
        console.error('Sheet fetch error:', err);
        loading.style.display = 'none';
        students = fallbackStudents;
        const msg = document.getElementById('lookupMsg');
        msg.style.display = 'flex';
        msg.innerHTML = `⚠️ Showing demo data (server error: ${err.message})`;
    }

    buildClassTabs();
    renderHistory();
}

// ===== EXPORT =====
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById('resultCard'), { scale:2, useCORS:true, backgroundColor:'#fffdf6' });
    const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = Math.min((canvas.height/canvas.width)*w, 297);
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
    pdf.save(`result_${(document.getElementById('cardStudentName').textContent||'student').replace(/\s+/g,'_')}.pdf`);
}
async function exportImage() {
    const canvas = await html2canvas(document.getElementById('resultCard'), { scale:2, useCORS:true, backgroundColor:'#fffdf6' });
    const a = document.createElement('a');
    a.download = `result_${(document.getElementById('cardStudentName').textContent||'student').replace(/\s+/g,'_')}.png`;
    a.href = canvas.toDataURL('image/png'); a.click();
}

// ===== INIT =====
initTheme();
initCanvas();
fetchGoogleSheet();
