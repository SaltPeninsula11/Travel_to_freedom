//始端時刻
beginHour = 0;
//終端時刻
endHour = 23;
//5分あたりのピクセル（例：16px）
fiveMinPerPx = 12;

//タイムスタンプのクラス
class TimeStamp {
    constructor (id, photoAddress, name, beginTime, stayingTime) {
        this.id = id;                    //ID
        this.photoAddress = photoAddress;//写真
        this.name = name;                //名称
        this.beginTime = beginTime;      //開始時間（分単位）
        this.stayingTime = stayingTime;  //滞在時間（分単位）
    }

    //セッター
    setId(id) {
        this.id = id;
    }
    setPhoto(photoAddress) {
        this.photoAddress = photoAddress;
    }
    setName(name) {
        this.name = name;
    }
    setBegin(beginTime) {
        this.beginTime = beginTime;
    }
    setStaying(stayingTime) {
        this.stayingTime = stayingTime;
    }
    //ゲッター
    getId() {
        return this.id;
    }
    getPhoto() {
        return this.photoAddress;
    }
    getName() {
        return this.name;
    }
    getBegin() {
        return this.beginTime;
    }
    getStaying() {
        return this.stayingTime;
    }
}
//カードのクラス
class ScheduleCard {
    #beginTime = 0;
    #endTime = 0;
    #timeBetween = 0;

    constructor (id, photoAddress, name, cardInfo, cardY, pixel, fiveMinPerPx, beginHour, endHour) {
        this.id = id;             //ID
        this.photoAddress = photoAddress;
        this.name = name;
        this.cardInfo = cardInfo; //カードクラスのinnerHTML
        this.cardY = cardY;
        this.pixel = pixel;

        this.fiveMinPerPx = fiveMinPerPx;
        this.beginHour = beginHour;
        this.endHour = endHour;
        
        this.cardInfo.style.top = this.cardY + "px";
        this.cardInfo.id = this.id;

        this.#timeBetween = this.endHour - this.beginHour + 1;
    }
    
    //セッター
    setId(id) {
        this.id = id;
        this.cardInfo.id = this.id;
    }
    setCardY(cardY) {
        this.cardY = cardY;
    }
    //ゲッター
    getId() {
        return this.id;
    }
    getCardY() {
        return this.cardY;
    }
    getBeginTime() {
        return this.#beginTime;
    }
    getEndTime() {
        return this.#endTime;
    }

    extend(yPos) {
        //1時間ごと：1/12マスごと（5分単位）
        var max = this.fiveMinPerPx * 12 * this.#timeBetween;
        if (yPos > max) yPos = max;

        this.pixel = Math.max(4, Math.floor((yPos - this.cardY) / this.fiveMinPerPx));
        var calcHeight = this.pixel * this.fiveMinPerPx;

        this.cardInfo.style.height = calcHeight + "px";
        
        this.timeFormat();
    }
    timeFormat() {
        //開始時間
        this.#beginTime = Math.round((this.cardY / (this.fiveMinPerPx * 12)) * 60);
        //終了時間
        this.#endTime = this.#beginTime + (this.pixel * 5);

        this.cardInfo.innerHTML = 
            "\
            <table>\
                <tr>\
                    <td rowspan='2' class='cardPhoto'>\
                        <img src='" + this.photoAddress + "' alt='" + this.name + "'>\
                    </td>\
                    <td class='nameAndTime'>" + this.name + "</td>\
                </tr>\
                <tr>\
                    <td class='nameAndTime'>" +
                        this.getHour(this.#beginTime) + ":" + this.getMinutes(this.#beginTime) + "～"
                        + this.getHour(this.#endTime) + ":" + this.getMinutes(this.#endTime) + "\
                    </td>\
                </tr>\
            </table>";
    }
    getHour(time) {
        return ('00' + (Math.floor((time + this.beginHour * 60) / 60) % 24)).slice(-2);
    }
    getMinutes(time) {
        return ('00' + ((time + this.beginHour * 60) % 60)).slice(-2);
    }
}
//開始時間、滞在時間をまとめたクラス（ここを改造する予定）
var timeStamps = [
    new TimeStamp(0, "images/pic_a.png", "Test0", 0, 30),
    new TimeStamp(1, "images/pic_b.png", "Test1", 40, 30),
    new TimeStamp(2, "images/pic_c.png", "Test2", 80, 30)
];

window.onload = resetClasses();

function resetClasses() {
    //カードクラス配列を一旦初期化
    var cardClasses = [];
    var between = (endHour - beginHour + 1);

    var table = document.getElementsByClassName("schedule_table")[0];
    table.innerHTML = "";
    table.style.height = fiveMinPerPx * 12 * between + "px";

    table.style.display = "block";
    //左にHH:MMを１時間ごとに表示
    for (var i = 0; i < (between * 2); i++) {
        var writeHTML;
        if (i % 2 == 0) {
            //30分
            writeHTML = '\
            <div class="thirty-box" style="top: ' + (fiveMinPerPx * 6 * i) + 'px;">\
            </div>\
            ';
        } else {
            //1時間
            writeHTML = '\
            <div class="hour-box" style="top: ' + (fiveMinPerPx * 6 * i) + 'px;">\
            </div>\
            ';
        }
        table.insertAdjacentHTML(
            "beforeend", writeHTML
        );
    }
    //カードの作成
    for (var i = 0; i < timeStamps.length; i++) {
        table.insertAdjacentHTML(
            "beforeend",
            '\
            <div class="schedule_card">\
            </div>\
            '
        );
    }
    //呼び出す
    var cards = document.getElementsByClassName("schedule_card");
    
    for (var i = 0; i < cards.length; i++) {
        var cardY = Math.floor((timeStamps[i].getBegin() / 5) * fiveMinPerPx);
        cardClasses[i] = new ScheduleCard(i, timeStamps[i].getPhoto(), timeStamps[i].getName(), cards[i], cardY, 0, fiveMinPerPx, beginHour, endHour);
    
        const getStaying = cardClasses[i].getCardY() + Math.floor(timeStamps[i].getStaying() / 5) * fiveMinPerPx;
        cardClasses[i].extend(getStaying);
    }
    //左にHH:MMを１時間ごとに表示
    for (var i = beginHour; i <= endHour; i++) {
        table.insertAdjacentHTML(
            "beforeend",
            '\
            <div class="timestamp">\
                ' + ("00" + i).slice(-2) + ':00\
            </div>\
            '
        );
    }

    //追加
    for (const dis of document.getElementsByClassName("addTime")) {
        dis.style.display = table.style.display;
    }
}