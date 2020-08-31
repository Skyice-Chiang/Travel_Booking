let loader = document.querySelector(".loaderbox");
let dom = document.querySelector(".wrap");
let indexBanner = document.querySelector(".swiper-wrapper");
let roomList = document.querySelector(".room_list");
const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/";
const token = "KoqHbASiNrESC9A14y7BEp1dMUyfGk8o4rtlzn0Kdp9l2iFn3w99hZext0Dj";
const roomData = [];
const singleRoom = [];
getData();

//Ajax
function getData() {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //roomtypes
    if (location.pathname.slice(1) !== "room.html") {
        axios.get(url + "rooms")
            .then(res => {
                loaderOut();
                console.log(res.data.items);
                roomData.push(...res.data.items);
                renderRooms();
            })
            .catch(err => { console.log("error") })
    } else if (location.pathname.slice(1) === "room.html") {
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
function renderSingleRoom(){
    console.log(singleRoom);
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
