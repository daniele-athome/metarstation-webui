'use strict';

export default {
    localImage: document.querySelector('#local-webcam-image'),
    localImageLoading: document.querySelector('#local-webcam-loading'),
    fullscreenImage: document.querySelector('#fullscreen-webcam-image'),
    overlay: document.querySelector('#webcam-overlay'),
    stalePanel: document.querySelector('#local-webcam-stale'),

    imageUrl: import.meta.env.VITE_WEATHER_API_URL + '/image',
    validityMinutes: parseInt(import.meta.env.VITE_WEATHER_INFO_VALIDITY),

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
            this.refreshStalePanel();
        });

        this.requestImage();
    },

    /**
     * Loads the webcam image as a blob, so we can read the last-modified header to evaluate the actual freshness of
     * the image.
     */
    requestImage: function () {
        fetch(this.imageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unexpected response status: ' + response.status);
                }

                this.imageExpired = this.isImageExpired(response.headers.get('last-modified'));
                return response.blob();
            })
            .then(blob => this.displayImage(URL.createObjectURL(blob)))
            .catch(error => {
                console.warn('Unable to fetch the webcam image, falling back to a plain load', error);
                this.displayImage(this.imageUrl);
            });
    },

    displayImage: function (url) {
        if (this.objectUrl !== undefined) {
            // avoids memory leaks
            URL.revokeObjectURL(this.objectUrl);
        }
        this.objectUrl = url.startsWith('blob:') ? url : undefined;
        this.localImage.src = url;
    },

    /**
     * Returns whether the given timestamp has expired.
     * @returns boolean
     */
    isImageExpired: function (lastModified) {
        if (isNaN(this.validityMinutes)) {
            return false;
        }
        if (lastModified === null) {
            console.warn('No last-modified header on the webcam image');
            return false;
        }

        const takenAt = new Date(lastModified);
        const ageMinutes = (Date.now() - takenAt.getTime()) / 60000;
        return ageMinutes > this.validityMinutes;
    },

    refreshStalePanel: function () {
        if (!this.imageExpired) {
            this.stalePanel.classList.add('d-none');
            return;
        }

        this.stalePanel.classList.remove('d-none');
    },
};
