'use strict';

import * as SunCalc from 'suncalc';

import dayLandscapeImage from '../images/day-landscape.png';
import nightLandscapeImage from '../images/night-landscape.png';


// TODO move to utils module
const localDateTime = () => {
    // TODO we should use the location timezone instead of the browser one
    return new Date();
}

export default {
    timeFormatOptions: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    },
    localDate: null,
    sunriseTime: null,
    sunsetTime: null,

    sunriseTimeText: document.querySelector('#sunrise-time'),
    sunsetTimeText: document.querySelector('#sunset-time'),
    sceneryImage: document.querySelector('#scenery'),

    initialize: function () {
        this.localDate = localDateTime();
        let sunTimes = SunCalc.getTimes(this.localDate,
            import.meta.env.VITE_LOCATION_LATITUDE,
            import.meta.env.VITE_LOCATION_LONGITUDE,
            import.meta.env.VITE_LOCATION_HEIGHT);
        this.sunriseTime = sunTimes.sunrise;
        this.sunsetTime = sunTimes.sunset;

        this.sunriseTimeText.innerHTML =
            this.sunriseTime.toLocaleTimeString([], this.timeFormatOptions);
        this.sunsetTimeText.innerHTML =
            this.sunsetTime.toLocaleTimeString([], this.timeFormatOptions);

        this.changeSceneryImage();
    },

    changeSceneryImage: function () {
        if (this.isNight()) {
            this.sceneryImage.src = nightLandscapeImage;
            this.sceneryImage.alt = 'Night landscape';
        } else {
            this.sceneryImage.src = dayLandscapeImage;
            this.sceneryImage.alt = 'Day landscape';
        }
    },

    isNight: function () {
        const sunriseHour = this.sunriseTime.getHours();
        const sunsetHour = this.sunsetTime.getHours();

        return this.localDate.getHours() < sunriseHour ||
            this.localDate.getHours() >= sunsetHour;
    }
};
