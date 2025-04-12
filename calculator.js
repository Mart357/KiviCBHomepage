// --------------------------
// HINNADE SEADISTUSED (MUUDETAVAD VÄÄRTUSED)
// --------------------------
const edgePricePerMeter = 10; // €/jm servade töötlemiseks
const faucetHolePrice = 15;   // €/tk segisti/dosaatori ava
const cutoutPricePerCm = 0.5; // €/cm väljalõike ümbermõõdu kohta (pliit/valamu)

// Pliidiplaadi hinnalisand sõltuvalt tüübist
const cooktopTypeMultiplier = {
  mounted: 1,       // Pealepandav - soodsaim
  flush: 1.5        // Tasafreesitud - kallim
};

// Valamu hinnalisand sõltuvalt tüübist
const sinkTypeMultiplier = {
  top: 1,            // Pealtpandav - odavaim
  flush: 1.5,        // Tasafreesitud - keskmine
  undermount: 2      // Altmonteeritav - kõige kallim
};

// --------------------------
// SEISUNDITOIMINGUD
// --------------------------
let details = [];

function calculateCutoutPerimeter(shape, width, height) {
  if (!width || !height) return 0;
  return shape === 'round'
    ? Math.PI * width // Ümmargune: ümbermõõt (π·d)
    : 2 * (width + height); // Kandiline: ümbermõõt
}

function addDetail() {
  const get = (id) => document.getElementById(id);
  const name = get('detail-name').value || 'Nimetu detail';
  const length = parseFloat(get('length').value);
  const width = parseFloat(get('width').value);
  const stonePrice = parseFloat(get('stone-price').value);
  const edgeLength = parseFloat(get('edge-length').value);
  const faucetCount = parseInt(get('faucet-count').value || '0');

  const cooktopCount = parseInt(get('cooktop-count').value || '0');
  const cooktopType = get('cooktop-type').value;
  const cooktopShape = get('cooktop-shape').value;
  const cooktopWidth = parseFloat(get('cooktop-width').value);
  const cooktopHeight = parseFloat(get('cooktop-height').value);

  const sinkCount = parseInt(get('sink-count').value || '0');
  const sinkType = get('sink-type').value;
  const sinkShape = get('sink-shape').value;
  const sinkWidth = parseFloat(get('sink-width').value);
  const sinkHeight = parseFloat(get('sink-height').value);

  if (!length || !width || !stonePrice || !edgeLength) {
    alert('Palun täida kõik vajalikud väljad.');
    return;
  }

  const area = (length * width) / 1_000_000; // mm² -> m²
  const priceStone = area * stonePrice;
  const priceEdges = (edgeLength / 1000) * edgePricePerMeter;
  const priceFaucet = faucetCount * faucetHolePrice;

  const cooktopPerimeter = calculateCutoutPerimeter(cooktopShape, cooktopWidth, cooktopHeight);
  const priceCooktop = cooktopCount * cooktopPerimeter * cutoutPricePerCm * cooktopTypeMultiplier[cooktopType] / 10;

  const sinkPerimeter = calculateCutoutPerimeter(sinkShape, sinkWidth, sinkHeight);
  const priceSink = sinkCount * sinkPerimeter * cutoutPricePerCm * sinkTypeMultiplier[sinkType] / 10;

  const total = priceStone + priceEdges + priceFaucet + priceCooktop + priceSink;

  const detail = {
    name, area, priceStone, priceEdges, priceFaucet, priceCooktop, priceSink, total
  };
  details.push(detail);
  renderDetails();
  document.getElementById('calculator-form').reset();
}

function renderDetails() {
  const container = document.getElementById('details-container');
  container.innerHTML = '';
  details.forEach((d, i) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center bg-gray-100 px-4 py-2 rounded';
    li.innerHTML = `
      <div>
        <strong>${d.name}</strong>: ${d.total.toFixed(2)} €
      </div>
      <button class="text-red-600" onclick="removeDetail(${i})">Eemalda</button>
    `;
    container.appendChild(li);
  });
  document.getElementById('details-list').classList.toggle('hidden', details.length === 0);
}

function removeDetail(index) {
  details.splice(index, 1);
  renderDetails();
}

function calculateTotal(e) {
  e.preventDefault();

  if (details.length === 0) {
    alert("Palun lisa vähemalt üks detail.");
    return;
  }

  let area = 0, stone = 0, edges = 0, faucet = 0, cooktop = 0, sink = 0, total = 0;
  details.forEach(d => {
    area += d.area;
    stone += d.priceStone;
    edges += d.priceEdges;
    faucet += d.priceFaucet;
    cooktop += d.priceCooktop;
    sink += d.priceSink;
    total += d.total;
  });

  document.getElementById('area').textContent = area.toFixed(2);
  document.getElementById('price-stone').textContent = stone.toFixed(2);
  document.getElementById('price-edges').textContent = edges.toFixed(2);
  document.getElementById('price-faucet').textContent = faucet.toFixed(2);
  document.getElementById('price-cooktop').textContent = cooktop.toFixed(2);
  document.getElementById('price-sink').textContent = sink.toFixed(2);
  document.getElementById('total-price').textContent = total.toFixed(2);

  document.getElementById('result').classList.remove('hidden');
}

function generatePDF() {
  if (details.length === 0) {
    alert("Pole midagi PDF-i salvestamiseks.");
    return;
  }

  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();

  doc.setFontSize(18);
  doc.text("Kivipinna hinnapäring", 14, 20);
  doc.setFontSize(11);
  doc.text(`Kuupäev: ${today}`, 14, 28);

  let y = 38;

  details.forEach((detail, index) => {
    doc.setFontSize(12);
    doc.text(`Detail #${index + 1} – ${detail.name}`, 14, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Pindala: ${detail.area.toFixed(2)} m²`, 14, y); y += 6;
    doc.text(`Materjali hind: ${detail.priceStone.toFixed(2)} €`, 14, y); y += 6;
    doc.text(`Ääretöötlus: ${detail.priceEdges.toFixed(2)} €`, 14, y); y += 6;
    doc.text(`Segistiavad: ${detail.priceFaucet.toFixed(2)} €`, 14, y); y += 6;
    doc.text(`Pliidilõiked: ${detail.priceCooktop.toFixed(2)} €`, 14, y); y += 6;
    doc.text(`Valamulõiked: ${detail.priceSink.toFixed(2)} €`, 14, y); y += 6;
    doc.setFont("helvetica", "bold");
    doc.text(`Detaili koguhind: ${detail.total.toFixed(2)} €`, 14, y);
    doc.setFont("helvetica", "normal");
    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  let area = 0, stone = 0, edges = 0, faucet = 0, cooktop = 0, sink = 0, total = 0;
  details.forEach(d => {
    area += d.area;
    stone += d.priceStone;
    edges += d.priceEdges;
    faucet += d.priceFaucet;
    cooktop += d.priceCooktop;
    sink += d.priceSink;
    total += d.total;
  });

  doc.setFontSize(13);
  doc.text("Kokkuvõte", 14, y);
  y += 6;
  doc.setFontSize(11);
  doc.text(`Pindala kokku: ${area.toFixed(2)} m²`, 14, y); y += 6;
  doc.text(`Materjali hind kokku: ${stone.toFixed(2)} €`, 14, y); y += 6;
  doc.text(`Ääretöötlus kokku: ${edges.toFixed(2)} €`, 14, y); y += 6;
  doc.text(`Segistiavad kokku: ${faucet.toFixed(2)} €`, 14, y); y += 6;
  doc.text(`Pliidilõiked kokku: ${cooktop.toFixed(2)} €`, 14, y); y += 6;
  doc.text(`Valamulõiked kokku: ${sink.toFixed(2)} €`, 14, y); y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`➤ Kogusumma: ${total.toFixed(2)} €`, 14, y);

  doc.save("kivipinna_hinnapakkumine.pdf");
}

function setup() {
  document.getElementById('add-detail').addEventListener('click', addDetail);
  document.getElementById('calculator-form').addEventListener('submit', calculateTotal);
  document.getElementById('download-pdf').addEventListener('click', generatePDF);
}

document.addEventListener('DOMContentLoaded', setup);
