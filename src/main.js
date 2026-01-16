'use strict';

import '../styles.scss';

import sunTimesManager from './suntimes.js';
import webcamManager from './webcam.js';
import weatherManager from './weather.js';

import * as bootstrap from 'bootstrap'

const themeManager = {
    body: document.querySelector('body'),
    themeToggle: document.querySelector('#flexSwitchCheckChecked'),

    initialize: function () {
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        this.getSavedTheme();
    },

    toggleTheme: function () {
        this.body.classList.toggle('dark');
        this.body.classList.toggle('highcharts-dark');
        localStorage.setItem('theme', this.body.classList.contains('dark') ? 'dark' : 'light');
    },

    getSavedTheme: function () {
        const userTheme = localStorage.getItem('theme');
        if (userTheme === 'dark') {
            this.themeToggle.checked = true;
            this.toggleTheme();
        }
    },

    loaded: function() {
        this.body.classList.remove('loading');
    }
};

document.addEventListener("DOMContentLoaded", () => {
    themeManager.initialize();
    themeManager.loaded();

    sunTimesManager.initialize();
    weatherManager.initialize();
    webcamManager.initialize();

    // tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
