async function taoKey() {
  const key = document.getElementById("newKey").value.trim();
  const duration = parseInt(document.getElementById("duration").value);
  const now = Date.now();
  const expire = duration === 0 ? null : now + duration;

  try {
    const res = await fetch("key.json");
    const data = await res.json();
    data.push({ key, expire });

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "key.json";
    a.click();
  } catch (e) {
    alert("Không thể cập nhật key.json");
    console.error(e);
  }
}