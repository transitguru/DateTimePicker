/**
 * A Lightweight Date Time Picker
 * Copyright (C) 2014  Michael Sypolt <msypolt@gmail.com>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along
 * with this program.  If not, see <http://www.gnu.org/licenses/>
 *
 * @file
 * @author <msypolt@gmail.com>
 *
 * Datepicker JavaScript Functions 
 */
"use strict";

/**
 * Toggle the hiding or showing of an element
 * 
 * @param {string} id ID of element that is being hidden or shown
 * @returns {Boolean}
 */

function toggle_hide(id,classes){
  if (document.getElementById(id).getAttribute('class') == 'hide'){
    document.getElementById(id).removeAttribute('class');
    if (typeof classes !== 'undefined'){
      document.getElementById(id).setAttribute('class', classes);
    }
  }
  else{
    document.getElementById(id).setAttribute('class', 'hide');
  }
  return false;
}


/**
 * Lets your javascript take a little nap
 * 
 * @param {int} milliseconds Length of time that javascript should wait in milliseconds
 * @returns {void}
 */
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/**
 * Allow a checkbox to be checked or unchecked
 * 
 * @param {string} id
 * @returns {void}
 */

function toggle_checkbox(id){
  if (document.getElementById(id).checked){
    document.getElementById(id).checked=false;
  }
  else{
    document.getElementById(id).checked=true;
  }
}


/**
 * Shows tooltip using a hidden div
 *  
 * @param {object} evt
 * @returns {void}
 */
function ShowTooltip(evt, text){
//Enter user inputs here
  var xOffset = 5;
  var yOffset = -30;
  var fontSize = 14;
  var fontFamily = "Sans";
  var fontWeight = "Normal";
  var textColor = "#000000";

  var boxFill = "#ffff00";
  var boxStroke = "#000000";
  var boxStrokeWidth = "1";
  var boxOpacity = "1.00";

  //Don't write below this line!
  var tooltip = document.getElementById('tooltip');
  var mx = evt.clientX + xOffset; 
  var my = evt.clientY + yOffset; 
  
  var fontString = fontSize.toString();
  var tooltipStyle = "";
  tooltipStyle = tooltipStyle.concat("font-size: ", fontString, "px; font-family:", fontFamily, "; font-weight:", fontWeight, "; font-color:", textColor, "; background-color: " ,boxFill, "; border:", boxStrokeWidth, "px solid" + boxStroke, "; opacity:", boxOpacity, ";", "top: ", my, "px; left: ", mx, "px; z-index:9; position:fixed; padding: 2px; border-radius: 5px;");
  tooltip.setAttribute("style", tooltipStyle);
  tooltip.innerHTML = text;
  tooltip.setAttribute("class","show");
}

/**
 * Hides a tooltip
 * 
 * @param {object} evt
 * @returns {void}
 */
function HideTooltip(evt){
  var tooltip = document.getElementById('tooltip');
  tooltip.setAttribute("class","hide");
}


function userAlertDialogue(id, command){
  if (id == -1){
    xmlhttpPostLite('command=write&alert_show=-1&newalert_reveal=Project', '/ajax/', 'dialogue-content','<p>Please Wait</p>');
  }
  else{
    xmlhttpPostLite('command=' + command + '&alert_show=' + id, '/ajax/', 'dialogue-content','<p>Please Wait</p>');
  }
}
function showDialogue(title){
  document.getElementById('dialogue').setAttribute('class', 'dialogue');
  document.getElementById('dialoguebg').setAttribute('class', 'dialoguebg');
  if (typeof title !== 'undefined'){
    document.getElementById('dialogue-title').innerHTML = title;
  }
  else{
    document.getElementById('dialogue-title').innerHTML = 'Dialog Box';
  }
}

function hideDialogue(){
  document.getElementById('dialogue').setAttribute('class', 'hide');
  document.getElementById('dialoguebg').setAttribute('class', 'hide');
  document.getElementById('dialogue-title').innerHTML = '';
  document.getElementById('dialogue-content').innerHTML = '';
}

/**
 * Pads characters to the left of a string if shorter than length
 * 
 * @param {string} str String that will be left-padded
 * @param {string} padString String to pad to the left of the string
 * @param {int} length The number of characters for the resulting string
 * @returns {string} the padded string
 */
function leftPad(str, padString, length) {
  while (str.length < length){
    str = padString + str;
  }
  return str;
}

/**
 * Activates a date-picker
 * 
 * @param {object} e Event handler from mouse-click
 * @param {string} responsediv ID of calendar div to fill with calendar info
 * @param {element} input Input element where the click originated
 * @param {string} min Earliest date permitted (yyyy-mm-dd)
 * @param {string} max Latest date permitted (yyyy-mm-dd)
 * @returns {void}
 */
function showCalendar(e,responsediv, input, min, max){
  var mx = e.clientX; 
  var my = e.clientY;
  var id = input.getAttribute('id');
  var startpoint = input.getAttribute('value');
  var datearray = startpoint.split("-");
  var year = datearray[0];
  var mo = datearray[1];
  document.getElementById(responsediv).setAttribute('class', 'calendar');
  getCalendar(mx,my, year, mo, startpoint, min, max, responsediv,id);
}

/**
 * Renders a calendar
 * 
 * @param {int} ax clientX position of mouse
 * @param {int} ay clientY position of mouse
 * @param {int} year Year for calendar
 * @param {int} mo Month for calendar (1=january)
 * @param {string} startpoint Currently selected date on input element (yyyy-mm-dd)
 * @param {string} min Earliest date permitted (yyyy-mm-dd)
 * @param {string} max Latest date permitted (yyyy-mm-dd)
 * @param {string} responsediv ID of calendar div to fill with calendar info
 * @param {string} id ID of input element that is being handled
 * @returns {void}
 */
function getCalendar(ax,ay, year, mo, startpoint, min, max, responsediv,id){
  // Load month names for humans
  var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

  // Determine previous and next year
  var year1 = year - 1;
  var year2 = year - 0 + 1;
  
  // Today's date
  var today = new Date();
  var ty = today.getFullYear();
  var tm = today.getMonth() + 1;
  var td = today.getDate();
  
  // Current selection's date
  var datearray = startpoint.split("-");
  var sy = datearray[0];
  var sm = datearray[1];
  var sd = datearray[2];
  
  // Create the beginning point for the calendar
  var y = year;
  var m = mo - 1;
  var d = 1;
  var date = new Date(y,m,d);
  var start = date.getDay();
  
  // Initialize variables for HTML output
  var css = 'othermonth';
  var dates = [];
  var nums = [];
  var classes = [];
  
  // Fill in previous months info if month does not begin on Sunday
  if (start > 0){
    var end = 42 - start;
    date.setDate(1 - start);
    var prev = date.getDate();
    for (var i=0;i<start;i++){
      date.setDate(i + prev);
      y = date.getFullYear();
      var yyyy = leftPad(y + '', '0', 4);
      m = date.getMonth() + 1;
      var mm = leftPad(m + '', '0', 2);
      d = date.getDate();
      nums[i] = d;
      var dd = leftPad(d + '', '0', 2);
      dates[i] = '' + yyyy + '-' + mm + '-' + dd + '';
      
      // Styling for certain days
      if(ty == y && tm == m && td == d){
        classes[i] = 'today';
      }
      else if(sy == y && sm == m && sd == d){
        classes[i] = 'startpoint';
      }
      else{
        classes[i] = css;
      }
    }
    // Load previous month's info for fetching a previous calendar
    var pyr = date.getFullYear();
    var pmo = date.getMonth() + 1;
    // set time back to correct month
    date.setDate(prev + start);
    var now = date.getMonth();
  }
  else{
    // Load previous month's info for fetching a previous calendar
    date.setDate(0)
    var pyr = date.getFullYear();
    var pmo = date.getMonth() + 1;
    var day = date.getDate() + 1;
    // set time back to correct month
    date.setDate(day);
    var now = date.getMonth();
    end = 42;
  }
  
  // Now work on this month
  var offset = 0;
  for (var i=0; i<=end; i++){
    date.setDate(1 + i - offset);
    y = date.getFullYear();
    var yyyy = leftPad(y + '', '0', 4);
    m = date.getMonth() + 1;
    var mm = leftPad(m + '', '0', 2);
    d = date.getDate();
    nums[i + start] = d;
    var dd = leftPad(d + '', '0', 2);
    dates[i + start] = '' + yyyy + '-' + mm + '-' + dd + '';
    if (m != now){
      // Overflowed the current month, now showing next month until calendar ends
      if (css == 'currentmonth'){
        css = 'othermonth';
      }
      else{
        css = 'currentmonth';
      }
      offset = i;
      now = m;
    }
    
    // Styling for certain days
    if(ty == y && tm == m && td == d){
      classes[i + start] = 'today';
    }
    else if(sy == y && sm == m && sd == d){
      classes[i + start] = 'startpoint';
    }
    else{
      classes[i + start] = css;
    }
  }
  
  // Load next month's info for fetching a next calendar
  var nyr = date.getFullYear();
  var nmo = date.getMonth() + 1;
  
  // Dump data into HTML to render the calendar
  var i =0;
  
  // Navigation
  var html = '<span class="bold">' + monthNames[mo - 1] + ' ' + year + '</span>';
  html = html + '<button class="right" style="font-weight:normal" onclick="removeCalendar(\'' + responsediv + '\')">x</button><br /><br />';
  html = html + '<div class="float"><button onclick="getCalendar(' + ax + ', ' + ay + ',' + year1 + ', ' + mo +  ', \'' + startpoint + '\', \'' + min + '\', \'' + max + '\' , \'' + responsediv + '\',\'' + id + '\');">&lt;&lt;</button>&nbsp;<button onclick="getCalendar(' + ax + ', ' + ay + ',' + pyr + ', ' + pmo +  ', \'' + startpoint + '\', \'' + min + '\', \'' + max + '\' , \'' + responsediv + '\',\'' + id + '\');">&lt;</button></div>';
  html = html + '<div  class="right"><button onclick="getCalendar(' + ax + ', ' + ay + ','  + nyr + ', ' + nmo +  ', \'' + startpoint + '\', \'' + min + '\', \'' + max + '\' , \'' + responsediv + '\',\'' + id + '\');">&gt;</button>&nbsp;<button onclick="getCalendar(' + ax + ', ' + ay + ','  + year2 + ', ' + mo +  ', \'' + startpoint + '\', \'' + min + '\', \'' + max + '\' , \'' + responsediv + '\',\'' + id + '\');">&gt;&gt;</button></div>';

  // Calendar Grid
  html = html + '<table><thead><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></thead><tbody>';
  for (var w=0;w<6;w++){
    html = html + '<tr>';
    for (var d=0;d<7;d++){
      var string = dates[i];
      var style = 'inactive ' + classes[i];
      var onclick = '';
      // Determine if the date is valid for input
      if (string >= min && string <= max){
        onclick = 'onclick="setDay(\'' + string + '\', \'' + id + '\', \'' + responsediv + '\');"';
        style = 'hand ' + classes[i];
      }
      html = html + '<td ' + onclick + ' class="' + style + '">' + nums[i] + '</td>';
      i ++;
    }
    html = html + '</tr>';
  }
  html = html + '</tbody></table>';
  
  //Inject calendar into calendar div and use mouse event to locate it on the page
  document.getElementById(responsediv).innerHTML = html;
  var my = ay - 0;
  var mx = ax + 20;
  document.getElementById(responsediv).setAttribute('style','z-index:9; position:fixed; top:' + my + 'px; left:' + mx + 'px;')
}

/**
 * Sets the date in an input from the datepicker
 * 
 * @param {string} date Date for input element (yyyy-mm-dd)
 * @param {string} id ID of input element to update
 * @param {string} responsediv ID of calendar that will be closed
 * @returns {void}
 */
function setDay(date, id, responsediv){
  document.getElementById(id).setAttribute('value',date);
  document.getElementById(id).focus();
  document.getElementById(id).blur();
  removeCalendar(responsediv);
}

/**
 * Removes calendar information and hides the container div
 * 
 * @param {string} responsediv ID of calendar that will be closed
 * @returns {void}
 */
function removeCalendar(responsediv){
  document.getElementById(responsediv).innerHTML = '';
  document.getElementById(responsediv).setAttribute('class', 'hide');
}

/**
 * Updates an end date so that it is not before than the start date
 * 
 * @param {element} input Begin date input element
 * @param {string} update ID of end date to update
 * @returns {void}
 */
function updateEndDate(input, update){
  var date1 = input.getAttribute('value');
  var date2 = document.getElementById(update).getAttribute('value');
  if (date1 > date2){
    document.getElementById(update).setAttribute('value', date1);
  }
}

function updateTime(input, update, date1, date2){
  var time1 = input.getAttribute('value');
  var time2 = document.getElementById(update).getAttribute('value');
  var da1 = document.getElementById(date1).getAttribute('value');
  var da2 = document.getElementById(date2).getAttribute('value');
  if (da1 == da2 && time1 > time2){
    document.getElementById(update + '___' + time2).selected=true;
  } 
}
