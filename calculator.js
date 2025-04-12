let details = [];

document.getElementById("add-detail").addEventListener("click", function () {
  const name = document.getElementById("detail-name").value || "Nimetu detail";
  const lengthMM = parseFloat(document.getElementById("length").value);
  const widthMM = parseFloat(document.getElementById("width").value);
  const edgeLengthMM = parseFloat(document.getElementById("edge-length").value);
  const stonePrice = parseFloat(document.getElementById("stone-price").value);

  const faucetCount = parseInt(document.getElementById("faucet-count").value);
  const cooktopCount = parseInt(document.getElementById("cooktop-count").value);
  const cooktopType = document.getElementById("cooktop-type").value;
  const sinkCount = parseInt(document.getElementById("sink-count").value);
  const sinkType = document.getElementById("sink-type").value;

  if (isNaN(lengthMM) || isNaN(widthMM) || isNaN(stonePrice)) {
    alert("Palun täida kõik nõutud väljad!");
    return;
  }

  const length = lengthMM / 1000;
  const width = widthMM / 1000;
  const area = length * width;
  const priceStone = area * stonePrice;
  const priceEdges = edgeLengthMM * 0.01;
  const priceFaucet = faucetCount * 5;
  const cooktopUnitPrice = cooktopType === "mounted" ? 20 : 35;
  const priceCooktop = cooktopCount * cooktopUnitPrice;

  let sinkUnitPrice = 0;
  if (sinkType === "top") sinkUnitPrice = 25;
  else if (sinkType === "flush") sinkUnitPrice = 40;
  else if (sinkType === "undermount") sinkUnitPrice = 55;
  const priceSink = sinkCount * sinkUnitPrice;

  const totalDetailPrice = priceStone + priceEdges + priceFaucet + priceCooktop + priceSink;

  details.push({
    name,
    area,
    priceStone,
    priceEdges,
    priceFaucet,
    priceCooktop,
    priceSink,
    totalDetailPrice,
  });

  updateDetailList();
});

function updateDetailList() {
  const container = document.getElementById("details-container");
  container.innerHTML = "";
  let total = 0;

  details.forEach((d, index) => {
    const li = document.createElement("li");
    li.classList.add("flex", "justify-between", "items-center", "border-b", "pb-1");
    li.innerHTML = `
      <div>
        <strong>${d.name}</strong> – ${d.area.toFixed(2)} m², ${d.totalDetailPrice.toFixed(2)} €
      </div>
      <button onclick="removeDetail(${index})" class="text-red-600 hover:underline text-sm">Eemalda</button>
    `;
    container.appendChild(li);
    total += d.totalDetailPrice;
  });

  document.getElementById("details-list").classList.remove("hidden");

  document.getElementById("area").textContent = details.reduce((sum, d) => sum + d.area, 0).toFixed(2);
  document.getElementById("price-stone").textContent = details.reduce((sum, d) => sum + d.priceStone, 0).toFixed(2);
  document.getElementById("price-edges").textContent = details.reduce((sum, d) => sum + d.priceEdges, 0).toFixed(2);
  document.getElementById("price-faucet").textContent = details.reduce((sum, d) => sum + d.priceFaucet, 0).toFixed(2);
  document.getElementById("price-cooktop").textContent = details.reduce((sum, d) => sum + d.priceCooktop, 0).toFixed(2);
  document.getElementById("price-sink").textContent = details.reduce((sum, d) => sum + d.priceSink, 0).toFixed(2);
  document.getElementById("total-price").textContent = total.toFixed(2);

  document.getElementById("result").classList.remove("hidden");
}

function removeDetail(index) {
  details.splice(index, 1);
  updateDetailList();
}

document.getElementById("calculator-form").addEventListener("submit", function(event) {
  event.preventDefault();
  if (details.length === 0) {
    alert("Palun lisa vähemalt üks detail!");
  } else {
    alert("Vaata tulemusi allpool.");
  }
});
