const KEY_STORAGE = "keyStorage";

function checkKey() {
  const key = document.getElementById("keyInput").value.trim();
  const data = JSON.parse(localStorage.getItem(KEY_STORAGE) || "{}");
  const now = Date.now();
  if (data[key]) {
    const expire = data[key];
    if (expire === "forever" || now < expire) {
      alert("✅ Key hợp lệ!");
    } else {
      alert("⛔ Key đã hết hạn!");
    }
  } else {
    alert("❌ Key không tồn tại!");
  }
}