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
let pickerInput = "";
const bookingData = {
    name: "",
    tel: "",
    date: []
}
getData();

//Ajax Get
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
//Ajax Post
function postData(data){
    const roomID = location.search.slice(1);
    localStorage.setItem('data', JSON.stringify(data));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.post(`${url}room/${roomID}`, data)
    .then(res =>console.log(res))
    .catch(err => console.log(err))
    console.log(`${url}room/${roomID}`, data)
}

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

//reserve rooms frame
function reserve() {
    window.scrollTo(0, 356);
    document.querySelector("body").classList.add("active");
    document.querySelector(".booking_view").classList.add("active");
    document.querySelector(".booking_info").classList.add("active");
    render(dateData);
}

//cancel reserve frame
function cancel() {
    document.querySelector("body").classList.remove("active");
    document.querySelector(".booking_view").classList.remove("active");
    document.querySelector(".booking_info").classList.remove("active");
    document.querySelector(".datepicker_sm").classList.remove("active");
    document.querySelector(".datepicker_sm").innerHTML = "";
    // document.querySelectorAll(".picker").forEach(item=>{
    //     item.classList.remove("picker_between");
    //     item.classList.remove("picker_item")
    // })
    // pickerboxs = [];

}

//display small calendar
function displayCalendar(e) {
    document.querySelector(".datepicker_sm").classList.add("active");
    pickerInput = this;
    console.log(pickerInput)

}
//close small calendar
function closeCalendar(e) {
    if (e.target.classList[1] == "picker" || e.target.classList[0] == "booking_view") {
        document.querySelector(".datepicker_sm").classList.remove("active");
    }
}

//check input content
function check() {
    let input = document.querySelectorAll("input");
    input.forEach(item => {
        if (item.value !== "") {
            item.classList.remove("form_err");
        }
    })
}
//submit data
function submit() {
    let verification = document.querySelectorAll("input")
    verification.forEach(item => {
        if (item.value == "") {
            item.classList.add("form_err");
        } else {
            bookingData.name = verification[0].value;
            bookingData.tel = verification[1].value;
        }
    });

    //post data to server
    if (bookingData.name !== "" && bookingData.tel !== "") {
        if (bookingData.date.length > 1) {
            postData(bookingData);
        }
    }
}

//addEventListener
document.querySelector(".reserve").addEventListener("click", reserve);
document.querySelector(".reserve").addEventListener("click", putIn);
document.querySelector(".reserve").addEventListener("click", inputDisplay);
document.querySelector("#date-in").addEventListener("focus", displayCalendar);
document.querySelector("#date-out").addEventListener("focus", displayCalendar);
window.addEventListener("click", closeCalendar);
document.querySelector(".submit").addEventListener("click", submit);
document.querySelectorAll("input").forEach(item => { item.addEventListener("blur", check) })
