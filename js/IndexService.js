function moveImages() {
    const images = [
        { id: 'service1-image', images: ['/img/IndexBanner.jpg', '/img/Materials/Quartz/Superwhite/SuperwhiteKitchen.jpeg', '/img/indexbackground2.jpeg', '/img/Materials/Quartz/Superwhite/SuperwhiteCountertopSink.jpg'] },
        { id: 'service2-image', images: ['/img/ServiceCardBathroom/Bathroom1.jpg', '/img/ServiceCardBathroom/Bathroom2.jpg', '/img/ServiceCardBathroom/Bathroom3.jpg', '/img/ServiceCardBathroom/Bathroom4.jpg'] },
        { id: 'service3-image', images: ['/img/ServiceCardOther/OtherFireplace1.jpg', '/img/ServiceCardOther/OtherStairs.jpg', '/img/ServiceCardOther/OtherStairs3.jpg'] },
    ];

    images.forEach((imageData) => {
        const imageContainer = document.getElementById(imageData.id); // Leiame pildi konteineri, kuhu pilti muuta
        if (!imageContainer) {
            console.warn(`Element with id ${imageData.id} not found. Skipping this image set.`);
            return;
        }

        // Lisame Tailwind CSS-i taustapildi klassid
        imageContainer.classList.add('bg-cover', 'bg-center');

        let index = 0;
        let intervalId;

        // Funktsioon piltide vaheldamiseks
        function changeImage() {
            imageContainer.style.backgroundImage = `url(${imageData.images[index]})`; // Muudame taustapildi
            index = (index + 1) % imageData.images.length; // Liigume järgmise pildi juurde (kui jõuab lõppu, alustame algusest)
        }

        // Algne piltide vaheldumise käivitamine
        intervalId = setInterval(changeImage, 3000); // Muudame pilti iga 3 sekundi tagant

        // Kui hiir liigub pildi peale, peatame piltide vaheldumise
        imageContainer.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });

        // Kui hiir liigub pildilt ära, alustame piltide vaheldumist uuesti
        imageContainer.addEventListener('mouseleave', () => {
            intervalId = setInterval(changeImage, 3000); // Jätkame piltide vaheldumist
        });

        // Puute ekraanil piltide vaheldumise peatamine
        imageContainer.addEventListener('touchstart', () => {
            clearInterval(intervalId); // Peatame piltide vaheldumise
        });

        // Kui puude ekraanilt ära liigutatakse, alustame piltide vaheldumist uuesti
        imageContainer.addEventListener('touchend', () => {
            intervalId = setInterval(changeImage, 3000); // Jätkame piltide vaheldumist
        });
    });
}

window.onload = function () {
    moveImages();
};
