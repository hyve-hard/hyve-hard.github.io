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
    const settings = data.settings || {};
    // Manageable in the CMS: accepts a YouTube / YouTube Music playlist URL or playlist ID.
    const playlistRaw = String(settings.playerPlaylistUrl || settings.youtubeUrl || 'https://music.youtube.com/playlist?list=PLRdWvw23-MlSNTOsEVTpqQPJu7VN1eBRS');
    function playlistId(value) {
      try {
        const u = new URL(value);
        if (!['youtube.com','www.youtube.com','music.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname)) return '';
        return /^[A-Za-z0-9_-]{10,}$/.test(u.searchParams.get('list') || '') ? u.searchParams.get('list') : '';
      } catch { return /^[A-Za-z0-9_-]{10,}$/.test(value) ? value : ''; }
    }
    const playerList = playlistId(playlistRaw) || 'PLRdWvw23-MlSNTOsEVTpqQPJu7VN1eBRS';
    const iframe = document.getElementById('hyvePlayer');
    if (iframe) iframe.src = 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(playerList);
    const playerExternal = document.getElementById('playerExternal');
    if (playerExternal) playerExternal.href = 'https://music.youtube.com/playlist?list=' + encodeURIComponent(playerList);
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
      const row=node('article','track'); row.append(node('div','track-number',String(index+1).padStart(2,'0')));
      const details=node('div'); details.append(node('div','track-title',track.title),node('div','track-artist',track.artist));row.append(details);
      row.append(node('div','track-release',track.release));
      const link=node('a','track-action','LISTEN ↗');link.href=safeUrl(track.url)||'#listen';link.target='_blank';link.rel='noopener noreferrer';row.append(link);featured.append(row);
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
