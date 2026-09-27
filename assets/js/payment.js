/* ========================================
   TimeBalance — payment.js
   Payment page UI
   TODO: Connect to real payment gateway / API
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* Read plan from URL param: payment.html?plan=monthly */
  const params = new URLSearchParams(location.search);
  const plan   = params.get('plan') || 'monthly';

  const plans = {
    free:    { name: 'Free',             price: 'Rp 0',       period: 'Selamanya' },
    monthly: { name: 'Premium Bulanan',  price: 'Rp 19.000',  period: 'per bulan' },
    annual:  { name: 'Premium Tahunan',  price: 'Rp 179.000', period: 'per tahun' },
  };

  const selected = plans[plan] || plans.monthly;

  const nameEl   = document.getElementById('pay-plan-name');
  const priceEl  = document.getElementById('pay-plan-price');
  const periodEl = document.getElementById('pay-plan-period');
  if (nameEl)   nameEl.textContent   = selected.name;
  if (priceEl)  priceEl.textContent  = selected.price;
  if (periodEl) periodEl.textContent = selected.period;

  /* Highlight selected plan in selector (if any) */
  document.querySelectorAll('[data-plan]').forEach(el => {
    el.classList.toggle('active', el.dataset.plan === plan);
  });
});

/* ---- Confirm payment handler ---- */
function confirmPayment() {
  const name  = document.getElementById('pay-name')?.value.trim();
  const email = document.getElementById('pay-email')?.value.trim();
  const note  = document.getElementById('pay-note')?.value.trim();

  if (!name || !email) {
    showPayMsg('❌ Mohon isi nama dan email Anda.', 'error');
    return;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    showPayMsg('❌ Format email tidak valid.', 'error');
    return;
  }

  /* TODO: Replace with actual API call to your backend / payment gateway */
  showPayMsg('✅ Konfirmasi diterima! Kami akan memverifikasi pembayaran Anda dalam 1×24 jam dan mengirim akses ke email yang Anda daftarkan.', 'success');
}

function showPayMsg(msg, type) {
  const el = document.getElementById('pay-msg');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'pay-msg ' + type;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---- Copy virtual account / info ---- */
function copyText(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = document.querySelector(`[onclick="copyText('${id}')"]`);
    if (btn) { btn.textContent = 'Disalin!'; setTimeout(() => btn.textContent = 'Salin', 2000); }
  });
}
