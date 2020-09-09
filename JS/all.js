const loader = document.querySelector(".loaderbox");
const dom = document.querySelector(".wrap");
const indexBanner = document.querySelector(".swiper-wrapper");
const roomList = document.querySelector(".room_list");
const imgL = document.querySelector(".image_left");
const imgR = document.querySelector(".image_right");
const roomInfo = document.querySelector(".room_info");
const roomPrice = document.querySelector(".room_price");
const offer = document.querySelectorAll(".offer p");
const calendar = document.querySelector(".calendar");
const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/";
const token = "KoqHbASiNrESC9A14y7BEp1dMUyfGk8o4rtlzn0Kdp9l2iFn3w99hZext0Dj";
const roomData = [];
const singleRoom = [];
getData();

//Ajax
function getData() {
    let netJudge = location.pathname.split("/");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //roomtypes
    if (netJudge[netJudge.length - 1] !== "room.html") {
        axios.get(url + "rooms")
            .then(res => {
                loaderOut();
                console.log(res.data.items);
                roomData.push(...res.data.items);
                renderRooms();
            })
            .catch(err => { console.log("error") })
    } else if (netJudge[netJudge.length - 1] === "room.html") {
        //single room
        const roomID = location.search.slice(1);
        axios.get(`${url}room/${roomID}`)
            .then(res => {
                loaderOut();
                singleRoom.push(...res.data.room);
                renderSingleRoom();
            })
            .catch(err => { console.log(err) })
    }
};

//loader
function loaderOut() {
    loader.style.opacity = "0";
    dom.style.opacity = "1";
};

//render rooms
function renderRooms() {
    let roomStr = "";
    let imgStr = "";
    roomData.forEach(item => {
        imgStr += `                    
        <div class="swiper-slide" style="background-image: url(${item.imageUrl})"></div>`;
        roomStr += `
        <li>
            <a href="./room.html?${item.id}">
                <div class="imagebox" style="background-image: url(${item.imageUrl})"></div>
                <div class="txtbox active">
                    <h2>${item.name}</h2>
                    <div class="price">
                        <p><span>NT.${item.normalDayPrice}</span> 平日</p>
                        <p class="pricetxt">NT.${item.holidayPrice} 假日</p>
                    </div>
                </div>
            </a>
        </li>`
    });
    indexBanner.innerHTML = imgStr;
    roomList.innerHTML = roomStr;
    carousel();
};

//render single room
function renderSingleRoom() {
    console.log(singleRoom);
    let imgStrL = "";
    let imgStrR = "";
    let infoStr = "";
    let priceStr = "";
    singleRoom.forEach(item => {
        imgStrL += `<a href="${item.imageUrl[0]}" data-lightbox="room_image" data-title="${item.name}" style="background-image: url(${item.imageUrl[0]})"></a>`;
        imgStrR +=
            `<div class="image_small">
                <a href="${item.imageUrl[1]}" data-lightbox="room_image" data-title="${item.name}" style="background-image: url(${item.imageUrl[1]})"></a>
            </div>
            <div class="image_small">
                <a href="${item.imageUrl[2]}" data-lightbox="room_image" data-title="${item.name}" style="background-image: url(${item.imageUrl[2]})"></a>
            </div>`;
        infoStr += `
            <h2>${item.name}</h2>
            <ul>
                <li><p>Guest Limit: ${item.descriptionShort.GuestMin} ~ ${item.descriptionShort.GuestMax}</p></li>
                <li><p>Bed Type: ${item.descriptionShort.Bed[0]}</p></li>
                <li><p>Bath Amount: ${item.descriptionShort["Private-Bath"]}</p></li>
                <li><p>Room Size: ${item.descriptionShort.Footage}</p></li>
            </ul>
            <p class="align">${item.description}</p>
            <br/>
            <p>＼＼＼</p>
            <br/>
            <div class="check_in_out">
                <p>Check In <br><span>${item.checkInAndOut.checkInEarly} － ${item.checkInAndOut.checkInLate}</span></p>
                <p>Check Out <br><span>${item.checkInAndOut.checkOut}</span></p>
            </div>`;
        priceStr += `                   
            <p><span class="normal_price">NT.${item.normalDayPrice}</span><br/>Normal Day<br/>(Monday~Thursday)</p>
            <p><span>NT.${item.holidayPrice}</span> <br/>Holiday<br/>(Friday~Sunday)</p>`;
    });
    imgL.innerHTML = imgStrL;
    imgR.innerHTML = imgStrR;
    roomInfo.innerHTML = infoStr;
    roomPrice.innerHTML = priceStr;
    lightboxOption();
    offerJudge();
    renderCalendar();
};

//offer service
function offerJudge() {
    let key = singleRoom[0].amenities;
    offer.forEach((item, index) => {
        if (key[item.textContent] === true) {
            document.querySelectorAll(".offer")[index].classList.add("active");
        } else {
            document.querySelectorAll(".offer")[index].classList.remove("active");
        }
    });
};

//render calendar
function renderCalendar() {
    const date = new Date();
    const yy = date.getFullYear();
    const mm = date.getMonth();
    const dt = date.getDate();
    const dy = date.getDay();
    const firstDay = new Date(yy, mm, 1).getDay(); //check firstday's weekdays
    let days = judgeDays(date);
}
//judge month's days
function judgeDays(date) {
    const nowMonth = date.getMonth() + 1;
    console.log(date.getDay());
    const preMonth = nowMonth - 1 || 12;
    const nextMonth = ((nowMonth) => { if (nowMonth === 12) { return 1 } else { return nowMonth + 1 } })(nowMonth);
    const daysfactor1 = [1, 3, 5, 7, 8, 10, 12];
    const daysfactor2 = [4, 6, 9, 11];
    const dateData = {
        nowMonth: pushDays(nowMonth),
        preMonth: pushDays(preMonth),
        nextMonth: pushDays(nextMonth),
    };

    //judge days amount
    function pushDays(month) {
        let days = [];
        if (daysfactor1.indexOf(month) !== -1) {
            for (let i = 1; i < 32; i++) {
                days.push(i);
            };
        } else if (daysfactor2.indexOf(month) !== -1) {
            for (let i = 1; i < 31; i++) {
                days.push(i);
            };
        } else {
            //judge leap year , remainder === 0
            if (date.getFullYear() % 4 === 0) {
                for (let i = 1; i < 30; i++) {
                    days.push(i);
                };
            } else {
                for (let i = 1; i < 29; i++) {
                    days.push(i);
                };
            }
        }
        return days;
    };
    return dateData;
}



//carousel
function carousel() {
    let mySwiper = new Swiper(".swiper-container", {
        speed: 1000,
        loop: true,
        autoplay: {
            delay: 2000,
        }
    });
};

//lightbox
function lightboxOption() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        "imageFadeDuration": 600,
        "fadeDuration": 600,
    })
}