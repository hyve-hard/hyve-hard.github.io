(async () => {
  const featured = document.getElementById('featured');
  const volReleases = document.getElementById('volReleases');
  const epReleases = document.getElementById('epReleases');
  const otherReleases = document.getElementById('otherReleases');
  try {
    const response = await fetch('data/site.json?fresh=' + Date.now(), {cache:'no-store'});
    if (!response.ok) throw new Error('site.json not loaded');
    const data = await response.json();
    const text = (value) => String(value ?? '');
    const safeUrl = (value) => { try { const u = new URL(String(value), location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
    // Prevent a missing function from stopping the entire page render.
    // Absolute HTTPS URLs and local /assets/... paths are supported.
    const safeAudioUrl = (value) => {
      if (typeof value !== 'string' || !value.trim()) return '';
      return safeUrl(value.trim());
    };
    const settings = data.settings || {};
    const audio = document.getElementById('hyveAudio');
    let activeRow = null;
    let activeButton = null;
    let activeSeek = null;
    const status = document.getElementById('audioStatus');
    const updateProgress = () => {
      if (!audio || !activeSeek) return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const ratio = duration > 0 ? Math.min(100, Math.max(0, audio.currentTime / duration * 100)) : 0;
      activeSeek.value = String(ratio);
      activeSeek.style.setProperty('--progress', ratio + '%');
      activeSeek.setAttribute('aria-valuetext', duration ? Math.floor(audio.currentTime) + ' / ' + Math.floor(duration) + '秒' : '読み込み中');
    };
    const setPlaybackUI = (playing) => {
      if (!activeButton) return;
      activeButton.textContent = playing ? '❚❚' : '▶';
      activeButton.setAttribute('aria-label', playing ? '一時停止' : '再生');
      activeButton.setAttribute('aria-pressed', String(playing));
      activeRow?.classList.toggle('is-playing', playing);
    };
    if (audio) {
      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', updateProgress);
      audio.addEventListener('play', () => { setPlaybackUI(true); if(status) status.textContent='再生中'; });
      audio.addEventListener('pause', () => setPlaybackUI(false));
      audio.addEventListener('ended', () => { setPlaybackUI(false); updateProgress(); if(status) status.textContent='再生が終了しました'; });
      audio.addEventListener('error', () => {setPlaybackUI(false);if(status) status.textContent='音源の読み込みに失敗しました。登録した音源URLをご確認ください。';});
    }
    // Verified destination defaults. CMS values take precedence when present.
    // These fallbacks keep the requested links accessible until CMS saves propagate.
    const serviceDefaults = {
      bandcampUrl: 'https://hyve-hard.bandcamp.com/',
      spotifyUrl: 'https://open.spotify.com/playlist/1ltd7rxJx5Gp3vjjz230yi',
      appleMusicUrl: 'https://music.apple.com/jp/search?term=hyve',
      youtubeUrl: 'https://music.youtube.com/playlist?list=PLRdWvw23-MlSNTOsEVTpqQPJu7VN1eBRS'
    };
    const serviceHref = (key, fallback='') => safeUrl(settings[key]) || safeUrl(serviceDefaults[key] || fallback);
    const heroSub = document.querySelector('.hero-sub'); if (heroSub && settings.heroSubtitle) heroSub.textContent = settings.heroSubtitle;
    const heroDesc = document.querySelector('.hero-desc'); if (heroDesc && settings.introJa) heroDesc.textContent = settings.introJa;
    const aboutJa = document.querySelector('.about-copy p:not([lang])'); if (aboutJa && settings.aboutJa) aboutJa.textContent = settings.aboutJa;
    const aboutEn = document.querySelector('.about-copy p[lang=en]'); if (aboutEn && settings.introEn) aboutEn.textContent = settings.introEn;
    const bc = document.querySelector('[data-setting=bandcamp]'); if (bc && safeUrl(settings.bandcampUrl)) bc.href = safeUrl(settings.bandcampUrl);
    const social = document.querySelector('[data-setting=social]'); if (social && safeUrl(settings.socialUrl)) social.href = safeUrl(settings.socialUrl);

    const node = (name, klass, value) => {const el=document.createElement(name);if(klass)el.className=klass;if(value!==undefined)el.textContent=text(value);return el;};
    featured.replaceChildren();
    (data.featured || []).forEach((track,index) => {
      const row=node('article','track');
      const trackNumber=String(index+1).padStart(2,'0');
      const details=node('div'); details.append(node('div','track-title',track.title),node('div','track-artist',track.artist));row.append(details);
      row.append(node('div','track-release',track.release));
      const audioUrl = safeAudioUrl(track.audioUrl);
      if (audioUrl && audio) {
        const button=node('button','track-number track-number-play',trackNumber);
        button.dataset.number=trackNumber;
        button.type='button';
        button.setAttribute('aria-label',text(track.title) + ' を再生');
        button.setAttribute('aria-pressed','false');
        const seek=node('input','track-progress');
        seek.type='range'; seek.min='0'; seek.max='100'; seek.step='0.1'; seek.value='0';
        seek.setAttribute('aria-label',text(track.title) + ' の再生位置');
        seek.style.setProperty('--progress','0%');
        seek.disabled=true;
        button.addEventListener('click', async () => {
          if (activeRow === row) {
            if (!audio.paused) audio.pause();
            else { try {await audio.play();} catch {if(status)status.textContent='再生できません。音源をご確認ください。';} }
            return;
          }
          if(activeRow) { activeRow.classList.remove('is-active','is-playing'); if(activeButton) {activeButton.textContent=activeButton.dataset.number;activeButton.setAttribute('aria-pressed','false');} if(activeSeek) {activeSeek.disabled=true;} }
          activeRow=row; activeButton=button; activeSeek=seek;
          row.classList.add('is-active'); seek.disabled=false;
          audio.src=audioUrl; audio.load();
          if(status) status.textContent=text(track.title)+' を読み込んでいます…';
          try { await audio.play(); } catch {if(status)status.textContent='再生できません。ファイルが公開されているか確認してください。';}
        });
        seek.addEventListener('input', () => {
          if(activeRow!==row || !Number.isFinite(audio.duration) || audio.duration<=0) return;
          audio.currentTime=audio.duration*Number(seek.value)/100;
          updateProgress();
        });
        row.prepend(button);
        row.append(seek);
      } else {
        const link=node('a','track-number track-number-link',trackNumber);
        link.href=safeUrl(track.url)||'#listen';link.target='_blank';link.rel='noopener noreferrer';
        link.title=text(track.title)+' を外部で聴く';
        link.setAttribute('aria-label',text(track.title)+' を外部で聴く');
        row.prepend(link);
      }
      featured.append(row);
    });
    // Show only confirmed service destinations; all icons use real brand SVG paths.
    const services = [
      {label:'Bandcamp', key:'bandcampUrl', fallback:'https://hyve-hard.bandcamp.com/', icon:'bandcamp'},
      {label:'Spotify', key:'spotifyUrl', icon:'spotify'},
      {label:'Apple Music', key:'appleMusicUrl', icon:'apple'},
      {label:'SoundCloud', key:'soundcloudUrl', icon:'soundcloud'},
      {label:'X', key:'xUrl', icon:'x-twitter'},
      {label:'YouTube', key:'youtubeUrl', icon:'youtube'}
    ];
    const iconUrl = (name) => 'assets/icons/' + name + '.svg';
    const icon = (name) => { const img = new Image(); img.src = iconUrl(name); img.alt = ''; img.setAttribute('aria-hidden','true'); return img; };
    const socialNav = document.getElementById('headerSocial');
    socialNav.replaceChildren();
    services.forEach(s => {
      const href = serviceHref(s.key, s.fallback);
      if (!href) return;
      const a = node('a'); a.href = href; a.target='_blank'; a.rel='noopener noreferrer';
      a.title=s.label; a.setAttribute('aria-label',s.label); a.append(icon(s.icon)); socialNav.append(a);
    });
    const streamingLinks = document.getElementById('streamingLinks');
    streamingLinks.replaceChildren();
    [services[4], ...services.slice(0,4)].forEach(s => {
      const href = serviceHref(s.key, s.fallback);
      if (!href) return;
      const a = node('a'); a.href=href;a.target='_blank';a.rel='noopener noreferrer';
      a.append(icon(s.icon), node('span','',s.label.toUpperCase() + ' ↗'));
      streamingLinks.append(a);
    });
    const note=document.getElementById('streamingLinkNote');
    if(note) note.hidden=[services[4], ...services.slice(0,4)].every(s=>serviceHref(s.key, s.fallback));
    volReleases.replaceChildren();epReleases.replaceChildren();otherReleases.replaceChildren();
    (data.releases || []).forEach((release) => {
      const card=node('a','release-card');card.href=safeUrl(release.url)||'#releases';card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label',release.title+' をBandcampで開く');
      const cover=node('div','release-cover');const img=new Image();img.alt='';img.loading='lazy';if(release.cover) img.src=release.cover;img.onerror=()=>img.remove();cover.append(img,node('div','cover-label','HYVE / '+release.kind),node('div','cover-title',release.title));
      const info=node('div','release-info');info.append(node('strong','',release.title),node('span','',release.date));card.append(cover,info);const title = String(release.title || '');
      const kind = String(release.kind || '').toUpperCase();
      if (kind === 'EP' || /^EP[-\s]/i.test(title)) epReleases.append(card);
      else if (kind === 'COMPILATION' || /\bVOL\.?\s*\d+/i.test(title)) volReleases.append(card);
      else otherReleases.append(card);
    });
    document.getElementById('otherReleasesWrap').hidden = otherReleases.children.length === 0;
    if (!epReleases.children.length) epReleases.append(node('p','loading','EP作品は準備中です。'));
  } catch (err) {
    featured.replaceChildren(node('p','loading','楽曲データの読み込みに失敗しました。'));
    volReleases.replaceChildren(node('p','loading','作品一覧を読み込めませんでした。'));
    epReleases.replaceChildren();
    console.error(err);
  }
})();
