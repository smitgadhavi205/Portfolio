'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const chart = document.querySelector('.contribution-chart');
const fallback = () => { chart.hidden = true; document.querySelector('.chart-fallback').hidden = false; };
chart.addEventListener('error', fallback);
if (chart.complete && chart.naturalWidth === 0) fallback();
