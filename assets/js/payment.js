/* =========================================================
   TIMEBALANCE - PAYMENT.JS
   EmailJS Payment Confirmation
   ========================================================= */


/* =========================
   DATA PAKET
   ========================= */

const planData = {
  free: {
    name: "Free",
    price: "Rp 0",
    period: "Selamanya",
    confirm: "Free — Rp 0"
  },

  monthly: {
    name: "Premium Bulanan",
    price: "Rp 19.000",
    period: "per bulan",
    confirm: "Premium Bulanan — Rp 19.000"
  },

  annual: {
    name: "Premium Tahunan",
    price: "Rp 179.000",
    period: "per tahun",
    confirm: "Premium Tahunan — Rp 179.000"
  }
};


/* =========================
   PILIH PAKET
   ========================= */

function selectPlan(key) {

  const d = planData[key];

  if (!d) return;

  document.querySelectorAll(".plan-btn").forEach(function (btn) {

    btn.classList.toggle(
      "active",
      btn.dataset.plan === key
    );

  });


  const planName =
    document.getElementById("pay-plan-name");

  const planPrice =
    document.getElementById("pay-plan-price");

  const planPeriod =
    document.getElementById("pay-plan-period");

  const paketConfirm =
    document.getElementById("pay-paket-confirm");


  if (planName) {
    planName.textContent = d.name;
  }

  if (planPrice) {
    planPrice.textContent = d.price;
  }

  if (planPeriod) {
    planPeriod.textContent = d.period;
  }

  if (paketConfirm) {
    paketConfirm.value = d.confirm;
  }

}


/* =========================
   CEK PAKET DARI URL
   ========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const params =
      new URLSearchParams(window.location.search);

    const selectedPlan =
      params.get("plan") || "monthly";


    if (planData[selectedPlan]) {

      selectPlan(selectedPlan);

    }

  }
);


/* =========================
   PESAN STATUS
   ========================= */

function showPaymentMessage(type, text) {

  const message =
    document.getElementById("pay-msg");


  if (!message) return;


  message.style.display = "block";

  message.textContent = text;


  if (type === "success") {

    message.className =
      "pay-msg success";

  }

  else if (type === "error") {

    message.className =
      "pay-msg error";

  }

  else {

    message.className =
      "pay-msg";

    message.style.display =
      "block";

  }

}


/* =========================
   KONFIRMASI PEMBAYARAN
   ========================= */

function confirmPayment() {


  /* =========================
     AMBIL DATA FORM
     ========================= */

  const nameInput =
    document.getElementById("pay-name");

  const emailInput =
    document.getElementById("pay-email");

  const noteInput =
    document.getElementById("pay-note");

  const paketInput =
    document.getElementById("pay-paket-confirm");

  const message =
    document.getElementById("pay-msg");


  const name =
    nameInput
      ? nameInput.value.trim()
      : "";


  const email =
    emailInput
      ? emailInput.value.trim()
      : "";


  const catatan =
    noteInput
      ? noteInput.value.trim()
      : "";


  const paket =
    paketInput
      ? paketInput.value
      : "";


  /* =========================
     VALIDASI NAMA
     ========================= */

  if (!name) {

    showPaymentMessage(
      "error",
      "❌ Nama lengkap wajib diisi."
    );

    if (nameInput) {
      nameInput.focus();
    }

    return;

  }


  /* =========================
     VALIDASI EMAIL
     ========================= */

  if (!email) {

    showPaymentMessage(
      "error",
      "❌ Email wajib diisi."
    );

    if (emailInput) {
      emailInput.focus();
    }

    return;

  }


  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (!emailRegex.test(email)) {

    showPaymentMessage(
      "error",
      "❌ Masukkan alamat email yang valid."
    );

    if (emailInput) {
      emailInput.focus();
    }

    return;

  }


  /* =========================
     TENTUKAN HARGA
     ========================= */

  let harga = "Rp 0";


  if (paket.includes("19.000")) {

    harga = "Rp 19.000";

  }

  else if (paket.includes("179.000")) {

    harga = "Rp 179.000";

  }


  /* =========================
     WAKTU KONFIRMASI
     ========================= */

  const waktu =
    new Date().toLocaleString(
      "id-ID",
      {
        dateStyle: "full",
        timeStyle: "short"
      }
    );


  /* =========================
     DATA UNTUK EMAILJS
     ========================= */

  const templateParams = {

    name: name,

    email: email,

    paket: paket,

    harga: harga,

    catatan: catatan || "-",

    waktu: waktu

  };


  /* =========================
     TAMPILKAN LOADING
     ========================= */

  showPaymentMessage(
    "loading",
    "⏳ Sedang mengirim konfirmasi pembayaran..."
  );


  /* =========================
     TOMBOL
     ========================= */

  const button =
    document.querySelector(
      'button[onclick="confirmPayment()"]'
    );


  if (button) {

    button.disabled = true;

    button.style.opacity = "0.7";

    button.style.cursor = "not-allowed";

    button.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

  }


  /* =========================
     CEK EMAILJS
     ========================= */

  if (
    typeof emailjs === "undefined"
  ) {

    showPaymentMessage(
      "error",
      "❌ EmailJS belum berhasil dimuat. Periksa koneksi atau script EmailJS di payment.html."
    );


    if (button) {

      button.disabled = false;

      button.style.opacity = "1";

      button.style.cursor = "pointer";

      button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Saya Sudah Membayar — Konfirmasi';

    }

    return;

  }


  /* =========================
     KIRIM EMAIL
     ========================= */

  emailjs.send(
  "service_68x3qfg",
  "timebalance_payment",
  templateParams
)


  /* =========================
     BERHASIL
     ========================= */

  .then(function (response) {

    console.log(
      "EmailJS berhasil:",
      response.status,
      response.text
    );


    showPaymentMessage(
      "success",
      "✅ Konfirmasi pembayaran berhasil dikirim. Silakan tunggu verifikasi dari admin."
    );


    /* Reset form */

    if (nameInput) {
      nameInput.value = "";
    }

    if (emailInput) {
      emailInput.value = "";
    }

    if (noteInput) {
      noteInput.value = "";
    }


    /* Kembalikan tombol */

    if (button) {

      button.disabled = false;

      button.style.opacity = "1";

      button.style.cursor = "pointer";

      button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Saya Sudah Membayar — Konfirmasi';

    }

  })


  /* =========================
     GAGAL
     ========================= */

  .catch(function (error) {

    console.error(
      "EmailJS Error:",
      error
    );


    let errorMessage =
      "Terjadi kesalahan pada EmailJS.";


    if (error && error.text) {

      errorMessage =
        error.text;

    }

    else if (error && error.message) {

      errorMessage =
        error.message;

    }


    showPaymentMessage(
      "error",
      "❌ Gagal: " + errorMessage
    );


    /* Kembalikan tombol */

    if (button) {

      button.disabled = false;

      button.style.opacity = "1";

      button.style.cursor = "pointer";

      button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Saya Sudah Membayar — Konfirmasi';

    }

  });

}