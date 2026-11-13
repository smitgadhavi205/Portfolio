'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const chart = document.querySelector('.contribution-chart');
const fallback = () => { chart.hidden = true; document.querySelector('.chart-fallback').hidden = false; };
chart.addEventListener('error', fallback);
if (chart.complete && chart.naturalWidth === 0) fallback();

const bookPreview = document.querySelector('a.screenshot-frame[href="assets/projects/book4me.png"]');
if (bookPreview) {
  const gallery = document.createElement('div');
  gallery.className = 'book-gallery';
  gallery.setAttribute('aria-label', 'Book4Me screenshots');
  const shots = [
    ['book4me', 'Home'],
    ['book4me-discovery', 'Discover'],
    ['book4me-salon', 'Salon'],
    ['book4me-booking', 'Booking']
  ];
  const image = bookPreview.querySelector('img');
  const fullPreview = bookPreview.closest('article').querySelector('.preview-link');
  shots.forEach(([file, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'book-shot';
    button.setAttribute('aria-pressed', String(index === 0));
    button.setAttribute('aria-label', `Show Book4Me ${label.toLowerCase()} screenshot`);
    const thumbnail = document.createElement('img');
    thumbnail.src = `assets/projects/${file}.png`;
    thumbnail.alt = '';
    thumbnail.loading = 'lazy';
    const caption = document.createElement('span');
    caption.textContent = label;
    button.append(thumbnail, caption);
    button.addEventListener('click', () => {
      const src = `assets/projects/${file}.png`;
      image.src = src;
      image.alt = `Book4Me ${label.toLowerCase()} screen`;
      bookPreview.href = src;
      bookPreview.setAttribute('aria-label', `Open full Book4Me ${label.toLowerCase()} screenshot`);
      fullPreview.href = src;
      gallery.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
    gallery.append(button);
  });
  bookPreview.after(gallery);
}
