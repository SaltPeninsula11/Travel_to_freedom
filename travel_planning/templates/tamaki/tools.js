/**
 * グーグルマップ
 * @external "google.maps.Map"
 * 
 * グーグルマップ マーカー
 * @external "google.maps.Marker"
 * 
 * グーグルマップ 緯度経度
 * @external "google.maps.LatLng"
 * 
 */
/**
 * https://www.ibm.com/docs/ja/mpf/7.1.0?topic=logger-javascript-module-example
 */
// 読み込み順序遅延
// document.addEventListener('DOMContentLoaded', function () {
//     const sc = document.createElement('script');
//     sc.src = `https://maps.googleapis.com/maps/api/js?key=${pageOption.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
//     document.body.appendChild(sc);
// });

/**
 * 関数のラッピング用オブジェクト
 * 
 */
const mapTools = {};
/**
 * Vueを使わない用のオブジェクト
 * @module commons
 */
mapTools.commons = (function () {
    const MAP_INIT_LAT = 35.86219927057546;
    const MAP_INIT_LNG = 139.9709143952686;
    const MAP_INIT_ZOOM = 16;

    /**
     * google maps apiのmapを表示させるelement name
     */
    let mapElmentName;
    /**
     * google maps apiのmapを表示させるdom
     */
    let mapEl;

    /**
     * 
     */
    const init = function () {
        mapElmentName = "map";
    }


    /**
     * マップインスタンスを作成し返します
     * @static
     * @function createMapInstance - dom     
     * @return {google.maps.Map} - googleマップインスタンス
     * @author mizuki
     * 
     */
    const createMapInstance = function (dom) {
        const mapStyle = {
            zoom: MAP_INIT_ZOOM,
            center: new google.maps.LatLng(MAP_INIT_LAT, MAP_INIT_LNG),
            clickableIcons: false,
            disableDefaultUI: false,
            keyboardShortcuts: false,
            tilt: 0,
        }
        return new google.maps.Map(dom, mapStyle);

    }



    /**
     * Mapインスタンスとマーカを入れる配列、緯度経度インスタンス、タイトルを受け取り、
     * マーカーを作成し表示、それを返す
     * @static
     * @function createMarker
     * @param {"google.maps.Map"} maps - 表示させたいmapインスタンス
     * @param {"google.maps.LatLng"} latLngInstance - 表示させたい位置のLatLngインスタンス
     * @param {String} markerTitle - マーカーを格納したい配列
     * @param {Array<"google.maps.Marke">} markerList - マーカーを格納したい配列
     * @author mizuki
     * 
     */
    const createMarker = function (maps, latLngInstance, markerTitle) {
        const markerOptions = {
            position: latLngInstance,
            map: maps,
            title: markerTitle
        }
        const marker = new google.maps.Marker(markerOptions);
        return marker
    }


    /**
     * 与えられたマーカー配列のマーカーをマップから消す。
     * **配列から削除するわけではない**
     * @static
     * @function deleteMarker
     * @param {Array<"google.maps.Marker">} markerList -マーカーインスタンスリスト
     * @return {Array<"google.maps.Marker">}
     * @author mizuki
     * 
     */
    const deleteMarker = function (markerList) {
        console.log("deleteMaker");
        return markerList.forEach(e => {
            // e.setVisible(false);
            e.setMap(null);
        });
    }



    /**
     * directionsServiceで検索したルートをマップ上に描画してPromiseを返します
     * @static
     * @function viewRoute
     * @param {"DirectionsResult"} response - directionsServiceの結果
     * @param {"google.maps.Map"} mapInstance - ルートを表示させたいMapインスタンス
     * @return {Promise} - 
     * @author mizuki
     * 
     */
    const viewRoute = function (response, mapInstance) {
        return new google.maps.DirectionsRenderer({
            map: mapInstance,
            directions: response,
            suppressMarkers: true
        });
    }

    const deleteRenderer = function (routeList) {
        console.log("deleterenderer")
        console.log(routeList);
        return routeList.forEach(e => {
            console.log(e);
            // e.renderer.setVisible(false)
            // e.renderer.setPanel(null);
            e.renderer.setMap(null);
            // e.renderer = null;
        });
    }

    /** 
     * directionsServiceで二点間のルートを検索しPromiseを返します
     * @static
     * @function fetchRoute
     * @param {"google.maps.LatLng"} startLatLng - ルートの開始地点
     * @param {"google.maps.LatLng"} endLatLng - ルートの終了地点
     * @param {String} mode - TravelModeの値いずれか
     * @return {Promise} - 
     * @author mizuki
     * 
     **/
    const fetchRoute = function (startLatLng, endLatLng, mode) {
        const directionsService = new google.maps.DirectionsService();
        let request = {
            origin: startLatLng,
            destination: endLatLng,
            travelMode: google.maps.DirectionsTravelMode[mode], // 移動手段
        };
        return directionsService.route(request)
    }


    /**
     *渡されたインスタンスのマーカーリストからルート検索をして描画。
     *ルートリストに入れる。
     * @param {"google.maps.Map"} mapInstance - ルートを表示させたいMapインスタンス
     * @param {Array<"google.maps.Marker">} selectList -マーカーインスタンスリスト
     * @param {Array<"google.maps.DirectionsResult">} routeList -DirectionsResultリスト
     * @author mizuki
     * 
     **/
    const searchRoute = function (mapInstance, selectList, routeList) {
        if (selectList.length >= 2) {
            console.log("action");
            this.deleteRenderer(routeList);
            for (let i = 0; i < selectList.length - 1; i++) {
                const startLatlng = selectList[i].getPosition();
                const endLatlng = selectList[i + 1].getPosition();
                this.fetchRoute(startLatlng, endLatlng, 'DRIVING')
                    .then(response => {
                        console.log(this);
                        response.renderer = this.viewRoute(response, mapInstance);
                        console.log(response);
                        routeList.push(response);
                    })
                    .catch(e => {
                        alert("取得に失敗したよ");
                        console.error(e);
                    })
                    .then(() => {
                        console.log("ルート検索終了");
                    });
            }
        }

    }

    init();
    return {
        createMapInstance: createMapInstance,
        createMarker: createMarker,
        deleteMarker: deleteMarker,
        viewRoute: viewRoute,
        fetchRoute: fetchRoute,
        searchRoute: searchRoute,
        deleteRenderer: deleteRenderer
    }
})();
Object.freeze(mapTools.commons)

/**
 * 渡されたインスタンス内のmapsプロパティにマップインスタンスを代入します。
 * 苦肉の策です
 * @param {Vue} self - マップを代入したいVueインスタンス
 * @param {string} elementId - マップを表示したいelement_id
 * @param {string} mapPropertyName -代入したいオブジェクトプロパティ名
 * @return {"google.maps.Map"} - googleマップインスタンス
 * @author mizuki
 * 
 */
mapTools.createMapInstance = function (self, elementId, mapPropertyName = "maps") {
    self[mapPropertyName] = this.commons.createMapInstance(self.$refs[elementId]);
    return self[mapPropertyName];
}


/**
 * Vueインスタンスと緯度経度インスタンス,タイトルを受け取り、マーカーを作成し表示、それを返す
 * マーカーはクリックされるとVueインスタンスないのmarkerListに入る
 * @param {Vue} self - マーカーを表示させたいMapインスタンスを持つVueインスタンス
 * @param {google.maps.LatLng} latLngInstance - 表示させたい位置のLatLngインスタンス
 * @param {string} markerTitle - 表示させるマーカーのタイトル
 * @param {string=} mapPropertyName -使用するマップインスタンスのプロパティ名
 * @param {string=} markerListPropertyName - 使用する配列のプロパティ名
 * @param {string=} selectListPropertyName - 使用する配列のプロパティ名
 * @return {google.maps.Marker} - 表示したMarkerインスタンス
 * @author mizuki
 * 
 */
mapTools.setUpMarker = function (self, latLngInstance, markerTitle = "無題のマーカー", mapPropertyName = "maps", markerListPropertyName = "markerList", selectListPropertyName = "selectList") {
    const marker = this.commons.createMarker(
        self[mapPropertyName],
        latLngInstance,
        markerTitle
    );

    self[markerListPropertyName].push(marker);
    marker.addListener("click", () => {
        self[selectListPropertyName].push(marker);
        alert(`${markerTitle}をリストにいれました`);
    });
    return marker
}



/**
 * 与えられたマーカー配列のマーカーをマップから消す。
 * @param {Vue} self -Vueインスタンス
 * @param {string=} markerListPropertyName - 使用する配列のプロパティ名
 * @return {Array<google.maps.Marker>}
 * @author mizuki
 * 
 */
mapTools.deleteMarker = function (self, markerListPropertyName = "markerList") {
    return this.commons.deleteMarker(self[markerListPropertyName]);
}


/**
 * 与えられたマーカー配列のマーカーをマップから消す。
 * @param {Vue} self -Vueインスタンス
 * @param {string=} selectListPropertyName - 使用する配列のプロパティ名
 * @return {Array<google.maps.Marker>}
 * @author mizuki
 * 
 */
mapTools.deleteSelect = function (self, selectListPropertyName = "selectList") {
    self[selectListPropertyName] = [];
    return self[selectListPropertyName];
}




/**
 *渡されたインスタンスのマーカーリストからルート検索をして描画。
 *ルートリストに入れる。
 * @param {Vue} self -vueインスタンス
 * @param {string=} mapPropertyName - 使用するマップインスタンスのプロパティ名
 * @param {string=} selectListPropertyName - 使用する配列のプロパティ名
 * @param {string=} routeListPropertyName - 使用する配列のプロパティ名
 * @author mizuki
 * 
 **/
mapTools.searchRoute = function (self, mapPropertyName = "maps", selectListPropertyName = "selectList", routeListPropertyName = "routeList") {
    self[routeListPropertyName] = [];
    this.commons.searchRoute(
        self[mapPropertyName],
        self[selectListPropertyName],
        self[routeListPropertyName]
    );
}



