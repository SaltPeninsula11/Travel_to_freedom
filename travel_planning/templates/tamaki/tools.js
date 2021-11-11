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
const tools = {};

/**
 * 渡されたインスタンス内のmapsプロパティにマップインスタンスを代入します。
 * 苦肉の策です
 * @param {Vue} self - マップを代入したいVueインスタンス
 * @param {string} elementId - マップを表示したいelement_id
 * @author mizuki
 * 
 */
tools.createMapInstance = function (self, elementId) {
    const mapEl = document.getElementById(elementId);
    const mapStyle = {
        zoom: 16,
        center: new google.maps.LatLng(35.86219927057546, 139.9709143952686),
        clickableIcons: false,
        disableDefaultUI: false,
        keyboardShortcuts: false,
        tilt: 0,
    }
    self.maps = new google.maps.Map(mapEl, mapStyle);
}

/**
 * Vueインスタンスと緯度経度インスタンス,タイトルを受け取り、マーカーを作成し表示、それを返す
 * マーカーはクリックされるとVueインスタンスないのmarkerListに入る
 * @param {Vue} self - マーカーを表示させたいMapインスタンスを持つVueインスタンス
 * @param {google.maps.LatLng} latLngInstance - 表示させたい位置のLatLngインスタンス
 * @return {google.maps.Marker} - 表示したMarkerインスタンス
 * @author mizuki
 * 
 */
tools.createMarker = function (self, latLngInstance, markerTitle) {
    const markerOptions = {
        position: latLngInstance,
        map: self.maps,
        title: markerTitle
    }
    const marker = new google.maps.Marker(markerOptions);
    marker.addListener("click", () => {
        self.markerList.push(marker);
        alert(`${markerTitle}をリストにいれました`);
    });
    return marker
}

/**
 * 与えられたマーカー配列のマーカーをマップから消す。
 * @param {Array<google.maps.Marker>} markerList -マーカーインスタンスリスト
 * @return {Array<google.maps.Marker>}
 * @author mizuki
 * 
 */
tools.deleteMarker = function (markerList) {
    markerList.array.forEach(e => {
        e.setMap(null);
    });
    return markerList;
}


/**
 * directionsServiceで検索したルートをマップ上に描画してPromiseを返します
 * @param {DirectionsResult} response - directionsServiceの結果
 * @param {google.maps.Map} mapInstance - ルートを表示させたいMapインスタンス
 * @return {Promise} - 
 * @author mizuki
 * 
 */
tools.viewRoute = function (response, mapInstance) {
    return new Promise(resolve => {
        new google.maps.DirectionsRenderer({
            map: mapInstance,
            directions: response,
            suppressMarkers: true
        });
        resolve(response);
    });
}

/** 
 * directionsServiceで二点間のルートを検索しPromiseを返します
 * @param {google.maps.LatLng} startLatLng - ルートの開始地点
 * @param {google.maps.LatLng} endLatLng - ルートの終了地点
 * @param {*} mode - TravelModeの値いずれか
 * @return {Promise} - 
 * @author mizuki
 * 
 **/
tools.fetchRoute = function (startLatLng, endLatLng, mode) {
    return new Promise((resolve, reject) => {
        const directionsService = new google.maps.DirectionsService();
        let request = {
            origin: startLatLng,
            destination: endLatLng,
            travelMode: google.maps.DirectionsTravelMode[mode], // 移動手段
        };
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                resolve(response);
            } else {
                reject(response);
            }
        });
    });
}

/**
 *渡されたインスタンスのマーカーリストからルート検索をして描画。
 *ルートリストに入れる。
 * @param {Vue} self -vueインスタンス
 * @author mizuki
 * 
 **/
tools.searchRoute = function (self) {
    if (self.markerList.length >= 2) {
        for (let i = 0; i < self.markerList.length - 1; i++) {
            const startLatlng = self.markerList[i].getPosition();
            const endLatlng = self.markerList[i + 1].getPosition();
            this.fetchRoute(startLatlng, endLatlng, 'DRIVING')
                .then(response => {
                    this.viewRoute(response, self.maps);
                    self.routeList.push(response);
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


