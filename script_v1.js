
var num_bookings = Array(31).fill(0);

const month_days = [31,28,31,30,31,30,31,31,30,31,30,31];

update_table();

// add an event listener to each cell
// in order to pass parameters need to use an anonymous function that calls my function with the parameters
for (let cell = 0; cell <= 34; cell++) {
    let idstr = "c" + cell.toString(); 
    document.getElementById(idstr).addEventListener("mouseover", function() { mouseoverCell(cell); });
    document.getElementById(idstr).addEventListener("click", function() { clickCell(cell); });
  }
//------------------------------------------------------------------------------------------------- 
 // on click get the date from the cell and update form
  
 function clickCell(num) {
    const table = document.getElementById("BookingTable");
  
    let row = Math.floor(num / 7) + 1;
    let cell = num % 7;
  
    date = table.rows[row].cells[cell].textContent;

    if(date == ".")
        return;

    const nd = new Date();                  // get the current date
    cur_year = nd.getFullYear(); 
    cur_month = nd.getMonth();
    cur_date = nd.getDate();

    cur_month++;                            // because January is zero

    if(date < cur_date)                     // date is in next month
        cur_month++;
    if(cur_month > 12)
        cur_month = 1;

    datestr = cur_year + "-";                // format to yyyy-mm-dd
    if(cur_month < 10)
        datestr += "0";
    datestr += cur_month;
    datestr += "-";
    if(date < 10)
        datestr +="0";
    datestr += date;
  
    const formDate = document.getElementById('date');
    formDate.value = datestr;

    document.getElementById("confirmation").innerHTML = "Confirmation of your booking will appear here"

    //document.getElementById("line2").innerHTML = "Date = " + datestr;
 }

 //------------------------------------------------------------------------------------------------- 
 // on mouseover get the date from the cell and update according to number of bookings
  
  function mouseoverCell(num) {
    const table = document.getElementById("BookingTable");
  
    let row = Math.floor(num / 7) + 1;
    let cell = num % 7;
    
    //document.getElementById("line2").innerHTML = "This is cell " + num +" at "+ row +"," + cell;
  
    date = table.rows[row].cells[cell].textContent;

    if(date == ".") 
        return;

    let datestr="";

    if((date == 1) || (date == 21)) 
        datestr = date+"st";
    else if((date == 2) || (date == 22))
        datestr = date+"nd";
    else if((date == 3) || (date == 23))
        datestr = date+"rd";
    else 
        datestr = date+"th";


    if(!num_bookings[date])
        bkstr = "On the " + datestr + " we have no bookings";

    else if(num_bookings[date] < 5) {
        bkstr = "On the " + datestr + " we have " + num_bookings[date] + " booking";
        if(num_bookings[date] != 1)
            bkstr += "s";
        }

    else if(num_bookings[date] == 5)
        bkstr = "On the " + datestr + " we are fully booked";
    
    document.getElementById("line1").innerHTML = bkstr;
    
  }

//----------------------------------------------------------------------------------

function update_table() {

    // Get the table element
    const table = document.getElementById('BookingTable');

    const d = new Date();        // get the current date
    let cdate = d.getDate();
    let start_cell = (d.getDay() + 6) % 7;  // because Sunday is 0 and the date table starts with Monday

    let days_in_month = month_days[ d.getMonth() ];     
    let num = 0;

    // fill the cells with one month of dates
    for (let r = 1; r < 6; r++) { 
        for (let c = 0; c < 7; c++) {
            if((!start_cell) && (num <= days_in_month)) {
                table.rows[r].cells[c].textContent = cdate;

                if(num_bookings[cdate] == 0)
                    table.rows[r].cells[c].style.backgroundColor = "lightgrey";

                if(num_bookings[cdate] > 0)
                    table.rows[r].cells[c].style.backgroundColor = "white";

                if(num_bookings[cdate] == 5)
                    table.rows[r].cells[c].style.backgroundColor = "yellow";

            cdate++;
            }
        else
            table.rows[r].cells[c].textContent = ".";

        if(start_cell)
            start_cell--;
    
        if( cdate > days_in_month )
            cdate = 1;

        num++;
        }
    }
}

//----------------------------------------------------------------------------------

function displayMessage(event) {
    event.preventDefault();     // Prevent the form from submitting
      
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const places = document.getElementById('places').value;
      
    const d = new Date(date);               // Create a Date object
    year = d.getFullYear(); 
    month = d.getMonth();              
    ndate = d.getDate();
    nmonth = month + 1;                             // months start with zero for January
    const f_date = ndate+"/"+nmonth+"/"+year;      // dd/mm/yyyy format

    output = "Your table is booked for " + f_date + " at " + time + "pm for " + places;
    if(places == 1)
        output = output + " place";
    else
        output = output + " places";

    let audio = new Audio("sounds/success.wav"); 


    const nd = new Date();                  // get the current date
    cur_year = nd.getFullYear(); 
    cur_month = nd.getMonth();
    cur_date = nd.getDate();
    

    if( (year < cur_year) || ((year == cur_year) && (month < cur_month)) || ( (month == cur_month) && ( ndate < cur_date) ) )
    {
        output = "Date must be sometime in the future"; 
        audio.src = "sounds/error.wav"; 
    }
    else if( num_bookings[ndate] >= 5 )
    {
        output = "Sorry - we are fully booked for that date<br><br>Please try a different date"; 
        audio.src = "sounds/error.wav"; 
        }  
        else  
            num_bookings[ndate]++;

    document.getElementById("confirmation").innerHTML = output
    audio.play();

    update_table();
}

//------------------------------------------------------------------------------------------
      
function cancelBooking(event) {
    event.preventDefault();     // Prevent the form from submitting

    document.getElementById("confirmation").innerHTML = "This booking has been cancelled<br><br>" + 
      "You can book again for a different time or date";

    const date = document.getElementById('date').value;

    const d = new Date(date);               // Create a Date object
    can_date = d.getDate();

    if( num_bookings[can_date] )
        num_bookings[can_date]--;

    update_table();
}
