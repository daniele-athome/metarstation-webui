'use strict';

import '../styles.scss';

import sunTimesManager from './suntimes.js';
import webcamManager from './webcam.js';
import weatherManager from './weather.js';

import * as bootstrap from 'bootstrap'

const themeManager = {
    body: document.querySelector('body'),
    themeToggle: document.querySelector('#flexSwitchCheckChecked'),
    darkQuery: window.matchMedia('(prefers-color-scheme: dark)'),

    initialize: function () {
        this.themeToggle.addEventListener('change', this.onToggle.bind(this));
        this.darkQuery.addEventListener('change', this.onSystemThemeChange.bind(this));
        this.applyTheme(this.getPreferredTheme());
    },

    // the theme explicitly chosen by the user, null if never chosen
    getUserTheme: function () {
        const userTheme = localStorage.getItem('theme');
        return (userTheme === 'dark' || userTheme === 'light') ? userTheme : null;
    },

    // the user choice wins, the browser preference is the default
    getPreferredTheme: function () {
        return this.getUserTheme() ?? (this.darkQuery.matches ? 'dark' : 'light');
    },

    applyTheme: function (theme) {
        const dark = theme === 'dark';
        this.body.classList.toggle('dark', dark);
        this.body.classList.toggle('highcharts-dark', dark);
        this.body.classList.toggle('highcharts-light', !dark);
        this.themeToggle.checked = dark;
        // the background painted on <html> before the page is shown stays
        // around (it shows up e.g. when overscrolling), keep it in sync
        document.documentElement.style.backgroundColor =
            getComputedStyle(this.body).getPropertyValue('--main-bg');
    },

    onToggle: function () {
        const theme = this.themeToggle.checked ? 'dark' : 'light';
        // from now on the browser preference is ignored on this device
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
    },

    onSystemThemeChange: function () {
        // a theme chosen by the user overrides the browser preference for good
        if (this.getUserTheme() === null) {
            this.applyTheme(this.getPreferredTheme());
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
