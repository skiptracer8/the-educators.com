// ========== CONFIGURATION ==========
// SECURITY NOTE: These credentials are visible in the browser because the frontend
// must send them to Google Sheets. To protect them, move this logic to a backend proxy.
// For development, restrict your API key to your website's domain in Google Cloud Console.
const SHEET_ID = "16-I-m6-nSqqEwwuX3onCL_ExlWtirE6Tgoh0f35ZgvM";
const API_KEY = "AIzaSyCKbJZPomNDZ1N1HhLJ2MpSAHqd_Z58PnI";
const RANGE = "Sheet1!A1:Z";

// School info (fixed)
const schoolConfig = {
    schoolName: "The National Educators school system 335 W/B",
    session: "2024-2025",
    examType: "Annual Exam",
    examDate: "2025-03-15",
    passPercentage: 40
};

// Subject list (order must match columns in Google Sheet after "Remarks")
const SUBJECTS = [
    { name: "English", total: 100 },
    { name: "Urdu", total: 100 },
    { name: "Math", total: 100 },
    { name: "Science", total: 100 },
    { name: "Islamic Studies", total: 70 },
    { name: "Reading Skills", total: 15 },
    { name: "Nazra Quran", total: 15 }
];

let students = [];

// Fallback static data (used if sheet fails to load)
const fallbackStudents = [
    { roll: "01", name: "Ali Raza", father: "Ahmed Raza", class: "8th", marks: [85,78,92,88,65,14,13], remarks: "Excellent performance!" },
    { roll: "02", name: "Sara Khan", father: "Kamran Khan", class: "8th", marks: [78,82,79,85,60,12,12], remarks: "Good, keep it up." },
    { roll: "03", name: "Usman Ali", father: "Rashid Ali", class: "8th", marks: [45,38,52,48,35,8,9], remarks: "Needs improvement." }
];

// ========== HELPER FUNCTIONS ==========
function getPassMark(total) {
    return Math.ceil((schoolConfig.passPercentage / 100) * total);
}

function getGrade(percentage) {
    if (percentage >= 90) return { grade: "A+", class: "grade-A" };
    if (percentage >= 80) return { grade: "A", class: "grade-A" };
    if (percentage >= 70) return { grade: "B+", class: "grade-B" };
    if (percentage >= 60) return { grade: "B", class: "grade-B" };
    if (percentage >= 50) return { grade: "C", class: "grade-C" };
    if (percentage >= 40) return { grade: "D", class: "grade-D" };
    return { grade: "F", class: "grade-F" };
}

function ordinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function computePosition(student, classStudents) {
    const totals = classStudents.map(s => ({
        roll: s.roll,
        total: s.marks.reduce((a, b) => a + b, 0)
    }));
    totals.sort((a, b) => b.total - a.total);
    const pos = totals.findIndex(s => s.roll === student.roll) + 1;
    return pos;
}

// ========== DISPLAY RESULT CARD ==========
function showResultCard(student) {
    const cardWrapper = document.getElementById("cardWrapper");
    cardWrapper.style.display = "block";

    document.getElementById("cardSchoolName").textContent = schoolConfig.schoolName;
    document.getElementById("cardExamBadge").textContent = schoolConfig.examType;
    document.getElementById("cardStudentName").textContent = student.name;
    document.getElementById("cardFatherName").textContent = student.father || "—";
    document.getElementById("cardRoll").textContent = student.roll;
    document.getElementById("cardClass").textContent = student.class;
    document.getElementById("cardSession").textContent = schoolConfig.session;
    document.getElementById("cardExam").textContent = schoolConfig.examType;
    const formattedDate = schoolConfig.examDate ? new Date(schoolConfig.examDate).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) : "—";
    document.getElementById("cardDate").textContent = formattedDate;
    document.getElementById("cardRemarks").textContent = student.remarks || "Keep up the good work!";

    const tbody = document.getElementById("cardMarksBody");
    tbody.innerHTML = "";
    let grandTotal = 0, grandObtained = 0;
    let failedSubjects = [];

    SUBJECTS.forEach((subj, i) => {
        const total = subj.total;
        const obtained = student.marks[i] || 0;
        grandTotal += total;
        grandObtained += obtained;
        const passMark = getPassMark(total);
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

    const overallPercentage = (grandObtained / grandTotal) * 100;
    const { grade: overallGrade } = getGrade(overallPercentage);

    document.getElementById("cTotal").textContent = grandTotal;
    document.getElementById("cObtained").textContent = grandObtained;
    document.getElementById("cPct").textContent = overallPercentage.toFixed(1) + "%";
    document.getElementById("cGrade").textContent = overallGrade;

    const sameClassStudents = students.filter(s => s.class === student.class);
    const pos = computePosition(student, sameClassStudents);
    document.getElementById("cPos").textContent = pos ? ordinal(pos) : "—";

    const banner = document.getElementById("cBanner");
    if (failedSubjects.length > 0) {
        banner.className = "result-banner banner-fail";
        document.getElementById("cBannerIcon").textContent = "❌";
        let failText = "Failed in: " + failedSubjects.join(", ");
        document.getElementById("cBannerText").textContent = failText;
        document.getElementById("cBannerSub").textContent = `Scored ${overallPercentage.toFixed(1)}% overall`;
    } else {
        banner.className = "result-banner banner-pass";
        document.getElementById("cBannerIcon").textContent = "🎉";
        document.getElementById("cBannerText").textContent = "PASS — Promoted to Next Class";
        document.getElementById("cBannerSub").textContent = `Achieved ${overallPercentage.toFixed(1)}% — Grade ${overallGrade}`;
    }

    document.getElementById("cardActions").style.display = "flex";
}

// ========== LOOKUP ==========
function doLookup() {
    const inputClass = document.getElementById("lkp_class").value.trim().toLowerCase();
    const inputRoll = document.getElementById("lkp_roll").value.trim();
    const msgDiv = document.getElementById("lookupMsg");

    if (!inputRoll) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "⚠️ Please enter a Roll Number.";
        document.getElementById("cardWrapper").style.display = "none";
        document.getElementById("cardActions").style.display = "none";
        return;
    }

    if (students.length === 0) {
        msgDiv.style.display = "block";
        msgDiv.innerHTML = "⚠️ Data is still loading. Please wait a moment and try again.";
        return;
    }

    const student = students.find(s => 
        s.roll.toLowerCase() === inputRoll.toLowerCase() && 
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
    showResultCard(student);
}

function resetLookup() {
    document.getElementById("cardWrapper").style.display = "none";
    document.getElementById("cardActions").style.display = "none";
    document.getElementById("lkp_roll").value = "";
    document.getElementById("lookupMsg").style.display = "none";
}

// ========== FETCH FROM GOOGLE SHEETS API ==========
async function fetchGoogleSheet() {
    const loadingDiv = document.getElementById("loadingMsg");
    loadingDiv.style.display = "block";
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        const data = await response.json();
        const rows = data.values;
        if (!rows || rows.length < 2) throw new Error("No data rows found");

        const dataRows = rows.slice(1);
        const parsed = [];
        for (let row of dataRows) {
            if (row.length < 4 + SUBJECTS.length) continue;
            const roll = row[0]?.trim() || "";
            const name = row[1]?.trim() || "";
            const father = row[2]?.trim() || "";
            const className = row[3]?.trim() || "";
            const marks = [];
            for (let i = 0; i < SUBJECTS.length; i++) {
                let val = parseFloat(row[4 + i]);
                if (isNaN(val)) val = 0;
                marks.push(val);
            }
            const remarks = row[4 + SUBJECTS.length]?.trim() || "";
            if (roll && name) {
                parsed.push({ roll, name, father, class: className, marks, remarks });
            }
        }

        if (parsed.length === 0) throw new Error("No valid student records");
        students = parsed;
        console.log(`Loaded ${students.length} students from Google Sheets API.`);
        loadingDiv.style.display = "none";
    } catch (error) {
        console.error("Failed to load Google Sheet:", error);
        loadingDiv.style.display = "none";
        students = fallbackStudents;
        document.getElementById("lookupMsg").style.display = "block";
        document.getElementById("lookupMsg").innerHTML = `⚠️ Could not load data from Google Sheet. Using example data. Error: ${error.message}`;
    }
}

// ========== EXPORT FUNCTIONS ==========
async function exportPDF() {
    const { jsPDF } = window.jspdf;
    const card = document.getElementById("resultCard");
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
    const card = document.getElementById("resultCard");
    const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: "#fffdf4" });
    const a = document.createElement("a");
    const studentName = document.getElementById("cardStudentName").textContent || "result";
    a.download = `result_${studentName.replace(/\s+/g, "_")}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
}

// ========== INIT ==========
document.getElementById("lkp_class").value = "8th";
fetchGoogleSheet();
