function initMap() {
    Vue.createApp({
        delimiters: ['${', '}'],
        data() {
            return {
                markerList: [],
                routeList: [],
                maps: "",
            }
        },
        methods: {
            deleteMarker() {
                tools.deleteMarker(this.markerList);
            },
            searchRoute() {
                tools.searchRoute(this);
            }
        },
        mounted() {
            tools.createMapInstance(this, 'maps');

            //クリックするとマーカーを作るスクリプト
            google.maps.event.addListener(this.maps, 'click', e => {
                tools.createMarker(this, e.latLng, `名前`);
            });
        },

    }).mount('#app');
}