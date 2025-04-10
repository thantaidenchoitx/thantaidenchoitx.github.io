const KEY = "o8S;HJUkcfI17h[#tG1k^rajzd;D>[cGtw#Co";
let history = [];
let winCount = 0, loseCount = 0;
let lastHex = "", lastPrediction = "";

function validateKey() {
  const inputKey = document.getElementById("keyInput").value.trim();
  fetch("key.json")
    .then(res => res.json())
    .then(keys => {
      const now = Date.now();
      const valid = keys.find(k => k.key === inputKey && (!k.expire || now < k.expire));
      const msg = document.getElementById("login-message");
      if (valid) {
        msg.innerHTML = "✅ Key hợp lệ!";
        document.getElementById("login-box").style.display = "none";
        document.getElementById("tool-box").style.display = "block";
      } else {
        msg.innerHTML = "❌ Key không hợp lệ hoặc đã hết hạn.";
      }
    });
}

function md5_to_hex(md5_string) {
  return CryptoJS.MD5(md5_string + KEY).toString();
}

function analyze_hex(hex) {
  let total = 0;
  for (let ch of hex) {
    total += parseInt(ch, 16);
  }

  const sumLastBytes = [...Array(4)].map((_, i) =>
    parseInt(hex.slice(hex.length - 8 + i * 2, hex.length - 6 + i * 2), 16)
  ).reduce((a, b) => a + b, 0);

  let streak_bonus = 0;
  if (history.length >= 2 && history[history.length - 1] === history[history.length - 2]) {
    streak_bonus = history[history.length - 1] === "T" ? 8 : -8;
  }

  let tai_percent = 50 + (((total % 18) - 9) * 2) + ((sumLastBytes % 10) - 5) + streak_bonus;
  tai_percent = Math.max(30, Math.min(70, tai_percent));
  const xiu_percent = 100 - tai_percent;
  const prediction = tai_percent > xiu_percent ? "T" : "X";

  return { tai_percent, xiu_percent, prediction };
}

function duDoan() {
  const md5 = document.getElementById("md5").value.trim().toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(md5)) {
    alert("Mã MD5 không hợp lệ!");
    return;
  }

  lastHex = md5_to_hex(md5);
  const { tai_percent, xiu_percent, prediction } = analyze_hex(lastHex);
  lastPrediction = prediction;

  document.getElementById("result").innerHTML = `
    <p>🎯 Tỷ lệ Tài: <b>${tai_percent.toFixed(2)}%</b> | Xỉu: <b>${xiu_percent.toFixed(2)}%</b></p>
    <p>💡 Dự đoán: <b style="color: ${prediction === 'T' ? 'red' : 'aqua'};">${prediction === 'T' ? 'Tài' : 'Xỉu'}</b></p>
  `;
  document.getElementById("actual").disabled = false;
  document.getElementById("actual").focus();
}

function xacNhanKetQua() {
  const actual = document.getElementById("actual").value.trim().toUpperCase();
  if (!["T", "X"].includes(actual)) {
    alert("Vui lòng nhập kết quả là 'T' hoặc 'X'");
    return;
  }
  if (!lastPrediction) {
    alert("Bạn cần dự đoán trước!");
    return;
  }

  history.push(actual);
  if (actual === lastPrediction) {
    document.getElementById("result").innerHTML += `<p style="color:lime;">✅ Dự đoán đúng!</p>`;
    winCount++;
  } else {
    document.getElementById("result").innerHTML += `<p style="color:orange;">❌ Sai rồi!</p>`;
    loseCount++;
  }

  const total = winCount + loseCount;
  const rate = ((winCount / total) * 100).toFixed(2);

  document.getElementById("historyBox").innerHTML = `
    <p>📊 Tổng: ${total} | ✅ Thắng: ${winCount} | ❌ Thua: ${loseCount} | 🎯 Tỷ lệ đúng: ${rate}%</p>
  `;

  document.getElementById("md5").value = "";
  document.getElementById("actual").value = "";
  document.getElementById("actual").disabled = true;
  lastPrediction = "";
}