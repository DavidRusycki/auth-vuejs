import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Keycloak from 'keycloak-js';
import VueLogger from 'vuejs-logger';

let initOptions = {
    url: 'http://localhost:8090/', realm: 'nomanage', clientId: 'nomanage', onLoad: 'login-required'
}

let keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad })
    .then(
        (auth) => {
            if (!auth) {
                window.location.reload();
            } else {
                console.info("Authenticated");
                createApp(App).use(router).mount('#app');
            }

            //Token Refresh
            setInterval(() => {
                keycloak.updateToken(70).then((refreshed) => {
                if (refreshed) {
                    console.info('Token refreshed' + refreshed);
                } else {
                    console.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
                }
                }).catch(() => {
                    console.error('Failed to refresh token');
                });
            }, 6000)
        }
    )
.catch(
    () => {
        console.error("Authenticated Failed");
    }
);
