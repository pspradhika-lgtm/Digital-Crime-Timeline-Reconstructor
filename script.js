let evidenceList = [];

const addBtn = document.getElementById('addBtn');
const timelineDiv = document.getElementById('timeline');
const suspiciousDiv = document.getElementById('suspicious');

addBtn.addEventListener('click', () => {
  const type = document.getElementById('type').value;
  const time = document.getElementById('time').value;
  const desc = document.getElementById('desc').value.trim();

  if (!time || !desc) {
    alert('Please enter all fields');
    return;
  }

  evidenceList.push({ type, time, desc });

  evidenceList.sort((a, b) => a.time.localeCompare(b.time));

  updateTimeline();
  checkSuspicious();
  document.getElementById('desc').value = '';
});

// Display timeline
function updateTimeline() {
  timelineDiv.innerHTML = '';
  evidenceList.forEach((e, index) => {
    const div = document.createElement('div');
    div.className = 'event';
    div.innerHTML = `<strong>${e.time}</strong> – [${e.type}] ${e.desc}`;
    timelineDiv.appendChild(div);
  });
}

// Suspicious gaps and overlaps
function checkSuspicious() {
  suspiciousDiv.innerHTML = '';
  for (let i = 1; i < evidenceList.length; i++) {
    const prev = evidenceList[i-1];
    const curr = evidenceList[i];
    const gap = getMinutes(curr.time) - getMinutes(prev.time);

    // Flag large unexplained gaps
    if (gap > 15) {
      const div = document.createElement('div');
      div.className = 'suspicious';
      div.textContent = `⚠️ ${gap}-minute unexplained gap between "${prev.desc}" and "${curr.desc}"`;
      suspiciousDiv.appendChild(div);
    }

    // Overlapping check (for same location events like GPS/CCTV)
    if (prev.type === 'GPS' && curr.type === 'GPS' && prev.desc === curr.desc) {
      const div = document.createElement('div');
      div.className = 'suspicious';
      div.textContent = `⚠️ Overlapping GPS location detected at "${curr.desc}"`;
      suspiciousDiv.appendChild(div);
    }
  }
}

function getMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h*60 + m;
}
