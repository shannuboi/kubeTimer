// format
// variables  -> event handelers -> important functions -> helper functions -> function calls

//variables
let time = "";
let timesec = 0.0;

//Define vars to hold time values
let msec = 0;
let seconds = 0;
let minutes = 0;

//Define vars to hold "display" value
let displayMsec = 0;
let displaySeconds = 0;
let displayMinutes = 0;

//Define var to hold setInterval() function
let interval = null;

//Define var to hold stopwatch status
let stsp = 0;

//variable for displaying time
let show = true;

// chars for scramble
const chars = ["F ", "B ", "L ", "R ", "U ", "D ", "F' ", "B' ", "L' ", "R' ", "U' ", "D' ", "F2 ", "B2 ", "R2 ", "L2 ", "U2 ", "B2 "];


// event handelers
// spacebar
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        startStop();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 32) {
        document.getElementById("particles").style.backgroundColor = 'black';
    }
});

// backspace
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 8) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        const response = confirm("Are you sure you want to delete last solve?");
        if(response) deleteslv();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 8) {
        document.getElementById("particles").style.backgroundColor = 'rgb(50, 30, 30)';
    }
});

// delete
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 46) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        const response = confirm("Are you sure you want to clear history?");
        if(response) {
            localStorage.clear();
            loadsetup();
        }
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 46) {
        document.getElementById("particles").style.backgroundColor = 'rgb(50, 30, 50)';
    }
});

// important functions
//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {
    msec++;
    //Logic to determine when to increment next value
    if (msec / 100 === 1) {
        msec = 0;
        seconds++;

        if (seconds / 60 === 1) {
            seconds = 0;
            minutes++;
        }

    }

    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if (msec < 10) {
        displayMsec = "0" + msec.toString();
    } else {
        displayMsec = msec;
    }

    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds;
    }
    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    } else {
        displayMinutes = minutes;
    }


    //Display updated time values to user
    document.getElementById("display").innerHTML = displaySeconds + ":" + displayMsec;

}

//start and stop of time handeler
function startStop() {

    if (stsp === 0) {

        //Start the stopwatch (by calling the setInterval() function)

        interval = window.setInterval(stopWatch, 10);
        if (!show) {
            document.getElementById("con").style.display = 'none';
        }
        stsp = 1;

    } else {
        timesec = seconds + minutes * 60 + msec / 100;
        window.clearInterval(interval);
        msec = 0;
        seconds = 0;
        minutes = 0;
        document.getElementById("con").style.display = 'block';
        stsp = 0;
        savescr();
        genscramble();
    }

}

//save time after solve
function savescr() {
    // Retrieve slvlistsec from localStorage (if available)
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let btsec =  Number.MAX_VALUE; // Initialize to a large value
    let time = timesec.toFixed(2);
    slvlistsec.push(time);
    
    // Calculate bestsec
    for (let i = 0; i < slvlistsec.length; i++) {
        if (btsec > slvlistsec[i]) {
            btsec = slvlistsec[i];
        }
    }
    localStorage.setItem('btsec', JSON.stringify(btsec));

    // Update the HTML
    document.getElementById("slv1").innerHTML = "Current solve : " + time;
    document.getElementById("btslv1").innerHTML = "today's best solve : " + btsec;

    // Update localStorage with the modified slvlistsec
    localStorage.setItem('slvlistsec', JSON.stringify(slvlistsec));

    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    let btavg5 = JSON.parse(localStorage.getItem('btavg5')) || Number.MAX_VALUE; // Initialize to a large value
    let avg5 = calculateAvg5();
    if (avg5 != "N/A") {
        avg5list.push(avg5);
        for (let i = 0; i < avg5list.length; i++) {
            if (btavg5 > avg5list[i]) {
                btavg5 = avg5list[i];
            }
        }
        localStorage.setItem('btavg5', JSON.stringify(btavg5));
        document.getElementById("avg5").innerHTML = "Current avg5 :" + avg5;
        document.getElementById("btavg5").innerHTML = "today's best avg5 :" + btavg5;
        localStorage.setItem('avg5list', JSON.stringify(avg5list));
    }

    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    let btavg12 = JSON.parse(localStorage.getItem('btavg12')) || Number.MAX_VALUE; // Initialize to a large value
    let avg12 = calculateAvg12();
    if (avg12 != "N/A") {
        avg12list.push(avg12);
        for (let i = 0; i < avg12list.length; i++) {
            if (btavg12 > avg12list[i]) {
                btavg12 = avg12list[i];
            }
        }
        localStorage.setItem('btavg12', JSON.stringify(btavg12));
        document.getElementById("avg12").innerHTML = "Current avg12 :" + avg12;
        document.getElementById("btavg12").innerHTML = "today's best avg12 :" + btavg12;
        localStorage.setItem('avg12list', JSON.stringify(avg12list));
    }
    
    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    numslv++;
    let tavg = calculateAvg();
    document.getElementById("tavg").innerHTML = "total avg :" + tavg;
    localStorage.setItem('nslv', JSON.stringify(numslv));
    document.getElementById("nslv").innerHTML = "total solves :" + numslv;
}

//reprocess the dtat
function loadsetup() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let slv;
    if (slvlistsec.length === 0) slv = 0;
    else slv = slvlistsec[slvlistsec.length - 1];
    document.getElementById("slv1").innerHTML = "Current solve : " + slv;

    for (let i = slvlistsec.length - 1; i >= 0; i--) {
        if (slv > slvlistsec[i]) slv = slvlistsec[i];
    }
    
    document.getElementById("btslv1").innerHTML = "today's best solve : " + slv;
    localStorage.setItem('btslv', JSON.stringify(slv));

    
    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    if (avg5list.length === 0) slv = 0
    else slv = avg5list[avg5list.length - 1];
    document.getElementById("avg5").innerHTML = "Current avg5 :" + slv;
    for (let i = avg5list.length - 1; i >= 0; i--) {
        if (slv > avg5list[i]) slv = avg5list[i];
    }
    document.getElementById("btavg5").innerHTML = "today's best avg5 :" + slv;
    localStorage.setItem('btavg5', JSON.stringify(slv));


    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    if (avg12list.length === 0) slv = 0
    else slv = avg12list[avg12list.length - 1];
    document.getElementById("avg12").innerHTML = "Current avg12 :" + slv;
    for (let i = avg12list.length - 1; i >= 0; i--) {
        if (slv > avg12list[i]) slv = avg12list[i];
    }
    document.getElementById("btavg12").innerHTML = "today's best avg12 :" + slv;
    localStorage.setItem('btavg12', JSON.stringify(slv));

    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    let tavg = calculateAvg();
    document.getElementById("tavg").innerHTML = "total avg :" + tavg;
    document.getElementById("nslv").innerHTML = "total solves :" + numslv;
    document.getElementById("display").innerHTML = "00:00";
}

//delete last solve
function deleteslv() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    if (slvlistsec.length > 0) {
        slvlistsec.pop();
        if(avg5list.length > 0) avg5list.pop();
        if(avg12list.length > 0) avg12list.pop();
        localStorage.setItem('slvlistsec', JSON.stringify(slvlistsec));
        localStorage.setItem('avg5list', JSON.stringify(avg5list));
        localStorage.setItem('avg12list', JSON.stringify(avg12list));
        localStorage.setItem('nslv', JSON.stringify(--numslv));
        loadsetup();
    }
}


// helper functions
// scramble generator
function genscramble() {
    if (stsp === 0) {
        let text = "";
        let lastchar = "x";
        for (let i = 0; i < 24;) {
            let x;
            do {
                x = Math.floor(Math.random() * 18);
            } while (chars[x][0] === lastchar);

            text += chars[x];
            lastchar = chars[x][0];
            i++;
        }
        document.getElementById("scramble").innerHTML = text;
    }
}

// Function to calculate the average of all the solves
function calculateAvg() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length > 0) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= 0; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / slvlistsec.length).toFixed(2);
    } else {
        return "N/A";
    }
}

// Function to calculate the average of the last 5 solves
function calculateAvg5() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length >= 5) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= slvlistsec.length - 5; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / 5).toFixed(2);
    } else {
        return "N/A";
    }
}

// Function to calculate the average of the last 12 solves
function calculateAvg12() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length >= 12) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= slvlistsec.length - 12; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / 12).toFixed(2);
    } else {
        return "N/A";
    }
}

// function calls
loadsetup();
