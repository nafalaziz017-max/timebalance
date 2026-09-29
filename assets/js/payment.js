/* =========================================================
   TIMEBALANCE - PAYMENT.JS
   EmailJS Payment Confirmation
   ========================================================= */

/* =========================
   PLAN DATA
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
   SELECT PLAN
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

  const planName = document.getElementById("pay-plan-name");
  const planPrice = document.getElementById("pay-plan-price");
  const planPeriod = document.getElementById("pay-plan-period");
  const paketConfirm = document.getElementById("pay-paket-confirm");

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
   READ PLAN FROM URL
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

  const params = new URLSearchParams(window.location.search);

  const selectedPlan =
    params.get("plan") || "monthly";

  if (planData[selectedPlan]) {
    selectPlan(selectedPlan);
  }

});


/* =========================
   PAYMENT CONFIRMATION
   ========================= */

function confirmPayment() {

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


  /* =========================
     GET FORM VALUES
     ========================= */

  const name =
    nameInput ? nameInput.value.trim() : "";

  const email =
    emailInput ? emailInput.value.trim() : "";

  const catatan =
    noteInput ? noteInput.value.trim() : "";

  const paket =
    paketInput ? paketInput.value : "";


  /* =========================
     VALIDATION
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


  if (!email) {

    showPaymentMessage(
      "error",
      "❌ Email aktif wajib diisi."
    );

    if (emailInput) {
      emailInput.focus();
    }

    return;
  }


  /* =========================
     EMAIL VALIDATION
     ========================= */

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
     GET PRICE
     ========================= */

  let harga = "Rp 0";


  if (paket.includes("19.000")) {

    harga = "Rp 19.000";

  } else if (paket.includes("179.000")) {

    harga = "Rp 179.000";

  }


  /* =========================
     CURRENT TIME
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
     EMAILJS PARAMETERS
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
     SHOW LOADING
     ========================= */

  showPaymentMessage(
    "loading",
    "⏳ Sedang mengirim konfirmasi pembayaran..."
  );


  /* =========================
     DISABLE BUTTON
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
     SEND EMAIL WITH EMAILJS
     ========================= */

  emailjs.send(

    "service_68x3qfg",

    "n56f5gr",

    templateParams

  )

  .then(function (response) {

    console.log(
      "EmailJS berhasil:",
      response.status,
      response.text
    );


    /* =========================
       SUCCESS MESSAGE
       ========================= */

    showPaymentMessage(
      "success",
      "✅ Konfirmasi pembayaran berhasil dikirim. Silakan tunggu verifikasi dari admin."
    );


    /* =========================
       RESET FORM
       ========================= */

    if (nameInput) {
      nameInput.value = "";
    }

    if (emailInput) {
      emailInput.value = "";
    }

    if (noteInput) {
      noteInput.value = "";
    }


    /* =========================
       RESTORE BUTTON
       ========================= */

    if (button) {

      button.disabled = false;

      button.style.opacity = "1";

      button.style.cursor = "pointer";

      button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Saya Sudah Membayar — Konfirmasi';

    }

  })


  .catch(function (error) {

    console.error(
      "EmailJS Error:",
      error
    );


    /* =========================
       ERROR MESSAGE
       ========================= */

    showPaymentMessage(
      "error",
      "❌ Konfirmasi gagal dikirim. Silakan coba lagi beberapa saat."
    );


    /* =========================
       RESTORE BUTTON
       ========================= */

    if (button) {

      button.disabled = false;

      button.style.opacity = "1";

      button.style.cursor = "pointer";

      button.innerHTML =
        '<i class="fas fa-paper-plane"></i> Saya Sudah Membayar — Konfirmasi';

    }

  });

}


/* =========================
   PAYMENT MESSAGE
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

    message.style.background =
      "rgba(79, 70, 229, 0.08)";

    message.style.color =
      "var(--primary)";

    message.style.border =
      "1px solid rgba(79, 70, 229, 0.18)";

  }

}