
function moveImages() {
    const images = [
        { id: 'service1-image', images: ['/img/service1a.jpg', '/img/service1b.jpg', '/img/service1c.jpg'] },
        { id: 'service2-image', images: ['/img/service2a.jpg', '/img/service2b.jpg', '/img/service2c.jpg'] },
        { id: 'service3-image', images: ['/img/service3a.jpg', '/img/service3b.jpg', '/img/service3c.jpg'] },
    ];

    images.forEach((imageData) => {
        const imageContainer = document.getElementById(imageData.id);  // Leiame pildi konteineri
        if (!imageContainer) {
            console.error(`Element with id ${imageData.id} not found.`);
            return;
        }
        let index = 0;

        // Piltide vaheldumine
        setInterval(() => {
            imageContainer.style.backgroundImage = `url(${imageData.images[index]})`;  // Muudame taustapildi
            index = (index + 1) % imageData.images.length;  // Liigume järgmise pildi juurde (kui jõuab lõppu, alustame algusest)
        }, 3000); // Muudame pilti iga 3 sekundi tagant
    });
}

// Skript käivitub, kui leht on laaditud
window.onload = function() {
    moveImages();
};
