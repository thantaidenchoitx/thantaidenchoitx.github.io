const KEY_STORAGE = "keyStorage";

function loadKeys() {
  const data = JSON.parse(localStorage.getItem(KEY_STORAGE) || "{}");
  const now = Date.now();
  let html = "<h3>Danh sách key:</h3>";
  Object.entries(data).forEach(([key, expire]) => {
    const expText = expire === "forever" ? "Vĩnh viễn" : new Date(expire).toLocaleString();
    html += `<p><b>${key}</b> - ${expText}</p>`;
  });
  document.getElementById("keyList").innerHTML = html;
}

function addKey() {
  const key = document.getElementById("keyInput").value.trim();
  const time = document.getElementById("timeSelect").value;
  if (!key) return alert("Vui lòng nhập key!");

  let expire;
  if (time === "forever") {
    expire = "forever";
  } else {
    const days = parseInt(time);
    expire = Date.now() + days * 24 * 60 * 60 * 1000;
  }

  const data = JSON.parse(localStorage.getItem(KEY_STORAGE) || "{}");
  data[key] = expire;
  localStorage.setItem(KEY_STORAGE, JSON.stringify(data));
  loadKeys();
}

function deleteKey() {
  const key = document.getElementById("keyInput").value.trim();
  const data = JSON.parse(localStorage.getItem(KEY_STORAGE) || "{}");
  delete data[key];
  localStorage.setItem(KEY_STORAGE, JSON.stringify(data));
  loadKeys();
}

window.onload = loadKeys;