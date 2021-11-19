let photoList = [];
let nameList = [];
let markers = [];
var markerIndex = 0;

window.onload = memoInitial();

function isLocationFree(search) {
    for (var i= 0; i < markers.length; i++) {
        markerIndex = i;
        if (markers[i].position.lat() === search[0] && markers[i].position.lng() === search[1]) {
            //すでに存在しています！
            return false;
        }
    }
    return true;
}

function togglePin(photo, name, x, y) {
    if (isLocationFree([x, y])) {
        //ピンを指す場所に移動
        map.setCenter({ lat: x, lng: y });

        //ピンを指す
        markers.push(new google.maps.Marker({
            position: { lat: x, lng: y },
            animation: google.maps.Animation.DROP,
        }));
        markers[markers.length-1].setMap(map);

        photoList.push(photo);
        nameList.push(name);

        //getInfo(x, y);
    } else {
        //ピンをはずす
        markers[markerIndex].setMap(null);
        markers.splice(markerIndex, 1);
        photoList.splice(markerIndex, 1);
        nameList.splice(markerIndex, 1);
    }
    memoInitial();
}

function removeSchedule(index) {
    //✖ボタンが押された
    markers[index].setMap(null);
    markers.splice(index, 1);
    photoList.splice(index, 1);
    nameList.splice(index, 1);

    memoInitial();
}

  
var toggleMemo = false;

$(".openbtn4").click(function () {
    $(this).toggleClass('active');
    ToggleMemo();
});

function ToggleMemo() {
    toggleMemo = !toggleMemo;

    memoInitial();
}
  
function memoInitial() {
    var memoSpace = document.getElementsByClassName("memoSpace")[0];

    if (toggleMemo) {
        memoSpace.style.display = "block";
        memoSpace.innerHTML = "";

        for (var i = 0; i < 15; i++) {
            if (markers[i]) {
                makeMemoTable(memoSpace, i);
            } else {
                makeNullSpace(memoSpace, i);
            }
        }
    } else {
        memoSpace.style.display = "none";
    }
}
  
function makeMemoTable(memoSpace, index) {
    var hour = (index + 9);

    memoSpace.insertAdjacentHTML(
        "beforeend", 
        '\
        <table class="memoTable">\
            <tr>\
                <td class="timeDisplay"><h2>' + ('00' + (hour % 24)).slice(-2) + ':00</h2></td>\
                <td>\
                    <div class="placeTable">\
                        <table>\
                            <tr>\
                                <td rowspan="2">\
                                    <div class="placePhoto">\
                                        <img src='+ photoList[index] +'>\
                                    </div>\
                                </td>\
                                <td><h3>' + nameList[index] + '</h3></td>\
                                <td rowspan="2">\
                                    <button onclick="removeSchedule(' + index + ')">×</button>\
                                </td>\
                            </tr>\
                            <tr>\
                                <td>\
                                    ' + ('00' + (hour % 24)).slice(-2) + ':00\
                                    ～\
                                    ' + ('00' + ((hour+1) % 24)).slice(-2) + ':00\
                                    </td>\
                            </tr>\
                        </table>\
                    </div>\
                </td>\
            </tr>\
        </table>'
    );
}
function makeNullSpace(memoSpace, hour) {
    hour += 9;

    memoSpace.insertAdjacentHTML(
        "beforeend", 
        '\
        <table class="memoTable">\
            <tr>\
                <td class="timeDisplay"><h2>' + ('00' + (hour % 24)).slice(-2) + ':00</h2></td>\
            </tr>\
        </table>'
    );
}