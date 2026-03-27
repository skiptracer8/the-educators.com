// ─── DATA STORE ───
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
let schoolConfig = { school:'', session:'', exam:'Annual Exam', date:'', class:'8th', passPct:40 };
let logoDataURL = null;

// ─── TAB SWITCHER ───
function switchTab(id, btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  else {
    const map={'adminPanel':0,'lookupPanel':1,'cardPanel':2};
    document.querySelectorAll('.tab-btn')[map[id]]?.classList.add('active');
  }
  document.getElementById('cardActions').style.display = (id==='cardPanel')?'flex':'none';
}

// ─── LOGO UPLOAD ───
function handleLogoUpload(e){
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    logoDataURL = ev.target.result;
    const prev = document.getElementById('adminLogoPreview');
    prev.innerHTML = `<img src="${logoDataURL}" alt="logo">`;
    saveAllData();
  };
  reader.readAsDataURL(file);
}

// ─── PASS MARK HELPER ───
function getPassMark(total){
  return Math.ceil((schoolConfig.passPct / 100) * total);
}

function updatePassHint(){
  const pct = schoolConfig.passPct || 40;
  const passOf100 = Math.ceil(pct);
  const hint = document.getElementById('passHintPill');
  if(hint) hint.textContent = `Pass mark = ${passOf100} / 100`;
}

// ─── SYNC CONFIG ───
function syncConfig(){
  schoolConfig.school  = document.getElementById('cfg_school').value;
  schoolConfig.session = document.getElementById('cfg_session').value;
  schoolConfig.exam    = document.getElementById('cfg_exam').value;
  schoolConfig.date    = document.getElementById('cfg_date').value;
  schoolConfig.class   = document.getElementById('cfg_class').value;
  schoolConfig.passPct = parseFloat(document.getElementById('cfg_pass_pct').value) || 40;
  updatePassHint();
}

// ─── STUDENT TABLE ───
function addStudentRow(data=null){
  const tbody = document.getElementById('adminBody');
  const idx = tbody.rows.length;
  const d = data || {roll:'',name:'',father:'',marks:[],remarks:''};
  const marksInputs = SUBJECTS.map((s,i)=>
  `<td><input type="number" id="s${idx}_m${i}" 
    value="${(d.marks&&d.marks[i]!==undefined)?d.marks[i]:''}" 
    min="0" max="${s.total}" oninput="autoSave()"></td>`
).join('');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input id="s${idx}_roll" value="${d.roll}" placeholder="01" style="width:50px" oninput="autoSave()"></td>
    <td><input id="s${idx}_name" value="${d.name}" placeholder="Student name" style="width:130px" oninput="autoSave()"></td>
    <td><input id="s${idx}_father" value="${d.father||''}" placeholder="Father name" style="width:120px" oninput="autoSave()"></td>
    ${marksInputs}
    <td><input id="s${idx}_rem" value="${d.remarks||''}" placeholder="Remarks" style="width:110px" oninput="autoSave()"></td>
    <td><button class="del-btn" onclick="deleteRow(this)">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function deleteRow(btn){ btn.closest('tr').remove(); autoSave(); }

function rebuildStudentTable(){
  const body = document.getElementById('adminBody');
  const existing = collectStudents();
  body.innerHTML='';
  existing.forEach(s=>addStudentRow(s));
  syncConfig();
}

function collectStudents(){
  const body = document.getElementById('adminBody');
  const rows = body.rows; const arr=[];
  for(let i=0;i<rows.length;i++){
    const roll   = document.getElementById(`s${i}_roll`)?.value.trim()||'';
    const name   = document.getElementById(`s${i}_name`)?.value.trim()||'';
    const father = document.getElementById(`s${i}_father`)?.value.trim()||'';
    const remarks= document.getElementById(`s${i}_rem`)?.value.trim()||'';
    const marks  = SUBJECTS.map((_,j)=>parseFloat(document.getElementById(`s${i}_m${j}`)?.value)||0);
    if(roll||name) arr.push({roll,name,father,marks,remarks});
  }
  return arr;
}

// ─── SAVE / LOAD ───
function saveAllData(){
  syncConfig();
  students = collectStudents();
  localStorage.setItem('rc_students', JSON.stringify(students));
  localStorage.setItem('rc_config',   JSON.stringify(schoolConfig));
  if(logoDataURL) localStorage.setItem('rc_logo', logoDataURL);
  showSaved();
}
let autoSaveTimer;
function autoSave(){ clearTimeout(autoSaveTimer); autoSaveTimer=setTimeout(saveAllData,800); }

function showSaved(){
  const notice = document.querySelector('.save-notice');
  if(notice){ notice.textContent='✅ Saved! Data is stored in browser.'; 
    setTimeout(()=>notice.textContent='✅ Data is saved automatically in your browser. Close and reopen — data stays!',2000); }
}

function loadAllData(){
  const sc = localStorage.getItem('rc_config');
  const st = localStorage.getItem('rc_students');
  const lg = localStorage.getItem('rc_logo');
  if(sc) {
    schoolConfig=JSON.parse(sc);
    // migrate old configs that used 'pass' instead of 'passPct'
    if(schoolConfig.pass !== undefined && schoolConfig.passPct === undefined){
      schoolConfig.passPct = 40; // default to 40%
      delete schoolConfig.pass;
    }
    applyConfigToForm();
  }
  if(st) { students=JSON.parse(st); students.forEach(s=>addStudentRow(s)); }
  if(lg) { logoDataURL=lg; document.getElementById('adminLogoPreview').innerHTML=`<img src="${lg}" alt="logo">`; }
  if(!st||JSON.parse(st).length===0) addStudentRow();
  updatePassHint();
}

function applyConfigToForm(){
  document.getElementById('cfg_school').value    = schoolConfig.school||'';
  document.getElementById('cfg_session').value   = schoolConfig.session||'';
  document.getElementById('cfg_exam').value      = schoolConfig.exam||'Annual Exam';
  document.getElementById('cfg_date').value      = schoolConfig.date||'';
  document.getElementById('cfg_class').value     = schoolConfig.class||'8th';
  document.getElementById('cfg_pass_pct').value  = schoolConfig.passPct||40;
}

function clearAllData(){
  if(!confirm('Clear ALL student data? This cannot be undone.')) return;
  localStorage.clear(); students=[];
  document.getElementById('adminBody').innerHTML='';
  addStudentRow();
}

// ─── GRADE HELPER ───
function getGrade(pct){
  if(pct>=90) return {g:'A+',cls:'grade-A'};
  if(pct>=80) return {g:'A', cls:'grade-A'};
  if(pct>=70) return {g:'B+',cls:'grade-B'};
  if(pct>=60) return {g:'B', cls:'grade-B'};
  if(pct>=50) return {g:'C', cls:'grade-C'};
  if(pct>=40) return {g:'D', cls:'grade-D'};
  return {g:'F',cls:'grade-F'};
}

// ─── COMPUTE STUDENT RESULT SUMMARY ───
function computeResult(student){
  const passPct = schoolConfig.passPct || 40;
  let grandTotal=0, grandObtained=0, anyFail=false;
  SUBJECTS.forEach((subj,i)=>{
  const total = subj.total;
  const obt = student.marks[i] || 0;
    grandTotal+=total; grandObtained+=obt;
    const passmark = getPassMark(total);
    if(obt < passmark) anyFail=true;
  });
  const pct=(grandObtained/grandTotal)*100;
  const {g}=getGrade(pct);

  // Position among all students
  const all = students.map(s=>({roll:s.roll,total:s.marks.reduce((a,b)=>a+b,0)}));
  all.sort((a,b)=>b.total-a.total);
  const pos = all.findIndex(s=>s.roll===student.roll)+1;

  return {grandTotal, grandObtained, pct, grade:g, anyFail, pos};
}

// ─── STUDENT LOOKUP ───
function doLookup(){
  saveAllData();
  const cls  = document.getElementById('lkp_class').value.trim().toLowerCase();
  const roll = document.getElementById('lkp_roll').value.trim();
  const msg  = document.getElementById('lookupMsg');
  if(!roll){ msg.style.display='block'; msg.textContent='⚠️ Please enter a Roll Number.'; return; }
  
  const cfgClass = (schoolConfig.class||'8th').toLowerCase();
  const match = students.find(s=>
    s.roll.toLowerCase()===roll.toLowerCase() &&
    (cls===''||cls===cfgClass||cfgClass.includes(cls))
  );

  if(!match){
    msg.style.display='block';
    msg.innerHTML=`❌ No result found for Roll No. <b>${roll}</b>. Please check the number or contact your teacher.`;
    return;
  }
  msg.style.display='none';
  showResultCard(match);
}

// ─── RENDER RESULT CARD ───
function showResultCard(student){
  // Header
  const cardLogo = document.getElementById('cardLogo');
  if(logoDataURL) cardLogo.innerHTML=`<img src="${logoDataURL}" alt="logo">`;
  else { cardLogo.innerHTML=''; cardLogo.textContent=(schoolConfig.school||'S').charAt(0).toUpperCase(); }

  document.getElementById('cardSchoolName').textContent = schoolConfig.school || 'School Name';
  document.getElementById('cardExamBadge').textContent  = schoolConfig.exam   || 'Annual Exam';
  document.getElementById('cardStudentName').textContent= student.name;
  document.getElementById('cardFatherName').textContent = student.father||'—';
  document.getElementById('cardRoll').textContent        = student.roll;
  document.getElementById('cardClass').textContent       = schoolConfig.class||'—';
  document.getElementById('cardSession').textContent     = schoolConfig.session||'—';
  document.getElementById('cardExam').textContent        = schoolConfig.exam||'—';
  const d = schoolConfig.date ? new Date(schoolConfig.date).toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  document.getElementById('cardDate').textContent = d;
  document.getElementById('cardRemarks').textContent = student.remarks||'Keep up the good work!';

  // Update column header with actual pass pct
  const passPct = schoolConfig.passPct || 40;

  // Marks table
  const tbody = document.getElementById('cardMarksBody');
  tbody.innerHTML='';
  let grandTotal=0, grandObtained=0, anyFail=false;

  SUBJECTS.forEach((subj,i)=>{
    const total = subj.total; obt=student.marks[i]||0;
    grandTotal+=total; grandObtained+=obt;
    const passmark = getPassMark(total);
    const pct=(obt/total)*100;
    const {g,cls}=getGrade(pct);
    const passed = obt >= passmark;
    if(!passed) anyFail=true;
    const tr=document.createElement('tr');
    tr.innerHTML=`
      <td class="sno">${i+1}</td>
      <td>${subj.name}</td>
      <td>${total}</td>
      <td><b>${obt}</b></td>
      <td>${passmark} <span style="font-size:.65rem;color:#999">(${passPct}%)</span></td>
      <td><span class="grade-badge ${cls}">${g}</span></td>
      <td>${passed?`<span class="status-pass">✅ Pass</span>`:`<span class="status-fail">❌ Fail</span>`}</td>
    `;
    tbody.appendChild(tr);
  });

  // Totals
  const pct=(grandObtained/grandTotal)*100;
  const {g}=getGrade(pct);
  document.getElementById('cTotal').textContent    = grandTotal;
  document.getElementById('cObtained').textContent = grandObtained;
  document.getElementById('cPct').textContent      = pct.toFixed(1)+'%';
  document.getElementById('cGrade').textContent    = g;

  // Position among classmates
  const all = students.map(s=>({roll:s.roll,total:s.marks.reduce((a,b)=>a+b,0)}));
  all.sort((a,b)=>b.total-a.total);
  const pos = all.findIndex(s=>s.roll===student.roll)+1;
  document.getElementById('cPos').textContent = pos ? ordinal(pos) : '—';

  // Banner
  const banner=document.getElementById('cBanner');
  if(anyFail){
    banner.className='result-banner banner-fail';
    document.getElementById('cBannerIcon').textContent='❌';
    document.getElementById('cBannerText').textContent='FAIL — Failed in one or more subjects';
    document.getElementById('cBannerSub').textContent=`Scored ${pct.toFixed(1)}% overall`;
  } else {
    banner.className='result-banner banner-pass';
    document.getElementById('cBannerIcon').textContent='🎉';
    document.getElementById('cBannerText').textContent='PASS — Promoted to Next Class';
    document.getElementById('cBannerSub').textContent=`Achieved ${pct.toFixed(1)}% — Grade ${g}`;
  }

  // Show card tab
  document.getElementById('cardTabBtn').style.display='inline-block';
  switchTab('cardPanel', document.querySelectorAll('.tab-btn')[2]);
}

function ordinal(n){
  const s=['th','st','nd','rd'],v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

// ─── CSV IMPORT / EXPORT ───
function downloadTemplate(){
  const headers = ['Roll No','Student Name','Father Name',...SUBJECTS,'Remarks'];
  const csv = headers.join(',')+'\n'+'01,Student Name,Father Name,85,78,90,72,88,75,95,Good student';
  downloadFile('result_template.csv','text/csv',csv);
}

function exportCSV(){
  saveAllData();
  const headers = ['Roll No','Student Name','Father Name',...SUBJECTS,'Remarks'];
  const rows = students.map(s=>[s.roll,s.name,s.father,...s.marks,s.remarks].map(v=>`"${v}"`).join(','));
  downloadFile('students_data.csv','text/csv',[headers.join(','),...rows].join('\n'));
}

// ─── EXPORT RESULTS CSV (with computed totals, pct, grade, position, pass/fail) ───
function exportResultsCSV(){
  saveAllData();
  if(students.length===0){ alert('No student data to export.'); return; }

  const passPct = schoolConfig.passPct || 40;

  // Compute positions for all students
  const withTotals = students.map(s=>({...s, total:s.marks.reduce((a,b)=>a+b,0)}));
  withTotals.sort((a,b)=>b.total-a.total);
  const posMap = {};
  withTotals.forEach((s,i)=>posMap[s.roll]=i+1);

  const headers = [
    'Roll No','Student Name','Father Name',
    ...SUBJECTS,
    'Total Marks','Obtained','Percentage (%)','Grade',
    `Pass Mark (${passPct}% each)`,
    'Overall Result','Position','Remarks'
  ];

  const rows = students.map(s=>{
    let grandTotal=0, grandObtained=0, anyFail=false;
    SUBJECTS.forEach((subj,i)=>{
  const total = SUBJECTS[i].total;
const obt = s.marks[i] || 0;
      grandTotal+=total; grandObtained+=obt;
      if(obt < getPassMark(total)) anyFail=true;
    });
    const pct=(grandObtained/grandTotal)*100;
    const {g}=getGrade(pct);
    const passMarkPer = getPassMark(100);
    const pos = posMap[s.roll]||'—';
    return [
      s.roll, s.name, s.father,
      ...s.marks,
      grandTotal, grandObtained, pct.toFixed(1), g,
      passMarkPer,
      anyFail?'FAIL':'PASS',
      ordinal(pos),
      s.remarks||''
    ].map(v=>`"${v}"`).join(',');
  });

  // Add school info header block
  const school = schoolConfig.school || 'School';
  const session = schoolConfig.session || '';
  const exam = schoolConfig.exam || '';
  const cls = schoolConfig.class || '';
  const metaLines = [
    `"${school} — ${exam} Results"`,
    `"Class: ${cls} | Session: ${session} | Pass Percentage: ${passPct}%"`,
    `"Generated: ${new Date().toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'numeric'})}"`,
    '', // blank line separator
  ];

  const csvContent = [...metaLines, headers.join(','), ...rows].join('\n');
  downloadFile(`results_${cls}_${exam.replace(/\s+/g,'_')}.csv`,'text/csv', csvContent);
}

function importCSV(e){
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const lines=ev.target.result.trim().split('\n');
    const data=[];
    for(let i=1;i<lines.length;i++){
      const cols=lines[i].split(',').map(c=>c.replace(/"/g,'').trim());
      if(cols.length<3) continue;
      const marks=cols.slice(3,3+SUBJECTS.length).map(Number);
      data.push({roll:cols[0],name:cols[1],father:cols[2],marks,remarks:cols[3+SUBJECTS.length]||''});
    }
    document.getElementById('adminBody').innerHTML='';
    data.forEach(s=>addStudentRow(s));
    saveAllData();
    alert(`✅ Imported ${data.length} student(s) successfully!`);
  };
  reader.readAsText(file);
}

function downloadFile(name,type,content){
  const a=document.createElement('a');
  a.href='data:'+type+';charset=utf-8,'+encodeURIComponent(content);
  a.download=name; a.click();
}

// ─── PDF EXPORT ───
async function exportPDF(){
  const {jsPDF}=window.jspdf;
  const card=document.getElementById('resultCard');
  const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#fffdf4'});
  const imgData=canvas.toDataURL('image/png');
  const pdf=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const w=pdf.internal.pageSize.getWidth();
  const h=(canvas.height/canvas.width)*w;
  pdf.addImage(imgData,'PNG',0,0,w,Math.min(h,297));
  const name=document.getElementById('cardStudentName').textContent||'result';
  pdf.save(`result_${name.replace(/\s+/g,'_')}.pdf`);
}

// ─── IMAGE EXPORT ───
async function exportImage(){
  const card=document.getElementById('resultCard');
  const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:'#fffdf4'});
  const a=document.createElement('a');
  const name=document.getElementById('cardStudentName').textContent||'result';
  a.download=`result_${name.replace(/\s+/g,'_')}.png`;
  a.href=canvas.toDataURL('image/png');
  a.click();
}

// ─── INIT ───
document.getElementById('cfg_date').valueAsDate=new Date();
loadAllData();

// sync config inputs
['cfg_school','cfg_session','cfg_exam','cfg_date','cfg_class','cfg_pass_pct'].forEach(id=>{
  document.getElementById(id).addEventListener('input',()=>{syncConfig();autoSave();});
  document.getElementById(id).addEventListener('change',()=>{syncConfig();autoSave();});
});