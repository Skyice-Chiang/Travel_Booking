const dateRender = document.querySelector(".datepicker");
const today = new Date();
const setDate = new Date(today.getFullYear(), today.getMonth(), 1);
const yy = today.getFullYear();
const mm = today.getMonth() + 1;
const dd = today.getDate();
let pickerSE = [];
let pickerData = {};
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
    console.log(e.target)
    let nowYy = parseInt(document.querySelector(".datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datehead p").textContent.split("/")[1]);
    let picker = e.target.textContent;
    let caculatorLimit = dayLimit();
    let dateData;

    //next month
    if (e.target.className === "fas fa-chevron-right" || e.target.className === "next") {
        if (nowMm < mm + 3) {
            nowMm += 1;
            if (nowMm < 13 && nowYy == yy) {
                let date = new Date(nowYy, nowMm - 1, 1);
                dateData = caculatorDate(date, nowMm);
                render(dateData);
            } else if (nowMm > 12 || nowYy > yy) {
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
    displayRange();

    //picker date 
    if (picker >= dd && nowMm == mm) {
        pickerData = {
            yy: nowYy,
            mm: nowMm,
            dd: e.target.textContent,
            dom: e.target
        };
        if (pickerSE.length < 2) {
            pickerSE.push(pickerData);
        } else if (pickerSE.length > 1) {
            pickerSE = [];
            pickerSE.push(pickerData);
        }
    } else if (nowMm <= caculatorLimit.ml && e.target.className == "dateitem picker") {
        pickerData = {
            yy: nowYy,
            mm: nowMm,
            dd: e.target.textContent,
            dom: e.target
        };
        if (pickerSE.length < 2) {
            pickerSE.push(pickerData);
        } else if (pickerSE.length > 1) {
            pickerSE = [];
            pickerSE.push(pickerData);
        }
    };
    pickerRender();
};

//date display : choose range
function displayRange() {
    let nowYy = parseInt(document.querySelector(".datehead p").textContent.split("/")[0]);
    let nowMm = parseInt(document.querySelector(".datehead p").textContent.split("/")[1]);
    let pick = document.querySelectorAll(".picker");
    let caculatorLimit = dayLimit();

    pick.forEach((item, index) => {
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
            }
            //jump to next year	
        } else if (nowYy > caculatorLimit.yl) {
            item.classList.add("no-choose");
            item.classList.remove("picker");
        }
    });
};

//picker days
function pickerRender() {
    let allPicker = document.querySelectorAll(".picker");
    pickerSE.forEach((item, index) => {
        allPicker.forEach(item => {
            item.classList.remove("picker_item");
        });
        pickerSE[0].dom.classList.add("picker_item");
        if (pickerSE.length > 1) {
            pickerSE[1].dom.classList.add("picker_item");
        }
    });
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


//addEventListener
dateRender.addEventListener("click", changeMonth);