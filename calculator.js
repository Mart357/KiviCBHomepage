// calculator.js

const OPENING_UNIT_PRICE = 0.5;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("calculator-form");
  const addDetailBtn = document.getElementById("add-detail");
  const detailsList = document.getElementById("details-list");
  const detailsContainer = document.getElementById("details-container");
  const resultBox = document.getElementById("result");
  const downloadPdfBtn = document.getElementById("download-pdf");

  let details = [];

  addDetailBtn.addEventListener("click", () => {
    const name = document.getElementById("detail-name").value || "Detail";
    const length = parseFloat(document.getElementById("length").value);
    const width = parseFloat(document.getElementById("width").value);
    const stonePrice = parseFloat(document.getElementById("stone-price").value);
    const edgeLength = parseFloat(document.getElementById("edge-length").value);
    const faucetCount = parseInt(document.getElementById("faucet-count").value);

    const cooktopCount = parseInt(document.getElementById("cooktop-count").value);
    const cooktopShape = document.getElementById("cooktop-shape").value;
    const cooktopWidth = parseFloat(document.getElementById("cooktop-width").value);
    const cooktopHeight = parseFloat(document.getElementById("cooktop-height").value);

    const sinkCount = parseInt(document.getElementById("sink-count").value);
    const sinkShape = document.getElementById("sink-shape").value;
    const sinkWidth = parseFloat(document.getElementById("sink-width").value);
    const sinkHeight = parseFloat(document.getElementById("sink-height").value);

    if (!length || !width || !stonePrice || !edgeLength) return;

    const area = (length * width) / 1_000_000;
    const priceStone = area * stonePrice;
    const priceEdges = edgeLength * 0.1;
    const priceFaucet = faucetCount * 10;

    const cooktopOpeningLength = calculateOpeningLength(cooktopShape, cooktopWidth, cooktopHeight) * cooktopCount;
    const priceCooktop = cooktopOpeningLength * OPENING_UNIT_PRICE;

    const sinkOpeningLength = calculateOpeningLength(sinkShape, sinkWidth, sinkHeight) * sinkCount;
    const priceSink = sinkOpeningLength * OPENING_UNIT_PRICE;

    const totalPrice = priceStone + priceEdges + priceFaucet + priceCooktop + priceSink;

    const detail = {
      name,
      area,
      priceStone,
      priceEdges,
      priceFaucet,
      priceCooktop,
      priceSink,
      totalPrice
    };

    details.push(detail);
    updateDetailsList();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateTotal();
  });

  downloadPdfBtn?.addEventListener("click", () => {
    generatePdf();
  });

  function calculateOpeningLength(shape, width, height) {
    if (!width || !height) return 0;
    return shape === "square"
      ? 2 * (width + height)
      : 2 * Math.PI * (width / 2);
  }

  function updateDetailsList() {
    detailsContainer.innerHTML = "";
    detailsList.classList.remove("hidden");

    details.forEach((d, i) => {
      const li = document.createElement("li");
      li.className = "border p-2 bg-gray-50 rounded";
      li.textContent = `${d.name}: ${d.totalPrice.toFixed(2)} €`;
      detailsContainer.appendChild(li);
    });
  }

  function calculateTotal() {
    if (details.length === 0) return;
    resultBox.classList.remove("hidden");

    let area = 0, stone = 0, edges = 0, faucets = 0, cooktops = 0, sinks = 0;

    details.forEach((d) => {
      area += d.area;
      stone += d.priceStone;
      edges += d.priceEdges;
      faucets += d.priceFaucet;
      cooktops += d.priceCooktop;
      sinks += d.priceSink;
    });

    const total = stone + edges + faucets + cooktops + sinks;

    document.getElementById("area").textContent = area.toFixed(2);
    document.getElementById("price-stone").textContent = stone.toFixed(2);
    document.getElementById("price-edges").textContent = edges.toFixed(2);
    document.getElementById("price-faucet").textContent = faucets.toFixed(2);
    document.getElementById("price-cooktop").textContent = cooktops.toFixed(2);
    document.getElementById("price-sink").textContent = sinks.toFixed(2);
    document.getElementById("total-price").textContent = total.toFixed(2);
  }

  function generatePdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Hinnapäring - Detailide kokkuvõte", 10, y);
    y += 10;

    details.forEach((d, i) => {
      doc.setFontSize(12);
      doc.text(`Detail ${i + 1}: ${d.name}`, 10, y); y += 6;
      doc.text(` - Kogupindala: ${d.area.toFixed(2)} m²`, 10, y); y += 6;
      doc.text(` - Kiviplaadi hind: ${d.priceStone.toFixed(2)} €`, 10, y); y += 6;
      doc.text(` - Servade töötlemine: ${d.priceEdges.toFixed(2)} €`, 10, y); y += 6;
      doc.text(` - Segisti/dosaatori augud: ${d.priceFaucet.toFixed(2)} €`, 10, y); y += 6;
      doc.text(` - Pliidiplaadi augud: ${d.priceCooktop.toFixed(2)} €`, 10, y); y += 6;
      doc.text(` - Valamu augud: ${d.priceSink.toFixed(2)} €`, 10, y); y += 6;
      doc.text(` - Koguhind: ${d.totalPrice.toFixed(2)} €`, 10, y); y += 10;
    });

    doc.save("hinnaparine.pdf");
  }
});
