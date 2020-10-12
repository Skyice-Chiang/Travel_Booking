const dateRender = document.querySelector("#calendar_lg");
const today = new Date();
const setDate = new Date(today.getFullYear(), today.getMonth(), 1);
const yy = today.getFullYear();
const mm = today.getMonth() + 1;
const dd = today.getDate();
let pickerboxs = [];
let pickerData = {};
let judgeDayData = [];
let dateStart = "";
let dateEnd = "";
const dateData = caculatorDate(setDate);
render(dateData);
displayRange();

//caculator calendar data
function caculatorDate(setDate, month) {
    let dateObject = {
        yy: setDate.getFullYear(),
        mm: month || setDate.getMonth() + 1,
        totalDays: getTotalDay(setDate, setDate.getMonth() + 1)
    };
    return dateObject
};

//render calendar
function render(dateData) {
    let calendar = `	
	<div class="datehead">
		<a href="#" class="prev"><i class="fas fa-chevron-left"></i></a>
		<p>${dateData.yy} / ${dateData.mm}</p>
		<a href="#" class="next"><i class="fas fa-chevron-right"></i></a>
	</div>
	<div class="datebody">
		<div class="datebox">
			<div class="dateitem">Sun</div>
			<div class="dateitem">Mon</div>
			<div class="dateitem">Tue</div>
			<div class="dateitem">Wed</div>
			<div class="dateitem">Thu</div>
			<div class="dateitem">Fri</div>
			<div class="dateitem">Sat</div>
		</div>
		${weekdaysStr(dateData.totalDays)}
	</div>`;
    dateRender.innerHTML = calendar;
    displayRange();
    pickerRender();

    //reserve small datepicker
    if (document.querySelector(".booking_view").classList[1] == "active") {
        document.querySelector(".datepicker_sm").innerHTML = calendar;
        displayRange();
    }
};

//get month total days
function getTotalDay(date, month) {
    const dt = date.getDay();
    const mm = month;
    let days = [];
    let td1 = [1, 3, 5, 7, 8, 10, 12];
    let td2 = [4, 6, 9, 11];

    if (td1.indexOf(mm) !== -1) {
        for (let i = 1; i < 32; i++) {
            days.push(i);
        };
    } else if (td2.indexOf(mm) !== -1) {
        for (let i = 1; i < 31; i++) {
            days.push(i);
        };
    } else if (mm === 2) {
        if (yy % 4 == 0) {
            for (let i = 1; i < 30; i++) {
                days.push(i);
            };
        } else {
            for (let i = 1; i < 29; i++) {
                days.push(i);
            };
        }
    };

    //caculate space
    for (let i = 0; i < dt; i++) {
        days.unshift("");
    }
    return days;
};

//date dom
function weekdaysStr(totalDay) {
    let allStr = "";
    let str1 = "";
    let str2 = "";
    let str3 = "";
    let str4 = "";
    let str5 = "";
    let str6 = "";
    totalDay.forEach((item, index) => {
        if (index < 7) {
            str1 += `<div class="dateitem picker">${item}</div>`;
        } else if (index > 6 && index < 14) {
            str2 += `<div class="dateitem picker">${item}</div>`;
        } else if (index > 13 && index < 21) {
            str3 += `<div class="dateitem picker">${item}</div>`;
        } else if (index > 20 && index < 28) {
            str4 += `<div class="dateitem picker">${item}</div>`;
        } else if (index > 27 && index < 35) {
            str5 += `<div class="dateitem picker">${item}</div>`;
        } else if (index > 34 && index < 42) {
            str6 += `<div class="dateitem picker">${item}</div>`;
        }
    });
    allStr = `
		<div class="datebox">${str1}</div>
		<div class="datebox">${str2}</div>
		<div class="datebox">${str3}</div>
		<div class="datebox">${str4}</div>
		<div class="datebox">${str5}</div>
		<div class="datebox">${str6}</div>`;
    return allStr;
};

//change month
function changeMonth(e) {
    e.preventDefault();
    let nowYy = parseInt(document.querySelector(".datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datehead p").textContent.split("/")[1]);
    let caculatorLimit = dayLimit();
    let dateData;

    //next month
    if (e.target.className === "fas fa-chevron-right" || e.target.className === "next") {
        if (nowMm < mm + 3 && nowMm !== caculatorLimit.ml) {
            nowMm += 1;
            if (nowMm < 13 && nowYy == yy) {
                let date = new Date(nowYy, nowMm - 1, 1);
                dateData = caculatorDate(date, nowMm);
                render(dateData);
            } else if (nowMm === 13 || nowYy > yy) {
                //jump to next year
                let date;
                if (nowMm == 13) {
                    date = new Date(nowYy + 1, 0, 1);
                } else { date = new Date(nowYy, nowMm - 1, 1); }
                let newMm = date.getMonth() + 1;
                dateData = caculatorDate(date, newMm);
                render(dateData);
            }
        }
        //last month
    } else if (e.target.className === "fas fa-chevron-left" || e.target.className === "prev") {
        if (nowMm > mm) {
            nowMm -= 1;
            let date = new Date(nowYy, nowMm - 1, 1);
            dateData = caculatorDate(date, nowMm);
            render(dateData);
        } else if (nowYy > yy) {
            //location : next year
            let date;
            if (nowMm == 1) {
                //jump to last year
                date = new Date(nowYy - 1, 11, 1);
            } else if (nowMm > 1) {
                nowMm -= 1;
                date = new Date(nowYy, nowMm - 1, 1);
            }
            let newMm = date.getMonth() + 1;
            dateData = caculatorDate(date, newMm);
            render(dateData);
        }
    }

    if (document.querySelector(".datepicker_sm").classList[2] !== "active") {
        pickerRender();
    }
};

//date display : display chosen range
function displayRange() {
    let nowYy = parseInt(document.querySelector(".datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datehead p").textContent.split("/")[1]);
    let pick = document.querySelectorAll(".picker");
    let caculatorLimit = dayLimit();

    pick.forEach((item) => {
        //no content
        if (item.textContent == "") {
            item.classList.add("no-choose");
            item.classList.remove("picker");
        }
        //marker today 
        if (item.textContent == dd && nowMm == mm) {
            if (nowYy == yy) {
                item.classList.add("today");
            }
            //past days	
        } else if (item.textContent < dd && nowMm == mm) {
            if (nowYy == yy) {
                item.classList.add("no-choose");
                item.classList.remove("picker");
            }
            //date after 90 days can't choose	
        } else if (nowYy == caculatorLimit.yl && nowMm >= caculatorLimit.ml) {
            if (item.textContent > caculatorLimit.dl) {
                item.classList.add("no-choose");
                item.classList.remove("picker");
                //jump to next year	
            } else if (nowYy > yy && nowMm > caculatorLimit.ml) {
                item.classList.add("no-choose");
                item.classList.remove("picker");
            }
        }
    });
};

//put picker days' data 
function putPickerData(e) {
    let nowYy = parseInt(document.querySelector(".datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datehead p").textContent.split("/")[1]);
    let picker = e.target.textContent;
    e.preventDefault();
    //picker date 
    if (e.target.className == "dateitem picker") {
        pickerData = {
            yy: nowYy,
            mm: nowMm,
            dd: parseInt(picker),
        };
        if (pickerboxs.length < 2) {
            pickerboxs.push(pickerData);
        } else if (pickerboxs.length == 2) {
            pickerboxs = [];
            pickerboxs.push(pickerData);
        }
    } else if (e.target.className == "dateitem picker picker_between" || e.target.className == "dateitem picker today") {
        pickerData = {
            yy: nowYy,
            mm: nowMm,
            dd: parseInt(picker),
        };
        if (pickerboxs.length < 2) {
            pickerboxs.push(pickerData);
        } else if (pickerboxs.length == 2) {
            pickerboxs = [];
            pickerboxs.push(pickerData);
        }
    }
    pickerRender();
}

//render picker days
function pickerRender() {
    let currentYy = document.querySelector(".datehead p").textContent.split("/")[0];
    let currentMm = document.querySelector(".datehead p").textContent.split("/")[1];
    let allPicker = document.querySelectorAll(".picker");
    let dateRange = daysBetween() - 1;

    //picker start/end
    if (pickerboxs.length > 0 && pickerboxs.length < 2) {
        allPicker.forEach(item => {
            item.classList.remove("picker_item");
            item.classList.remove("picker_between");
            if (item.textContent == pickerboxs[0].dd) {
                if (pickerboxs[0].yy == currentYy && pickerboxs[0].mm == currentMm) {
                    item.classList.add("picker_item");
                }
            }
        });
    } else if (pickerboxs.length == 2) {
        allPicker.forEach((item, index) => {
            item.classList.remove("picker_item");
            if (item.textContent == pickerboxs[0].dd) {
                if (pickerboxs[0].yy == currentYy && pickerboxs[0].mm == currentMm) {
                    item.classList.add("picker_item");
                    //same year
                    if (pickerboxs[0].yy == pickerboxs[1].yy) {
                        console.log(index);
                        if (pickerboxs[0].mm < pickerboxs[1].mm && pickerboxs[0].dd == parseInt(item.textContent)) {
                            dateStart = index + 1;
                        } else if (pickerboxs[0].mm > pickerboxs[1].mm && pickerboxs[0].dd == parseInt(item.textContent)) {
                            dateEnd = index;
                        } else if (pickerboxs[0].dd < pickerboxs[1].dd) {
                            dateStart = index + 1;
                        } else if (pickerboxs[0].dd > pickerboxs[1].dd) {
                            dateEnd = index;
                        }
                        //different year
                    } else if (pickerboxs[0].yy !== pickerboxs[1].yy) {
                        if (pickerboxs[0].mm > pickerboxs[1].mm) {
                            dateStart = index + 1;
                        } else if (pickerboxs[0].mm < pickerboxs[1].mm) {
                            dateEnd = index;
                        }
                    }
                }
            } else if (item.textContent == pickerboxs[1].dd) {
                if (pickerboxs[1].yy == currentYy && pickerboxs[1].mm == currentMm) {
                    item.classList.add("picker_item");
                    //same year
                    if (pickerboxs[0].yy == pickerboxs[1].yy) {
                        if (pickerboxs[0].mm < pickerboxs[1].mm && pickerboxs[1].dd == parseInt(item.textContent)) {
                            dateEnd = index;
                        } else if (pickerboxs[0].mm > pickerboxs[1].mm && pickerboxs[1].dd == parseInt(item.textContent)) {
                            dateStart = index + 1;
                        } else if (pickerboxs[0].dd < pickerboxs[1].dd) {
                            dateEnd = index;
                        } else if (pickerboxs[0].dd > pickerboxs[1].dd) {
                            dateStart = index + 1;
                        }
                        //different year
                    } else if (pickerboxs[0].yy !== pickerboxs[1].yy) {
                        if (pickerboxs[0].mm > pickerboxs[1].mm) {
                            dateEnd = index;
                        } else if (pickerboxs[0].mm < pickerboxs[1].mm) {
                            dateStart = index + 1;
                        }
                    }
                }
            }
        });
    };
    console.log("START:" + dateStart, dateRange, "END:" + dateEnd);

    //picker between 
    if (pickerboxs.length == 2) {
        //same year
        if (pickerboxs[0].yy == pickerboxs[1].yy) {
            if (pickerboxs[0].mm == pickerboxs[1].mm) {
                if (currentMm == pickerboxs[0].mm || currentMm == pickerboxs[1].mm) {
                    for (let i = dateStart; i < dateEnd; i++) {
                        allPicker[i].classList.add("picker_between");
                    }
                }
            } else if (pickerboxs[0].mm !== pickerboxs[1].mm) {
                if (currentMm == pickerboxs[0].mm) {
                    if (pickerboxs[0].mm < pickerboxs[1].mm) {
                        for (let i = dateStart; i < allPicker.length; i++) {
                            allPicker[i].classList.add("picker_between");
                        }
                    } else if (pickerboxs[0].mm > pickerboxs[1].mm) {
                        for (let i = 0; i < dateEnd; i++) {
                            allPicker[i].classList.add("picker_between");
                        }
                    }
                } else if (currentMm == pickerboxs[1].mm) {
                    if (pickerboxs[0].mm < pickerboxs[1].mm) {
                        for (let i = 0; i < dateEnd; i++) {
                            allPicker[i].classList.add("picker_between");
                        }
                    } else if (pickerboxs[0].mm > pickerboxs[1].mm) {
                        for (let i = dateStart; i < allPicker.length; i++) {
                            allPicker[i].classList.add("picker_between");
                        }
                    }
                }
            }
            //more than 1 month
            if (((pickerboxs[0].mm) - (pickerboxs[1].mm)) > 1 || ((pickerboxs[1].mm) - (pickerboxs[0].mm)) > 1) {
                if (currentMm > pickerboxs[0].mm && currentMm < pickerboxs[1].mm) {
                    allPicker.forEach(item => { item.classList.add("picker_between") })
                } else if (currentMm > pickerboxs[1].mm && currentMm < pickerboxs[0].mm) {
                    allPicker.forEach(item => { item.classList.add("picker_between") })
                }
            }
            //different year
        } else if (pickerboxs[0].yy !== pickerboxs[1].yy) {
            if (currentMm == pickerboxs[0].mm) {
                if (pickerboxs[0].mm > pickerboxs[1].mm) {
                    for (let i = dateStart; i < allPicker.length; i++) {
                        allPicker[i].classList.add("picker_between");
                    }
                } else if (pickerboxs[0].mm < pickerboxs[1].mm) {
                    for (let i = 0; i < dateEnd; i++) {
                        allPicker[i].classList.add("picker_between");
                    }
                }
            } else if (currentMm == pickerboxs[1].mm) {
                if (pickerboxs[0].mm > pickerboxs[1].mm) {
                    for (let i = 0; i < dateEnd; i++) {
                        allPicker[i].classList.add("picker_between");
                    }
                } else if (pickerboxs[0].mm < pickerboxs[1].mm) {
                    for (let i = dateStart; i < allPicker.length; i++) {
                        allPicker[i].classList.add("picker_between");
                    }
                }
            }
            //more than 1 month
            if (currentMm > pickerboxs[0].mm && currentMm > pickerboxs[1].mm) {
                allPicker.forEach(item => { item.classList.add("picker_between") })
            } else if (currentMm > pickerboxs[1].mm && currentMm > pickerboxs[0].mm) {
                allPicker.forEach(item => { item.classList.add("picker_between") })
            }
        }
    }
};

//caculator date : find out the day after 90 days
function dayLimit() {
    //Find date after 90 days 
    const range = new Date(yy, mm - 1, dd + 90);
    const dayObject = {
        yl: range.getFullYear(),
        ml: range.getMonth() + 1,
        dl: range.getDate(),
    };
    return dayObject
};

//how many days
function daysBetween() {
    let days = "";
    if (pickerboxs.length == 2) {
        pickerboxs.sort((a, b) => { return (new Date(a.yy, a.mm - 1, a.dd)) - (new Date(b.yy, b.mm - 1, b.dd)) });
        let chosenOne = new Date(pickerboxs[0].yy, (pickerboxs[0].mm) - 1, pickerboxs[0].dd);
        let chosenTwo = new Date(pickerboxs[1].yy, (pickerboxs[1].mm) - 1, pickerboxs[1].dd);
        days = (chosenTwo - chosenOne) / (1000 * 60 * 60 * 24);
    }
    return days
}

//put date data to bookingData  ex: ["2020-10-10",]
function putIn() {
    bookingData.date = [];
    judgeDayData = [];
    let dayTotal = daysBetween();
    if (pickerboxs.length == 2) {
        pickerboxs.sort((a, b) => { return (new Date(a.yy, a.mm - 1, a.dd)) - (new Date(b.yy, b.mm - 1, b.dd)) });
        for (let i = pickerboxs[0].dd; i < pickerboxs[0].dd + dayTotal + 1; i++) {
            let dateStart = new Date(pickerboxs[0].yy, (pickerboxs[0].mm) - 1, i);
            let dateStr = "";
            if (dateStart.getMonth() < 10 && dateStart.getDate() < 10){
                dateStr = `${dateStart.getFullYear()}-0${((dateStart.getMonth()) + 1)}-0${dateStart.getDate()}`
            } else if (dateStart.getMonth() > 10 && dateStart.getDate() < 10) {
                dateStr = `${dateStart.getFullYear()}-${(dateStart.getMonth()) + 1}-0${dateStart.getDate()}`;
            } else if (dateStart.getMonth() < 10 && dateStart.getDate() >= 10) {
                dateStr = `${dateStart.getFullYear()}-0${((dateStart.getMonth()) + 1)}-${dateStart.getDate()}`;
            } else if (dateStart.getMonth() > 10 && dateStart.getDate() >= 10){
                dateStr = `${dateStart.getFullYear()}-${(dateStart.getMonth()) + 1}-${dateStart.getDate()}`;
            }
            bookingData.date.push(dateStr);
            judgeDayData.push(dateStart.getDay());
        }
        console.log(bookingData.date, judgeDayData);
    }
    judgeDate();
}

//input display booking-date
function inputDisplay() {
    pickerboxs.sort((a, b) => { return (new Date(a.yy, a.mm - 1, a.dd)) - (new Date(b.yy, b.mm - 1, b.dd)) });
    if (pickerboxs.length == 2) {
        document.querySelector("#date-in").value = `${pickerboxs[0].yy}/${pickerboxs[0].mm}/${pickerboxs[0].dd}`;
        document.querySelector("#date-out").value = `${pickerboxs[1].yy}/${pickerboxs[1].mm}/${pickerboxs[1].dd}`;
    }
}

//reverse view picker date
function reversePicker(e) {
    let nowYy = parseInt(document.querySelector(".datepicker_sm .datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datepicker_sm .datehead p").textContent.split("/")[1]);
    if (e.target.classList[1] == "picker") {
        let pickerDate = `${nowYy}/${nowMm}/${e.target.textContent}`;
        if (pickerInput.name == "date-in"){
            pickerboxs[0] = {
                yy: nowYy,
                mm: nowMm,
                dd: parseInt(e.target.textContent),
            };
            pickerInput.value = pickerDate;
            if(pickerboxs.length == 2){
                let chosenOne = new Date(pickerboxs[0].yy, (pickerboxs[0].mm) - 1, pickerboxs[0].dd);
                let chosenTwo = new Date(pickerboxs[1].yy, (pickerboxs[1].mm) - 1, pickerboxs[1].dd);
                if (chosenOne > chosenTwo) {
                    pickerboxs[1] = "";
                    document.querySelector("#date-out").value = "";
                }
            }
        } else if (pickerInput.name == "date-out" && pickerboxs.length >= 1){
            pickerboxs[1] = {
                yy: nowYy,
                mm: nowMm,
                dd: parseInt(e.target.textContent),
            };
            let chosenOne = new Date(pickerboxs[0].yy, (pickerboxs[0].mm) - 1, pickerboxs[0].dd);
            let chosenTwo = new Date(pickerboxs[1].yy, (pickerboxs[1].mm) - 1, pickerboxs[1].dd);
            if(chosenTwo > chosenOne){
                pickerInput.value = pickerDate;
                document.querySelector(".warning").classList.remove("active");
                pickerInput.classList.remove("form_err");
            } else if (chosenTwo < chosenOne){
                document.querySelector("#date-out").value = "";
                document.querySelector(".warning").classList.add("active");
                pickerInput.classList.add("form_err");
            }
        }        
    }
    putIn();
}

//judge normalday or holiday
function judgeDate(){
    //night number
    judgeDayData.pop();
    let normalDay = 0;
    let holiday = 0;
    judgeDayData.forEach(item=>{
        if(item > 4 && item <= 6){
            holiday++
        }else if(item >= 0 && item < 5){
            normalDay++
        }
    })
    console.log(normalDay, holiday);
    renderCost(normalDay, holiday);
}
//render cost 
function renderCost(normalDay, holiday){
    let normalCost = parseInt((document.querySelectorAll(".room_price span")[0].textContent).split(".")[1]);
    let holidayCost = parseInt((document.querySelectorAll(".room_price span")[1].textContent).split(".")[1]);
    let total = normalCost * normalDay + holidayCost * holiday;
    document.querySelector(".normal_days").textContent = `${normalDay} 夜`;
    document.querySelector(".holiday_days").textContent = `${holiday} 夜`;
    document.querySelector(".costing span").textContent = total;
    console.log(normalCost, holidayCost, total);
    
}


//addEventListener
dateRender.addEventListener("click", changeMonth);
dateRender.addEventListener("click", putPickerData);
document.querySelector(".datepicker_sm").addEventListener("click", changeMonth);
document.querySelector(".datepicker_sm").addEventListener("click", reversePicker);