// ─── Chapter manifest ──────────────────────────────────────
const CHAPTERS = [
  { id: 'intro',   num: '00', label: '소개',                    title: '대학 신입생을 위한 GitHub 입문 가이드', file: 'docs/00-readme.md',         section: 'cover', time: '3분' },
  { id: 'ch1',     num: '01', label: 'Git과 GitHub의 차이',      title: 'Git과 GitHub의 차이, 왜 배워야 하나요?',  file: 'docs/01-git-vs-github.md',  section: '1부 기초',   time: '10분' },
  { id: 'ch2',     num: '02', label: '계정·Git·VS Code·SSH 설정', title: '계정·Git·VS Code·SSH 키 설정하기',         file: 'docs/02-setup.md',          section: '1부 기초',   time: '20분' },
  { id: 'ch3',     num: '03', label: '첫 저장소 만들기',         title: '첫 저장소 만들고 clone → commit → push',  file: 'docs/03-first-repo.md',     section: '1부 기초',   time: '15분' },
  { id: 'ch4',     num: '04', label: '브랜치로 안전하게 일하기', title: '브랜치로 안전하게 일하기',                file: 'docs/04-branches.md',       section: '2부 협업',   time: '12분' },
  { id: 'ch5',     num: '05', label: 'Pull Request와 코드 리뷰', title: 'Pull Request와 코드 리뷰',                file: 'docs/05-pull-request.md',   section: '2부 협업',   time: '15분' },
  { id: 'ch6',     num: '06', label: '병합 충돌 해결하기',       title: '병합 충돌(Merge Conflict) 해결하기',      file: 'docs/06-merge-conflicts.md', section: '2부 협업',  time: '12분' },
  { id: 'ch7',     num: '07', label: 'Fork와 Upstream',          title: 'Fork와 Upstream으로 기여하기',            file: 'docs/07-fork-upstream.md',  section: '2부 협업',   time: '13분' },
  { id: 'ch8',     num: '08', label: '좋은 Issue 작성법',         title: '좋은 Issue 작성법',                       file: 'docs/08-issues.md',         section: '2부 협업',   time: '12분' },
  { id: 'ch9',     num: '09', label: '치트시트 + 용어집',         title: '명령어 치트시트 + 한영 용어집',           file: 'docs/09-cheatsheet.md',     section: '부록',       time: '참고용' },
];

const SECTIONS = [
  { key: '1부 기초', num: '1부', title: '기초 설정과 핵심 개념',  hint: 'GIT의 기본기' },
  { key: '2부 협업', num: '2부', title: '협업 워크플로우',         hint: '같이 쓰는 법' },
  { key: '부록',     num: '부록', title: '참고 자료',                 hint: '책갈피용' },
];

// ─── State ─────────────────────────────────────────────────
const state = {
  current: null,        // chapter id
  read: new Set(JSON.parse(localStorage.getItem('gg-read') || '[]')),
  tweaks: JSON.parse(localStorage.getItem('gg-tweaks') || '{}'),
};

const defaultTweaks = { theme: 'light', size: 'm', accent: 'coral' };
Object.assign(state.tweaks, { ...defaultTweaks, ...state.tweaks });

const ACCENT_PALETTE = {
  coral:    { light: 'oklch(0.62 0.16 38)',  dark: 'oklch(0.72 0.14 45)', soft: 'oklch(0.62 0.16 38 / 0.10)', ink: 'oklch(0.42 0.13 38)' },
  ink:      { light: 'oklch(0.32 0.04 60)',  dark: 'oklch(0.80 0.04 80)', soft: 'oklch(0.32 0.04 60 / 0.10)', ink: 'oklch(0.22 0.03 60)' },
  matcha:   { light: 'oklch(0.55 0.10 145)', dark: 'oklch(0.70 0.10 145)', soft: 'oklch(0.55 0.10 145 / 0.10)', ink: 'oklch(0.38 0.08 145)' },
  indigo:   { light: 'oklch(0.52 0.13 260)', dark: 'oklch(0.72 0.12 260)', soft: 'oklch(0.52 0.13 260 / 0.10)', ink: 'oklch(0.36 0.11 260)' },
};

// ─── Markdown rendering ──────────────────────────────────
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function highlightShell(code) {
  // very light shell highlighting
  return code.split('\n').map(line => {
    if (/^\s*#/.test(line)) return `<span class="tok-cmt">${escapeHtml(line)}</span>`;
    let out = escapeHtml(line);
    // prompt $
    out = out.replace(/^(\s*)(\$)\s/, '$1<span class="tok-prompt">$ </span>');
    // quoted strings
    out = out.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, '<span class="tok-str">$1</span>');
    // git/keyword start
    out = out.replace(/(\bgit\b|\bssh\b|\bssh-keygen\b|\bcd\b|\becho\b|\bls\b|\bxcode-select\b|\bbrew\b|\bcode\b|\bpbcopy\b|\bcat\b|\bclip\b|\bnpm\b)/g, '<span class="tok-kw">$1</span>');
    return out;
  }).join('\n');
}
function renderCode(code, lang) {
  const langLabel = (lang || '').toUpperCase();
  let body;
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    body = highlightShell(code);
  } else {
    body = escapeHtml(code);
  }
  const langAttr = langLabel ? ` data-lang="${langLabel}"` : '';
  // Strip leading "$ " prompts from each line for the copy buffer
  const copySrc = code.split('\n').map(l => l.replace(/^\s*\$\s?/, '')).join('\n');
  const enc = encodeURIComponent(copySrc);
  return `<pre${langAttr} data-copy="${enc}"><button class="copy-btn" type="button" aria-label="코드 복사"><span class="copy-icon" aria-hidden="true">⧉</span><span class="copy-lbl">복사</span></button><code>${body}</code></pre>`;
}

// minimal but solid markdown parser tailored to this content
function md(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;
  let firstBlockquote = true;

  const inline = (s) => {
    // code spans first (preserve)
    const tokens = [];
    s = s.replace(/`([^`]+)`/g, (_, c) => { tokens.push(`<code>${escapeHtml(c)}</code>`); return `\u0001${tokens.length - 1}\u0001`; });
    // images & links
    s = escapeHtml(s);
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const isExternal = /^https?:/.test(url);
      const isMd = /\.md(#.*)?$/.test(url);
      let href = url;
      if (isMd) {
        // map docs/XX-name.md to #chN
        const m = url.match(/(\d{2})-/);
        if (m) {
          const ch = CHAPTERS.find(c => c.num === m[1]);
          if (ch) href = `#${ch.id}`;
        }
      }
      const tgt = isExternal ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${href}"${tgt}>${label}</a>`;
    });
    // bold
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italics  (single * not part of **)
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    // restore code
    s = s.replace(/\u0001(\d+)\u0001/g, (_, n) => tokens[+n]);
    return s;
  };

  const slugify = (s) => {
    return s.toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[`*_~]/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    const fence = line.match(/^```(\w+)?/);
    if (fence) {
      const lang = fence[1] || '';
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing
      html += renderCode(buf.join('\n'), lang);
      continue;
    }

    // headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const txt = inline(h[2]);
      const id = slugify(h[2]);
      html += `<h${lvl} id="${id}">${txt}</h${lvl}>`;
      i++;
      continue;
    }

    // hr
    if (/^---+\s*$/.test(line)) {
      html += '<hr>';
      i++;
      continue;
    }

    // table
    if (/^\|.*\|\s*$/.test(line) && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const header = line.trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim()));
        i++;
      }
      html += '<table><thead><tr>';
      header.forEach(h => html += `<th>${inline(h)}</th>`);
      html += '</tr></thead><tbody>';
      rows.forEach(r => {
        html += '<tr>';
        r.forEach(c => html += `<td>${inline(c)}</td>`);
        html += '</tr>';
      });
      html += '</tbody></table>';
      continue;
    }

    // blockquote (group consecutive > lines, handle nested code blocks within)
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && (/^>\s?/.test(lines[i]) || (lines[i] === '' && /^>\s?/.test(lines[i+1] || '')))) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const inner = md(buf.join('\n'));
      const cls = firstBlockquote ? ' class="objectives"' : '';
      firstBlockquote = false;
      html += `<blockquote${cls}>${inner}</blockquote>`;
      continue;
    }

    // lists (unordered / ordered)
    const ul = line.match(/^(\s*)([-*])\s+(.*)$/);
    const ol = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (ul || ol) {
      const ordered = !!ol;
      const tag = ordered ? 'ol' : 'ul';
      let buf = '';
      while (i < lines.length) {
        const l = lines[i];
        const m = ordered ? l.match(/^(\s*)(\d+)\.\s+(.*)$/) : l.match(/^(\s*)([-*])\s+(.*)$/);
        if (m && m[1].length === 0) {
          // collect continuation lines (indented)
          let item = m[3];
          i++;
          while (i < lines.length && (lines[i].startsWith('  ') || lines[i] === '')) {
            if (lines[i] === '' && !(lines[i+1] && lines[i+1].startsWith('  '))) break;
            if (lines[i].startsWith('   ')) {
              item += '\n' + lines[i].replace(/^  /, '');
            } else if (lines[i] === '') {
              item += '\n';
            } else {
              item += '\n' + lines[i].replace(/^  /, '');
            }
            i++;
          }
          // if item contains a fenced code block (```), parse internally
          if (/```/.test(item)) {
            buf += `<li>${md(item)}</li>`;
          } else {
            // task list  - [ ]
            const task = item.match(/^\[([ x])\]\s+(.*)$/);
            if (task) {
              const checked = task[1] === 'x' ? ' checked' : '';
              buf += `<li><input type="checkbox" disabled${checked}> ${inline(task[2])}</li>`;
            } else {
              buf += `<li>${inline(item)}</li>`;
            }
          }
        } else {
          break;
        }
      }
      html += `<${tag}>${buf}</${tag}>`;
      continue;
    }

    // empty line
    if (line.trim() === '') { i++; continue; }

    // paragraph
    const buf = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^#{1,4}\s/.test(lines[i]) && !/^```/.test(lines[i]) && !/^>/.test(lines[i]) && !/^[-*]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !/^---+\s*$/.test(lines[i]) && !/^\|.*\|\s*$/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    html += `<p>${inline(buf.join(' '))}</p>`;
  }
  return html;
}

// ─── Sidebar render ────────────────────────────────────
function renderSidebar() {
  const nav = document.getElementById('nav');
  let html = '';

  // intro stand-alone
  const intro = CHAPTERS[0];
  html += `<div class="nav-section">
    <a href="#${intro.id}" class="nav-item ${state.current === intro.id ? 'active' : ''} ${state.read.has(intro.id) ? 'read' : ''}" data-chap="${intro.id}">
      <span class="nav-num">★</span>
      <span class="nav-label">소개 · 학습 로드맵</span>
    </a>
  </div>`;

  SECTIONS.forEach(sec => {
    const inSec = CHAPTERS.filter(c => c.section === sec.key);
    if (!inSec.length) return;
    html += `<div class="nav-section">
      <div class="nav-section-title"><span>${sec.num}</span><span class="lbl">${sec.title}</span></div>`;
    inSec.forEach(c => {
      const isActive = state.current === c.id;
      const isRead = state.read.has(c.id);
      html += `<a href="#${c.id}" class="nav-item ${isActive ? 'active' : ''} ${isRead ? 'read' : ''}" data-chap="${c.id}">
        <span class="nav-num">${c.num}</span>
        <span class="nav-label">${c.label}</span>
        <span class="nav-time">${c.time}</span>
      </a>`;
    });
    html += `</div>`;
  });

  nav.innerHTML = html;

  // progress
  const readableCount = CHAPTERS.filter(c => c.id !== 'intro').length;
  const readCount = [...state.read].filter(id => id !== 'intro').length;
  const pct = Math.round((readCount / readableCount) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
}

// ─── Landing render ───────────────────────────────────
function renderLanding() {
  const main = document.getElementById('main-content');
  const totalChapters = CHAPTERS.length - 1;
  const readCount = [...state.read].filter(id => id !== 'intro').length;

  let html = `<div class="main-bar">
    <div class="crumb"><span>HOME</span><span class="sep">›</span><span>학습 로드맵</span></div>
    <div class="main-bar-actions">
      <button class="btn ghost" id="tweaks-toggle">⚙ 모양 설정</button>
    </div>
  </div>
  <div class="landing">
    <div class="landing-eyebrow">A KOREAN GITHUB PRIMER · 2025</div>
    <h1>처음 만나는 <span class="accent">GitHub</span>,<br>차근차근 따라오시면 됩니다.</h1>
    <p class="landing-lede">컴퓨터·공학 계열뿐 아니라 문서, 과제, 팀 프로젝트, 포트폴리오를 다루는 모든 학부 신입생을 위한 한국어 길잡이. 명령어를 외우는 것이 아니라, <strong>왜 이렇게 하는지</strong>를 이해하며 따라 할 수 있도록 구성했습니다.</p>
    <div class="landing-meta">
      <div class="item"><span class="lbl">분량</span><span class="val">9개 장 · 약 100분</span></div>
      <div class="item"><span class="lbl">대상</span><span class="val">학부 1·2학년</span></div>
      <div class="item"><span class="lbl">필요 OS</span><span class="val">Windows 10/11 또는 macOS</span></div>
      <div class="item"><span class="lbl">진행률</span><span class="val">${readCount} / ${totalChapters} 장 완독</span></div>
    </div>`;

  SECTIONS.forEach(sec => {
    const inSec = CHAPTERS.filter(c => c.section === sec.key);
    if (!inSec.length) return;
    html += `<div class="roadmap-title"><span>${sec.num} · ${sec.title}</span></div>
    <h2 class="roadmap-h">${sec.hint}</h2>
    <div class="roadmap">`;
    inSec.forEach(c => {
      const isRead = state.read.has(c.id);
      html += `<a class="rc ${isRead ? 'read' : ''}" href="#${c.id}">
        <span class="num">${c.num}</span>
        <span class="body">
          <span class="ttl">${c.label}</span>
          <span class="sub">${c.title.replace(c.label, '').replace(/^[,\s—-]+/, '')}</span>
        </span>
        <span class="badge">${isRead ? '✓ 읽음' : c.time}</span>
      </a>`;
    });
    html += `</div>`;
  });

  html += `<div class="landing-aside">
    <div class="card">
      <h3>이 가이드를 읽는 요령</h3>
      <ul>
        <li><strong>순서대로 읽으세요.</strong> 뒤 장은 앞 장의 명령을 전제로 합니다.</li>
        <li><strong>직접 타이핑해 보세요.</strong> 복사-붙여넣기만으로는 손에 익지 않습니다.</li>
        <li><strong>에러가 나도 당황하지 마세요.</strong> 각 장 끝에 "자주 겪는 어려움" 섹션이 있습니다.</li>
        <li>용어가 헷갈리면 <a href="#ch9">9장 용어집</a>을 펼쳐 두세요.</li>
      </ul>
    </div>
    <div class="card">
      <h3>다루지 않는 내용</h3>
      <p>GitHub Pages 배포, GitHub Actions(CI/CD), GitHub Student Pack 같은 심화 주제는 다루지 않습니다. 기초를 충분히 익히신 뒤 따로 찾아보시면 됩니다.</p>
      <p style="margin-top:14px"><a href="#ch1">→ 1장부터 시작하기</a></p>
    </div>
  </div>`;
  html += `</div>`;

  main.innerHTML = html;
  document.getElementById('toc').innerHTML = `
    <div class="toc-title">이 페이지에서</div>
    <ul class="toc-list">
      <li><a href="#section-intro">소개</a></li>
      <li><a href="#section-roadmap">학습 로드맵</a></li>
      <li><a href="#section-tips">읽는 요령</a></li>
    </ul>
    <div class="read-status">
      <div class="lbl">진행률</div>
      <div class="count">${readCount}<em> / ${totalChapters}</em></div>
    </div>`;
}

// ─── Chapter render ───────────────────────────────────
async function renderChapter(chap) {
  const main = document.getElementById('main-content');
  const idx = CHAPTERS.findIndex(c => c.id === chap.id);
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];
  const isRead = state.read.has(chap.id);

  main.innerHTML = `<div class="main-bar">
    <div class="crumb">
      <a href="#" style="color:inherit;text-decoration:none">HOME</a>
      <span class="sep">›</span>
      <span>${chap.section.toUpperCase()}</span>
      <span class="sep">›</span>
      <span style="color:var(--ink)">${chap.num}장</span>
    </div>
    <div class="main-bar-actions">
      <button class="btn read-toggle ${isRead ? 'is-read' : ''}" id="read-btn"><span class="dot"></span> ${isRead ? '읽음' : '읽음으로 표시'}</button>
      <button class="btn ghost" id="tweaks-toggle">⚙</button>
    </div>
  </div>
  <article class="reader">
    <div class="md" id="md"><p style="color:var(--ink-3)">불러오는 중…</p></div>
    <nav class="chap-foot">
      ${prev ? `<a href="#${prev.id}"><span class="lbl">← 이전 장 · ${prev.num}</span><span class="ttl">${prev.label}</span></a>` : `<div class="empty"></div>`}
      ${next ? `<a class="next" href="#${next.id}"><span class="lbl">다음 장 · ${next.num} →</span><span class="ttl">${next.label}</span></a>` : `<div class="empty"></div>`}
    </nav>
  </article>`;

  document.getElementById('read-btn').addEventListener('click', () => {
    if (state.read.has(chap.id)) {
      state.read.delete(chap.id);
    } else {
      state.read.add(chap.id);
    }
    localStorage.setItem('gg-read', JSON.stringify([...state.read]));
    renderSidebar();
    document.getElementById('read-btn').classList.toggle('is-read');
    document.getElementById('read-btn').innerHTML = `<span class="dot"></span> ${state.read.has(chap.id) ? '읽음' : '읽음으로 표시'}`;
  });

  // fetch + render markdown
  try {
    const res = await fetch(chap.file);
    let mdSrc = await res.text();
    // strip the leading "# Title" duplicate? Keep — but we'll let the h1 in md render.
    const rendered = md(mdSrc);
    document.getElementById('md').innerHTML = rendered;
    buildMiniToc();
  } catch (e) {
    document.getElementById('md').innerHTML = `<p style="color:var(--accent-ink)">불러오기 실패: ${e.message}</p>`;
  }

  document.querySelector('.main').scrollTo?.({ top: 0 });
  window.scrollTo({ top: 0 });
}

// ─── Mini TOC ─────────────────────────────────────────
function buildMiniToc() {
  const tocEl = document.getElementById('toc');
  const headings = document.querySelectorAll('.md h2, .md h3');
  let html = `<div class="toc-title">이 페이지에서</div><ul class="toc-list">`;
  headings.forEach(h => {
    const lvl = h.tagName === 'H2' ? 'lvl-2' : 'lvl-3';
    html += `<li class="${lvl}"><a href="#${h.id}" data-toc="${h.id}">${h.textContent}</a></li>`;
  });
  html += `</ul>`;

  // read status mini-card
  const isRead = state.read.has(state.current);
  html += `<div class="read-status">
    <div class="lbl">${isRead ? '✓ 완료' : '읽고 계신 중'}</div>
    <div class="count">${CHAPTERS.findIndex(c => c.id === state.current)}<em> / ${CHAPTERS.length - 1}</em></div>
  </div>`;
  tocEl.innerHTML = html;
}

// ─── Tweaks ───────────────────────────────────────────
function applyTweaks() {
  const t = state.tweaks;
  document.documentElement.dataset.theme = t.theme === 'light' ? '' : t.theme;
  document.documentElement.style.setProperty('--body-size',
    t.size === 's' ? '15px' : t.size === 'l' ? '17.5px' : '16px');
  const pal = ACCENT_PALETTE[t.accent] || ACCENT_PALETTE.coral;
  const dark = t.theme === 'dark';
  document.documentElement.style.setProperty('--accent', dark ? pal.dark : pal.light);
  document.documentElement.style.setProperty('--accent-soft', pal.soft);
  document.documentElement.style.setProperty('--accent-ink', dark ? pal.dark : pal.ink);
  localStorage.setItem('gg-tweaks', JSON.stringify(t));
}

function renderTweaks() {
  const el = document.getElementById('tweaks');
  el.innerHTML = `
    <div class="tweaks-head">
      <span>Tweaks</span>
      <button id="tweaks-close" aria-label="닫기">×</button>
    </div>
    <div class="tweaks-body">
      <div class="tweak-row">
        <label>테마</label>
        <div class="seg" data-key="theme">
          <button data-v="light">밝게</button>
          <button data-v="sepia">세피아</button>
          <button data-v="dark">어둡게</button>
        </div>
      </div>
      <div class="tweak-row">
        <label>글자 크기</label>
        <div class="seg" data-key="size">
          <button data-v="s">작게</button>
          <button data-v="m">보통</button>
          <button data-v="l">크게</button>
        </div>
      </div>
      <div class="tweak-row">
        <label>액센트</label>
        <div class="swatches" data-key="accent">
          <button class="swatch" data-v="coral"  style="background:oklch(0.62 0.16 38)"  title="산호"></button>
          <button class="swatch" data-v="ink"    style="background:oklch(0.32 0.04 60)"  title="잉크"></button>
          <button class="swatch" data-v="matcha" style="background:oklch(0.55 0.10 145)" title="말차"></button>
          <button class="swatch" data-v="indigo" style="background:oklch(0.52 0.13 260)" title="남색"></button>
        </div>
      </div>
    </div>
    <div class="tweaks-foot">
      <span>설정은 자동 저장됩니다</span>
      <button id="tweaks-reset">기본값</button>
    </div>`;

  // mark current selections
  el.querySelectorAll('.seg').forEach(seg => {
    const k = seg.dataset.key;
    seg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', b.dataset.v === state.tweaks[k]);
      b.addEventListener('click', () => {
        state.tweaks[k] = b.dataset.v;
        applyTweaks();
        renderTweaks();
      });
    });
  });
  el.querySelectorAll('.swatches').forEach(sw => {
    const k = sw.dataset.key;
    sw.querySelectorAll('.swatch').forEach(b => {
      b.classList.toggle('on', b.dataset.v === state.tweaks[k]);
      b.addEventListener('click', () => {
        state.tweaks[k] = b.dataset.v;
        applyTweaks();
        renderTweaks();
      });
    });
  });
  document.getElementById('tweaks-close').addEventListener('click', () => {
    el.classList.remove('open');
  });
  document.getElementById('tweaks-reset').addEventListener('click', () => {
    state.tweaks = { ...defaultTweaks };
    applyTweaks();
    renderTweaks();
  });
}

// ─── Routing ──────────────────────────────────────────
function route() {
  const hash = location.hash.replace(/^#/, '') || 'intro';
  const chap = CHAPTERS.find(c => c.id === hash);
  state.current = (chap && hash !== 'intro') ? chap.id : null;
  renderSidebar();

  if (!chap || hash === 'intro') {
    state.current = 'intro';
    renderLanding();
  } else {
    renderChapter(chap);
  }

  // hook up tweaks toggle (created per-route)
  document.addEventListener('click', tweaksDelegate, { once: false });
}

function tweaksDelegate(e) {
  if (e.target.id === 'tweaks-toggle' || e.target.closest('#tweaks-toggle')) {
    document.getElementById('tweaks').classList.toggle('open');
  }
  const copyBtn = e.target.closest('.copy-btn');
  if (copyBtn) {
    const pre = copyBtn.closest('pre');
    const src = decodeURIComponent(pre.dataset.copy || '');
    const done = () => {
      copyBtn.classList.add('copied');
      copyBtn.querySelector('.copy-lbl').textContent = '복사됨';
      copyBtn.querySelector('.copy-icon').textContent = '✓';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-lbl').textContent = '복사';
        copyBtn.querySelector('.copy-icon').textContent = '⧉';
      }, 1400);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(src).then(done).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = src; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch(_) {}
        ta.remove();
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = src; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch(_) {}
      ta.remove();
    }
  }
}

// ─── Scroll progress + active heading ────────────────
function updateScrollProgress() {
  const sc = document.documentElement;
  const max = sc.scrollHeight - sc.clientHeight;
  const pct = max > 0 ? (sc.scrollTop / max) * 100 : 0;
  document.querySelector('.scroll-progress > i').style.width = pct + '%';

  // active heading
  const links = document.querySelectorAll('.toc-list a[data-toc]');
  let activeId = null;
  document.querySelectorAll('.md h2, .md h3').forEach(h => {
    const r = h.getBoundingClientRect();
    if (r.top < 120) activeId = h.id;
  });
  links.forEach(l => l.classList.toggle('active', l.dataset.toc === activeId));
}

// ─── Init ────────────────────────────────────────────
window.addEventListener('hashchange', route);
window.addEventListener('scroll', updateScrollProgress);
document.addEventListener('DOMContentLoaded', () => {
  applyTweaks();
  renderTweaks();
  route();
});
