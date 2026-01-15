'use strict';

export default {
    localImage: document.querySelector('#local-webcam-image'),
    localImageLoading: document.querySelector('#local-webcam-loading'),
    fullscreenImage: document.querySelector('#fullscreen-webcam-image'),
    overlay: document.querySelector('#webcam-overlay'),

    initialize: function () {
        this.localImage.addEventListener('click', async () => {
            this.fullscreenImage.src = this.localImage.src;
            this.overlay.classList.add('active');
            await this.overlay.requestFullscreen();
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        });
        this.fullscreenImage.addEventListener('click', async () => {
            this.overlay.classList.remove('active');
            await document.exitFullscreen();
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        });

        this.localImage.addEventListener('load', () => {
            this.localImage.classList.remove('d-none');
            this.localImageLoading.classList.add('d-none');
        });
        this.localImage.src = import.meta.env.VITE_WEATHER_API_URL + '/image';
    },
};
