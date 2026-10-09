'use strict';
// Where the real science happens.

// Magnus-Tetens (Alduchov–Eskridge coefficients, a = 17.625, b = 243.04 °C):
const A = 17.625;
const B = 243.04;

/** Saturation vapor pressure over water [hPa]. */
function saturationVapourPressure(tC) {
    return 6.112 * Math.exp((A * tC) / (B + tC));
}

/**
 * Rough nowcast of fog probability from 2 m screen observations.
 *
 * Coefficients are physically-motivated priors, NOT fitted values.
 * Refit them on local data before trusting the output.
 *
 * @param {object} obs
 * @param {number} obs.t            air temperature [°C]
 * @param {number} obs.td           dew point [°C]
 * @param {number} obs.windMs       wind speed [m/s]
 * @param {number} [obs.dp3h]       3-hour pressure tendency [hPa]
 * @param {boolean} [obs.isNight]
 * @param {boolean} [obs.humidSector] wind from a locally fog-prone direction
 * @returns {number} probability in [0, 1]
 */
export function fogProbability({
                                   t,
                                   td,
                                   windMs,
                                   dp3h = 0,
                                   isNight = true,
                                   humidSector = false,
                               }) {
    const vpd = saturationVapourPressure(t) - saturationVapourPressure(td);
    const fWind = Math.exp(-(((windMs - 1.0) / 1.6) ** 2));

    const z =
        2.2 -
        5.5 * vpd +
        1.2 * fWind -
        0.35 * windMs +            // strong wind -> low stratus, not fog
        0.6 * (isNight ? 1 : 0) -
        0.4 * Math.abs(dp3h) +     // flat pressure field favors fog
        0.7 * (humidSector ? 1 : 0);

    return 1 / (1 + Math.exp(-z));
}
