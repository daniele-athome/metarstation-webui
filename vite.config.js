import { resolve } from 'path'
import { defineConfig, loadEnv} from 'vite'
import { VitePWA } from 'vite-plugin-pwa'


export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        base: './',
        root: resolve(__dirname),
        resolve: {
            alias: {
                '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
                '~fontawesome': resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free'),
            }
        },
        plugins: [
            VitePWA({
                filename: 'service-worker.js',
                injectRegister: false,
                manifest: {
                    "name": env.VITE_LOCATION_SHORT_TITLE,
                    "short_name": "Meteo",
                    "description": env.VITE_LOCATION_TITLE,
                    "theme_color": "#2E3540",
                    "background_color": "#E7EDFA",
                    "display": "standalone",
                    "scope": "./",
                    "start_url": "./",
                    "icons": [
                        {
                            "src": "favicon/72x72.png",
                            "sizes": "72x72",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/96x96.png",
                            "sizes": "96x96",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/128x128.png",
                            "sizes": "128x128",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/144x144.png",
                            "sizes": "144x144",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/152x152.png",
                            "sizes": "152x152",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/192x192.png",
                            "sizes": "192x192",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/384x384.png",
                            "sizes": "384x384",
                            "type": "image/png"
                        },
                        {
                            "src": "favicon/512x512.png",
                            "sizes": "512x512",
                            "type": "image/png"
                        }
                    ]
                },
            }),
        ],
        server: {
            port: 5173,
            hot: true
        },
    }
})
