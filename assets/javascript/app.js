// alert("hi");

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAIDttGliQmCksVWqm5O30mTnKfEPMEQtE",
    authDomain: "traintime-1f27c.firebaseapp.com",
    databaseURL: "https://traintime-1f27c.firebaseio.com",
    storageBucket: "traintime-1f27c.appspot.com",
    messagingSenderId: "1074144752451"
};
firebase.initializeApp(config);

var firebaseRef = firebase.database().ref("trains");


var nowMins = 0;
// now mins since midnight
var trainOneMins = 0;
// first train arrival mins
var frequencyMins = 0;
// frequency of trains mins
var trainName;
var destination;

// nowMins = 200;
trainOneMins = 100;
frequencyMins = 60;





$("#submit").click(function(){
// alert("Value: " + $("#in_1stTrain").val
// var trainOneMins = $("#in_1stTrain").val().trim();

var train1Input =  moment($("#in_1stTrain").val().trim(), "hmm").format("HH:mm");

var train1timeSplit = train1Input.split(":");
//calcs minutes since midnight till first train arrives
var trainOneMins = parseInt((train1timeSplit[0] * 60)) + parseInt(train1timeSplit[1]);

var frequencyMins = $("#in_frequency").val().trim();
var trainName = $("#in_trainName").val().trim();
var destination = $("#in_dest").val().trim();



firebaseRef.push({
    train1Input: train1Input,
    firstTrain: trainOneMins,
    nameTrain: trainName,
    dest: destination,
    frequency: frequencyMins,
    timestampCreated: firebase.database.ServerValue.TIMESTAMP
});

$("#in_1stTrain").val('');
$("#in_frequency").val('');
$("#in_trainName").val('');
$("#in_dest").val('');

});

//output table

$(".well").append("<table><tr><th>Train Name:</th><th>Destination:</th><th>First Train:</th><th>Next Train:</th><th>Next Arrival:</th><th>Frequency:</th><th>Edit</th></tr>");

firebaseRef.ref.orderByChild( "timestampCreated").on("child_added", function(snapshot) {

    // console.log(snapshot);
    var nowMinsAfterMdnt = (moment().get('hour') * 60 ) + moment().get('minute');
    var timestampCreated = snapshot.val().timestampCreated;
    var frequency = snapshot.val().frequency;
    var nameTrain = snapshot.val().nameTrain;
    var firstTrain = snapshot.val().firstTrain;
    var train1Input = snapshot.val().train1Input;
    var dest = snapshot.val().dest;


if (nowMinsAfterMdnt > firstTrain) {
    var diffNowFirstMins = nowMinsAfterMdnt - firstTrain;
    var diffOverFrequency = diffNowFirstMins / frequency;
    var modDiff_Freq = (diffNowFirstMins % frequency) / (frequency) ;
    var nextTrainMins = (frequency) - ( frequency * modDiff_Freq );
    var timeNextTrain = moment().add(nextTrainMins, "minutes").format("HH:mm");
} else {

    // future frist train
    var nextTrainMins = firstTrain - nowMinsAfterMdnt;
    var timeNextTrain = train1Input;

}



    console.log(timestampCreated);

    $(".well").append("<tr class:'edit'>");
    $(".well").append("<td>"+ nameTrain +"</td>");
    $(".well").append("<td>"+ dest +"</td>");
    $(".well").append("<td>"+ train1Input +"</td>");
    $(".well").append("<td>"+ timeNextTrain+"</td>");
    $(".well").append("<td>"+ nextTrainMins +" minutes</td>");
    $(".well").append("<td>"+ frequency +"</td>");
    $(".well").append("<td  id:" + timestampCreated +">Edit "+ timestampCreated +" </td>");
    $(".well").append("</tr>");
});

$(".well").append("<table>");





$(".edit").on("click", function(){
 alert( "Handler for .click() called." );
 butID = $(this).attr('id');
 console.log (butID);
    // answer();
});
