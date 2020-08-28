let loader = document.querySelector(".loaderbox");
let dom = document.querySelector(".wrap");
let indexBanner = document.querySelector(".swiper-wrapper");
let roomList = document.querySelector(".room_list");
const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/";
const token = "KoqHbASiNrESC9A14y7BEp1dMUyfGk8o4rtlzn0Kdp9l2iFn3w99hZext0Dj";
const roomData = [];
getData();

//Ajax
function getData(){
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //roomtypes
    if(location.pathname !== "room.html"){
        axios.get(url+"rooms")
        .then(res=>{
            loaderOut();
            console.log(res.data.items);
            roomData.push(...res.data.items);
            renderRooms();
        })
        .catch(err=>{console.log("error")})
    }
};

//loader
function loaderOut(){
    loader.style.opacity = "0";
    dom.style.opacity = "1";
};

//render rooms
function renderRooms(){
    let roomStr = "";
    let imgStr = "";
    roomData.forEach(item=>{
        imgStr += `                    
        <div class="swiper-slide" style="background-image: url(${item.imageUrl})"></div>`;
        roomStr += `
        <li>
            <a href="./room?${item.id}">
                <div class="imagebox" style="background-image: url(${item.imageUrl})"></div>
                <div class="txtbox">
                    <h2>${item.name}</h2>
                    <div class="price">
                        <div class="pricetxt"><span>NT.${item.normalDayPrice}</span> 平日</div>
                        <div class="pricetxt">NT.${item.holidayPrice} 假日</div>
                    </div>
                </div>
            </a>
        </li>`
    });
    indexBanner.innerHTML = imgStr;
    roomList.innerHTML = roomStr;
    carousel();
};

//carousel
function carousel(){
    let mySwiper = new Swiper(".swiper-container",{
        speed: 1000,
        loop: true,
        autoplay:{
            delay: 2000,
        }
    });
};
