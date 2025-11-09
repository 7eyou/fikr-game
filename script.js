
// Sections data (demo Arabic questions)
const demoSections = [
  { key: 'تاريخ', img: 'imges/history.svg', questions: {
    '200': { q: 'في أي عام تأسست الدولة السعودية الأولى؟', a: 'الجواب: 1727 تقريبًا' },
    '400': { q: 'من كان أول خليفة بعد الرسول ﷺ؟', a: 'الجواب: أبو بكر الصديق' },
    '600': { q: 'متى انتهت الحرب العالمية الثانية؟', a: 'الجواب: 1945' }
  }},
  { key: 'علوم', img: 'imges/science.svg', questions: {
    '200': { q: 'ما هو أكبر كوكب في المجموعة الشمسية؟', a: 'الجواب: كوكب المشتري' },
    '400': { q: 'ما اسم العملية التي يتنفس فيها النبات؟', a: 'الجواب: التمثيل الضوئي' },
    '600': { q: 'ما العنصر الذي يرمز له بـ "Au"?', a: 'الجواب: الذهب' }
  }},
  { key: 'خرائط', img: 'imges/maps.svg', questions: {
    '200': { q: 'ما عاصمة العراق؟', a: 'الجواب: بغداد' },
    '400': { q: 'في أي قارة تقع مصر؟', a: 'الجواب: قارة أفريقيا' },
    '600': { q: 'أي دولة تفصل بين أمريكا وكندا؟', a: 'الجواب: لا توجد دولة تفصل بينهما، فهما يتقاسمان حدودًا مباشرة' }
  }},
  { key: 'أعلام', img: 'imges/flags.svg', questions: {
    '200': { q: 'علم أحمر عليه ورقة قيقب يرمز لأي دولة؟', a: 'الجواب: كندا' },
    '400': { q: 'ما لون علم اليابان؟', a: 'الجواب: أبيض مع قرص أحمر' },
    '600': { q: 'أي دولة علمها أخضر وأبيض وأحمر بنجمة خضراء؟', a: 'الجواب: الجزائر' }
  }},
  { key: 'رياضة', img: 'imges/sports.svg', questions: {
    '200': { q: 'كم عدد لاعبي فريق كرة القدم؟', a: 'الجواب: 11 لاعبًا' },
    '400': { q: 'من فاز بكأس العالم 2018؟', a: 'الجواب: منتخب فرنسا' },
    '600': { q: 'من أول من سجل هدفًا في تاريخ كأس العالم؟', a: 'الجواب: ليس هناك إجماع؛ أول بطولة كانت 1930' }
  }},
  { key: 'من أنا؟', img: 'imges/whoami.svg', questions: {
    '200': { q: 'أنا كوكب أحمر اللون، من أكون؟', a: 'الجواب: كوكب المريخ' },
    '400': { q: 'أنا نهر يمر في مصر، من أكون؟', a: 'الجواب: نهر النيل' },
    '600': { q: 'أنا العالم الذي اخترع المصباح الكهربائي، من أكون؟', a: 'الجواب: توماس إديسون (مع ملاحظة تطور الاختراعات)' }
  }}
];

// helper to get sections from localStorage or demo if not present
function loadSelectedSections(){
  const sel = JSON.parse(localStorage.getItem('selectedSections')||'null');
  if(Array.isArray(sel) && sel.length>0) return sel;
  // default demo: pick first 6 keys
  return demoSections.slice(0,6).map(s=>s.key);
}

// helper to find section object by key
function findSectionObj(key){
  return demoSections.find(s=>s.key===key);
}

// ---------- index (fikr.html) logic ----------
if(document.getElementById('sectionsContainer')){
  const sectionsContainer = document.getElementById('sectionsContainer');
  const startBtn = document.getElementById('startButton');
  // show demo sections from demoSections
  demoSections.forEach(sec=>{
    const div = document.createElement('div');
    div.className='card';
    div.innerHTML = `<img src="${sec.img}" alt=""><div class="label">${sec.key}</div>`;
    div.addEventListener('click', ()=>{
      if(div.classList.contains('selected')){
        div.classList.remove('selected');
        const arr = JSON.parse(localStorage.getItem('chosenTemp')||'[]');
        const idx = arr.indexOf(sec.key);
        if(idx>-1){ arr.splice(idx,1); localStorage.setItem('chosenTemp', JSON.stringify(arr)); }
      } else {
        const arr = JSON.parse(localStorage.getItem('chosenTemp')||'[]');
        if(arr.length<6){ arr.push(sec.key); localStorage.setItem('chosenTemp', JSON.stringify(arr)); div.classList.add('selected'); }
        else { alert('يمكنك اختيار 6 أقسام فقط'); }
      }
      startBtn.disabled = !(JSON.parse(localStorage.getItem('chosenTemp')||'[]').length===6);
    });
    sectionsContainer.appendChild(div);
  });

  // pre-select if previously chosen
  const pre = JSON.parse(localStorage.getItem('chosenTemp')||'[]');
  if(Array.isArray(pre) && pre.length>0){
    // mark selected cards
    const cards = Array.from(document.getElementsByClassName('card'));
    cards.forEach(c=>{ if(c.querySelector('.label') && pre.includes(c.querySelector('.label').innerText)) c.classList.add('selected'); });
    document.getElementById('startButton').disabled = !(pre.length===6);
  }

  startBtn.addEventListener('click', ()=>{
    const chosen = JSON.parse(localStorage.getItem('chosenTemp')||'[]');
    if(!Array.isArray(chosen) || chosen.length!==6){ alert('اختر 6 أقسام ثم اضغط ابدأ'); return; }
    localStorage.setItem('selectedSections', JSON.stringify(chosen));
    // clear temp chosen
    localStorage.removeItem('chosenTemp');
    // set scores to zero
    localStorage.setItem('scoreA', '0'); localStorage.setItem('scoreB','0');
    window.location.href = 'game.html';
  });
}

// ---------- game.html logic ----------
if(document.getElementById('sectionsList')){
  const sel = loadSelectedSections(); // array of keys
  document.getElementById('chosenTitle').innerText = 'الأقسام المختارة:';
  const list = document.getElementById('sectionsList');
  const scoreAEl = document.getElementById('scoreA');
  const scoreBEl = document.getElementById('scoreB');
  const totalEl = document.getElementById('totalScore');
  let scoreA = parseInt(localStorage.getItem('scoreA')||'0');
  let scoreB = parseInt(localStorage.getItem('scoreB')||'0');
  function refreshScores(){ scoreAEl.innerText = scoreA; scoreBEl.innerText = scoreB; totalEl.innerText = (scoreA+scoreB); }
  refreshScores();

  sel.forEach(key=>{
    const secObj = findSectionObj(key);
    const block = document.createElement('div');
    block.className='section-block';
    block.innerHTML = `<div style="font-weight:700;margin-bottom:8px">${secObj.key}</div><img src="${secObj.img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px">`;
    const qrow = document.createElement('div'); qrow.className='q-row';
    ['200','400','600'].forEach(val=>{
      const btn = document.createElement('button');
      btn.className='q-btn q-'+val;
      btn.innerText = val + ' نقطة';
      btn.addEventListener('click', ()=> openQuestion(secObj, val));
      qrow.appendChild(btn);
    });
    block.appendChild(qrow);
    list.appendChild(block);
  });

  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalQuestion = document.getElementById('modalQuestion');
  const modalAnswer = document.getElementById('modalAnswer');
  const showAnswerBtn = document.getElementById('showAnswerBtn');
  const teamABtn = document.getElementById('teamABtn');
  const teamBBtn = document.getElementById('teamBBtn');
  const noOneBtn = document.getElementById('noOneBtn');

  let currentPoints = 0;
  function openQuestion(secObj, val){
    const q = secObj.questions[val].q;
    const a = secObj.questions[val].a;
    currentPoints = parseInt(val);
    modalTitle.innerText = secObj.key + ' - ' + val + ' نقطة';
    modalQuestion.innerText = q;
    modalAnswer.style.display = 'none'; modalAnswer.innerText = a;
    modal.style.display = 'flex';
    // showAnswerBtn visible
    showAnswerBtn.style.display = 'inline-block';
  }

  showAnswerBtn.addEventListener('click', ()=>{
    modalAnswer.style.display = 'block';
    showAnswerBtn.style.display = 'none';
  });

  teamABtn.addEventListener('click', ()=>{
    scoreA += currentPoints; localStorage.setItem('scoreA', scoreA); refreshScores(); closeModal();
  });
  teamBBtn.addEventListener('click', ()=>{
    scoreB += currentPoints; localStorage.setItem('scoreB', scoreB); refreshScores(); closeModal();
  });
  noOneBtn.addEventListener('click', ()=>{
    // no one gets points
    closeModal();
  });

  function closeModal(){ modal.style.display='none'; modalAnswer.style.display='none'; currentPoints=0; }

  // back button
  document.getElementById('backBtn').addEventListener('click', ()=>{ window.location.href='fikr.html'; });

  // close modal on outside click
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
}
