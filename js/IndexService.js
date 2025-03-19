function moveImages() {
    const images = [
        { id: 'service1-image', images: ['/img/IndexBanner.jpg', '/img/Materials/Quartz/Superwhite/SuperwhiteKitchen.jpeg', '/img/indexbackground2.jpeg',  '/img/Materials/Quartz/Superwhite/SuperwhiteCountertopSink.jpg'] },
        { id: 'service2-image', images: ['/img/ServiceCardBathroom/Bathroom1.jpg', '/img/ServiceCardBathroom/Bathroom2.jpg', '/img/ServiceCardBathroom/Bathroom3.jpg', '/img/ServiceCardBathroom/Bathroom4.jpg'] },
        { id: 'service3-image', images: ['/img/ServiceCardOther/OtherFireplace1.jpg', '/img/ServiceCardOther/OtherStairs.jpg', '/img/ServiceCardOther/OtherStairs3.jpg'] },
    ];

    images.forEach((imageData) => {
        const imageContainer = document.getElementById(imageData.id); //Leiame pildi konteineri, kuhu pilti muuta
        if (!imageContainer) {
            console.warn(`Element with id ${imageData.id} not found. Skipping this image set.`);
            return;
        }

        // Lisame Tailwind CSS-i taustapildi klassid
        imageContainer.classList.add('bg-cover', 'bg-center');

        let index = 0;

         // Piltide vaheldumine
        setInterval(() => {
            imageContainer.style.backgroundImage = `url(${imageData.images[index]})`;  // Muudame taustapildi
            index = (index + 1) % imageData.images.length;  // Liigume järgmise pildi juurde (kui jõuab lõppu, alustame algusest)
        }, 3000); // Muudame pilti iga 3 sekundi tagant
    });
}

window.onload = function () {
    moveImages();
};