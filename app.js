(function(){
  "use strict";
  const DATA=window.MEDIA_DATA, root=document.getElementById("app");
  if(!DATA||!root){return;}
  const {groups,weeks,lessons}=DATA;
  const filter={audience:"g56",week:0};
  const state={lesson:null,step:0,answer:null,score:0,clues:new Set()};
  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const getGroup=id=>groups.find(g=>g.id===id);
  const getWeek=id=>weeks.find(w=>w.id===id);
  const lessonById=id=>lessons.find(l=>l.id===id);
  function audienceButtons(){
    return '<div class="tabbar" role="group" aria-label="Вікова група">'+groups.map(g=>
      '<button type="button" class="tab" aria-pressed="'+(filter.audience===g.id)+'" data-action="audience" data-id="'+esc(g.id)+'">'+esc(g.name)+'</button>'
    ).join('')+'</div>';
  }
  function weekButtons(){
    return '<div class="week-strip" role="group" aria-label="Тиждень місячника">'+
      '<button type="button" class="week-btn" aria-pressed="'+(filter.week===0)+'" data-action="week" data-week="0">Усі тижні</button>'+
      weeks.map(w=>'<button type="button" class="week-btn" data-action="week" data-week="'+w.id+'" aria-pressed="'+(filter.week===w.id)+'">'+w.id+'. '+esc(w.label)+'</button>').join('')+
      '</div>';
  }
  function card(l){
    const w=getWeek(l.week),g=getGroup(l.group);
    return '<article class="lesson-card" style="--glow:'+esc(w.glow)+'">'+
      '<div class="card-top"><span class="week-tag">'+esc(w.dates)+'</span><span class="level-tag">'+esc(g.short)+'</span></div>'+
      '<div class="lesson-emoji" aria-hidden="true">'+w.emoji+'</div>'+
      '<h3>'+esc(l.title)+'</h3><p>'+esc(l.lead)+'</p>'+
      '<div class="card-bottom"><span>15–20 хв · 3 запитання</span><a href="#lesson='+esc(l.id)+'" aria-label="Відкрити урок: '+esc(l.title)+'">Розпочати →</a></div></article>';
  }
  function renderHome(){
    state.lesson=null;
    const selected=lessons.filter(l=>l.group===filter.audience&&(!filter.week||l.week===filter.week));
    root.innerHTML=
      '<section class="hero">'+
      '<p class="eyebrow">Грудень 2026 · Місячник медіаграмотності</p>'+
      '<h1>Не вір на слово.<br><span class="gradient-text">Перевіряй.</span></h1>'+
      '<p class="hero-lead">Спробуй себе в ролі медіадетектива: досліджуй повідомлення, шукай ознаки маніпуляцій і приймай власні рішення.</p>'+
      '<div class="hero-pill">✦ Короткі уроки · Без реєстрації · На телефоні й на проєкторі</div>'+
      '</section>'+
      '<div class="stats" aria-label="Про проєкт"><div class="stat"><b>16</b><small>інтерактивних уроків</small></div>'+
      '<div class="stat"><b>4</b><small>тематичні тижні</small></div>'+
      '<div class="stat"><b>0</b><small>акаунтів і збору даних</small></div></div>'+
      '<section aria-labelledby="choose-heading"><div class="section-head"><div><p class="eyebrow">Навчальні місії</p><h2 id="choose-heading">Обери свою команду</h2></div><p>Готово для класної години</p></div>'+
      audienceButtons()+weekButtons()+
      '<div class="lesson-grid">'+selected.map(card).join('')+'</div></section>'+
      '<section class="guide-banner"><div><p class="eyebrow">Для класних керівників</p>'+
      '<h2>Урок можна провести без підготовки</h2>'+
      '<p>Відкрийте потрібний модуль, прочитайте коротку інструкцію праворуч і пройдіть завдання з класом. Відповіді пояснюються автоматично, підсумки ніде не зберігаються.</p></div>'+
      '<a class="btn btn-primary" href="#lesson=teachers-w1">Матеріали для педагогів ↗</a></section>';
    document.title="Медіадетектив | Місячник медіаграмотності 2026";
  }
  function visual(l){
    const w=getWeek(l.week);
    return '<div class="visual"><div class="visual-badge">СИМУЛЯЦІЯ · НАВЧАЛЬНИЙ ПРИКЛАД · '+esc(w.label)+'</div>'+
      '<div class="visual-screen"><div class="fake-source">◉ '+esc(l.source)+'</div>'+
      '<span class="fake-tag">Вигаданий кейс</span><strong>'+esc(l.headline)+'</strong>'+
      '<div class="visual-chat"><p>'+esc(l.body)+'</p></div></div></div>';
  }
  function clues(l){
    return '<div class="clue-list">'+l.clues.map((c,i)=>
      '<button type="button" class="clue" data-action="clue" data-index="'+i+'" aria-expanded="'+state.clues.has(i)+'">'+
      '<span class="clue-title"><span>🔎 '+esc(c.title)+'</span><span aria-hidden="true">'+(state.clues.has(i)?'−':'+')+'</span></span>'+
      (state.clues.has(i)?'<span class="clue-answer">'+esc(c.why)+'</span>':'')+'</button>'
    ).join('')+'</div>';
  }
  function sidePanel(l){
    return '<aside class="panel side-panel" aria-label="План проведення уроку">'+
      '<p class="step-label">Сценарій уроку</p><h3>Підказка класному керівнику</h3>'+
      '<p>Орієнтовна тривалість: 15–20 хвилин. Додаткових програм чи реєстрації не потрібно.</p>'+
      '<ol class="checklist"><li><b>2 хв</b> — прочитайте ситуацію вголос.</li>'+
      '<li><b>5 хв</b> — разом відкрийте підказки.</li>'+
      '<li><b>6 хв</b> — обговоріть три запитання тесту.</li>'+
      '<li><b>5 хв</b> — обговоріть висновок і власні приклади.</li></ol>'+
      '<details><summary>Запитання для обговорення</summary><p>'+esc(l.discussion)+'</p></details>'+
      '<details><summary>Методичний акцент</summary><p>Не просіть дітей називати особисті паролі, повідомляти приватні дані або відкривати підозрілі посилання. Усі приклади на сайті вигадані.</p></details>'+
      '<div class="actions"><button type="button" class="btn btn-secondary" data-action="copy">🔗 Скопіювати урок</button>'+
      '<button type="button" class="btn btn-secondary" data-action="print">⎙ Друк</button></div>'+
      '<p id="share-status" class="tiny muted" role="status" aria-live="polite"></p></aside>';
  }
  function renderLesson(l){
    if(state.lesson!==l.id){state.lesson=l.id;state.step=0;state.answer=null;state.score=0;state.clues=new Set();}
    const w=getWeek(l.week),g=getGroup(l.group);
    root.innerHTML=
      '<nav class="breadcrumb" aria-label="Навігація"><a href="#">← До всіх уроків</a> / '+
      esc(g.name)+' / '+esc(w.dates)+'</nav>'+
      '<section class="hero" style="padding-top:15px;padding-bottom:0">'+
      '<p class="eyebrow">Місія '+l.week+' з 4 · '+esc(g.name)+'</p>'+
      '<h1 class="lesson-title">'+esc(l.title)+'</h1><p class="intro">'+esc(l.lead)+'</p></section>'+
      '<div class="lesson-layout"><div class="lesson-main">'+
      '<section class="panel" aria-labelledby="case-title"><p class="step-label">01 / Розглянь докази</p>'+
      '<h2 id="case-title">Що тут не так?</h2><p>Перед тобою вигадане повідомлення. Прочитай його й спробуй помітити підозрілі деталі.</p>'+
      visual(l)+'</section>'+
      '<section class="panel" aria-labelledby="clue-heading"><p class="step-label">02 / Досліди деталі</p>'+
      '<h2 id="clue-heading">Відкрий три підказки</h2><p>Натискай на кожну знахідку, щоб побачити пояснення.</p>'+
      '<div id="clue-region">'+clues(l)+'</div></section>'+
      '<section class="panel" aria-labelledby="quiz-heading"><p class="step-label">03 / Перевір себе</p><h2 id="quiz-heading">Мініквіз</h2>'+
      '<div id="quiz-region"></div></section>'+
      '<div class="callout"><b>Головне правило:</b> '+esc(l.rule)+'</div>'+
      '<div class="actions"><a class="btn btn-secondary" href="#">← Інші уроки</a>'+
      (l.week<4?'<a class="btn btn-outline" href="#lesson='+esc(l.group)+'-w'+(l.week+1)+'">Наступна місія →</a>':'')+
      '</div></div>'+sidePanel(l)+'</div>';
    renderQuiz();
    document.title=l.title+" | Медіадетектив";
  }
  function renderQuiz(){
    const holder=document.getElementById("quiz-region");if(!holder||!state.lesson)return;
    const l=lessonById(state.lesson);
    if(state.step>=l.quiz.length){
      const percentage=Math.round(state.score/l.quiz.length*100);
      holder.innerHTML='<p class="eyebrow">Місію завершено</p><div class="result-score" aria-label="'+percentage+' відсотків">'+percentage+'%</div>'+
        '<h3>'+(state.score===l.quiz.length?'Відмінна робота, детективе!':'Гарна спроба! Дізнавайся більше.')+'</h3>'+
        '<p>Правильних відповідей: <b>'+state.score+' з '+l.quiz.length+'</b>. Це лише тренування, не оцінка в журналі.</p>'+
        '<p class="callout">'+esc(l.rule)+'</p>'+
        '<div class="actions"><button class="btn btn-primary" type="button" data-action="restart">Пройти ще раз ↻</button>'+
        '<a class="btn btn-secondary" href="#">Обрати інший урок →</a></div>';
      return;
    }
    const current=l.quiz[state.step], answered=state.answer!==null;
    holder.innerHTML=
      '<div class="quiz-counter"><span>Питання '+(state.step+1)+' / '+l.quiz.length+'</span><span>Вірних: '+state.score+'</span></div>'+
      '<div class="progress" role="progressbar" aria-valuenow="'+state.step+'" aria-valuemin="0" aria-valuemax="'+l.quiz.length+'" aria-label="Виконано запитань"><i style="width:'+(state.step/l.quiz.length*100)+'%"></i></div>'+
      '<h3>'+esc(current.question)+'</h3>'+
      '<div class="quiz-options" role="group" aria-label="Варіанти відповідей">'+current.options.map((opt,i)=>{
        const modifier=answered?(i===current.correct?' is-correct':i===state.answer?' is-wrong':''):'';
        return '<button type="button" class="option'+modifier+'" data-action="pick" data-index="'+i+'" '+(answered?'disabled':'')+'>'+
          '<span class="option-letter" aria-hidden="true">'+String.fromCharCode(65+i)+'</span><span>'+esc(opt)+'</span></button>';
      }).join('')+'</div>'+
      (answered?
        '<div class="feedback'+(state.answer===current.correct?'':' bad')+'" role="status">'+
        '<b>'+(state.answer===current.correct?'✓ Правильно!':'↗ Спробуй запам’ятати')+'</b>'+esc(current.why)+'</div>'+
        '<button class="btn btn-primary" type="button" data-action="next">'+
        (state.step===l.quiz.length-1?'Показати результат →':'Наступне питання →')+'</button>'
        :'<p class="muted tiny">Обери відповідь. Після вибору з’явиться пояснення.</p>');
  }
  function route(){
    const match=location.hash.match(/^#lesson=([a-z0-9-]+)$/i);
    const lesson=match&&lessonById(match[1]);
    if(lesson)renderLesson(lesson);else renderHome();
    if(match)window.scrollTo({top:0,behavior:"instant"});
  }
  document.addEventListener("click",async function(e){
    const btn=e.target.closest("button[data-action]");if(!btn)return;
    const act=btn.dataset.action;
    if(act==="audience"){filter.audience=btn.dataset.id;filter.week=0;renderHome();return;}
    if(act==="week"){filter.week=Number(btn.dataset.week);renderHome();return;}
    if(act==="clue"){
      const idx=Number(btn.dataset.index);if(state.clues.has(idx))state.clues.delete(idx);else state.clues.add(idx);
      const region=document.getElementById("clue-region");if(region)region.innerHTML=clues(lessonById(state.lesson));return;
    }
    if(act==="pick"){
      if(state.answer!==null)return;
      state.answer=Number(btn.dataset.index);
      if(state.answer===lessonById(state.lesson).quiz[state.step].correct)state.score++;
      renderQuiz();return;
    }
    if(act==="next"){state.step++;state.answer=null;renderQuiz();return;}
    if(act==="restart"){state.step=0;state.score=0;state.answer=null;renderQuiz();return;}
    if(act==="print"){window.print();return;}
    if(act==="copy"){
      const url=location.origin+location.pathname+"#lesson="+state.lesson;
      const status=document.getElementById("share-status");
      try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw new Error("clipboard unavailable");
        await navigator.clipboard.writeText(url);if(status)status.textContent="Посилання скопійовано!";
      }catch(_){if(status)status.textContent="Скопіюйте з адресного рядка: "+url;}
    }
  });
  window.addEventListener("hashchange",route);
  route();
})();
