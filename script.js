let evidenceList = [];

const addBtn = document.getElementById('addBtn');
const exportBtn = document.getElementById('exportBtn');
const timelineDiv = document.getElementById('timeline');
const suspiciousDiv = document.getElementById('suspicious');

addBtn.addEventListener('click', () => {
  const type = document.getElementById('type').value;
  const time = document.getElementById('time').value;
  const desc = document.getElementById('desc').value.trim();

  if (!time || !desc) { alert('Enter all fields'); return; }

  evidenceList.push({ type, time, desc });
  evidenceList.sort((a,b) => a.time.localeCompare(b.time));

  updateTimeline();
  checkSuspicious();
  document.getElementById('desc').value = '';
});

// Timeline display with colored bars
function updateTimeline() {
  timelineDiv.innerHTML = '';
  for (let i=0; i<evidenceList.length; i++) {
    const e = evidenceList[i];
    const div = document.createElement('div');
    div.className = `event ${e.type.replace(" ", "\\ ")}`;
    div.innerHTML = `<strong>${e.time}</strong> – [${e.type}] ${e.desc}`;
    timelineDiv.appendChild(div);

    // Show gap bar if suspicious
    if (i>0) {
      const gap = getMinutes(e.time) - getMinutes(evidenceList[i-1].time);
      if (gap > 15) {
        const bar = document.createElement('div');
        bar.className = 'gap-bar';
        bar.title = `⚠️ ${gap}-minute unexplained gap`;
        timelineDiv.insertBefore(bar, div);
      }
    }
  }
}

// Suspicious detection
function checkSuspicious() {
  suspiciousDiv.innerHTML = '';
  for (let i=1; i<evidenceList.length; i++) {
    const prev = evidenceList[i-1], curr = evidenceList[i];
    const gap = getMinutes(curr.time)-getMinutes(prev.time);
    if (gap>15) {
      const div = document.createElement('div');
      div.className='suspicious';
      div.textContent = `⚠️ ${gap}-minute gap between "${prev.desc}" and "${curr.desc}"`;
      suspiciousDiv.appendChild(div);
    }

    // Overlapping GPS/CCTV
    if (prev.type==='GPS' && curr.type==='GPS' && prev.desc===curr.desc) {
      const div = document.createElement('div');
      div.className='suspicious';
      div.textContent = `⚠️ Overlapping GPS location detected at "${curr.desc}"`;
      suspiciousDiv.appendChild(div);
    }
  }
}

function getMinutes(time) {
  const [h,m]=time.split(':').map(Number);
  return h*60 + m;
}

// PDF Export
exportBtn.addEventListener('click', () => {
  const element = document.createElement('div');
  element.innerHTML = `<h1>Crime Timeline Report</h1>${timelineDiv.innerHTML}<h2>Suspicious Findings</h2>${suspiciousDiv.innerHTML}`;
  html2pdf().from(element).set({margin:0.5, filename:'Crime_Timeline.pdf', html2canvas:{scale:2}}).save();
});

