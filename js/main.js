(async () => {
  const featured = document.getElementById('featured');
  const releases = document.getElementById('releasesGrid');
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
    const heroTitle = document.querySelector('.hero h1'); if (heroTitle && settings.heroTitle) { heroTitle.textContent = settings.heroTitle; heroTitle.classList.add('hero-single-line'); }

    const node = (name, klass, value) => {const el=document.createElement(name);if(klass)el.className=klass;if(value!==undefined)el.textContent=text(value);return el;};
    featured.replaceChildren();
    (data.featured || []).forEach((track,index) => {
      const row=node('article','track'); row.append(node('div','track-number',String(index+1).padStart(2,'0')));
      const details=node('div'); details.append(node('div','track-title',track.title),node('div','track-artist',track.artist));row.append(details);
      row.append(node('div','track-release',track.release));
      const link=node('a','track-action','LISTEN ↗');link.href=safeUrl(track.url)||'#listen';link.target='_blank';link.rel='noopener noreferrer';row.append(link);featured.append(row);
    });
    releases.replaceChildren();
    (data.releases || []).forEach((release) => {
      const card=node('a','release-card');card.href=safeUrl(release.url)||'#releases';card.target='_blank';card.rel='noopener noreferrer';card.setAttribute('aria-label',release.title+' をBandcampで開く');
      const cover=node('div','release-cover');const img=new Image();img.alt='';img.loading='lazy';if(release.cover) img.src=release.cover;img.onerror=()=>img.remove();cover.append(img,node('div','cover-label','HYVE / '+release.kind),node('div','cover-title',release.title));
      const info=node('div','release-info');info.append(node('strong','',release.title),node('span','',release.date));card.append(cover,info);releases.append(card);
    });
  } catch (err) {
    featured.replaceChildren(node('p','loading','楽曲データの読み込みに失敗しました。'));
    releases.replaceChildren(node('p','loading','作品一覧を読み込めませんでした。'));
    console.error(err);
  }
})();
