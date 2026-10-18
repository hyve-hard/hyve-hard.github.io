(async () => {
  const featured = document.getElementById('featured');
  const volReleases = document.getElementById('volReleases');
  const epReleases = document.getElementById('epReleases');
  const otherReleases = document.getElementById('otherReleases');
  try {
    const response = await fetch('data/site.json');
    if (!response.ok) throw new Error('site.json not loaded');
    const data = await response.json();
    const text = (value) => String(value ?? '');
    const safeUrl = (value) => { try { const u = new URL(String(value), location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
    const settings = data.settings || {};
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
    // Only render verified destinations. Never point a social icon at an unrelated service.
    const socialItems = [
      ['BANDCAMP', settings.bandcampUrl || 'https://hyve-hard.bandcamp.com/', 'B'],
      ['X', settings.xUrl, '𝕏'],
      ['YOUTUBE', settings.youtubeUrl, '▶'],
      ['SOUNDCLOUD', settings.soundcloudUrl, '☁']
    ];
    const socialNav = document.getElementById('headerSocial');
    socialNav.replaceChildren();
    socialItems.forEach(([name, url, symbol]) => {
      const href = safeUrl(url);
      if (!href) return;
      const a = document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';
      a.setAttribute('aria-label',name);a.title=name;a.textContent=symbol;socialNav.append(a);
    });
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
