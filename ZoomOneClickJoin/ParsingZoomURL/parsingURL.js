var x = document.getElementById("URL");
console.log(x);


var url = require('url');
var adr = 'https://zoom.us/j/503521972';
var q = url.parse(adr, true);

console.log(q.pathname); //returns '/default.htm'

var pathArray = q.pathname.split('/');
var secondLevelPath = pathArray[2];

console.log(secondLevelPath);

var username = 'Ian Li';
var enc = Buffer.from(username).toString('base64')

console.log(enc);

var meetingURL = 'https://zoom.us/wc/' + secondLevelPath + '/join?prefer=1&un=' + enc;

console.log(meetingURL);

