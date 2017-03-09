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

//ref for new nodes
var firebaseRef = firebase.database().ref("trains");

var firebaseRefKey;

var trainOneMins = 0;
// first train arrival mins
var frequencyMins = 0;
// frequency of trains mins
var trainName;
var destination;
var butID;

function clearInput() {
    $("#in_1stTrain").val('');
    $("#in_frequency").val('');
    $("#in_trainName").val('');
    $("#in_dest").val('');
    var butID = "";
}

//new train button entry
$("#submit").click(function(){

// var train1Input =  moment($("#in_1stTrain").val().trim(), "hmm").format("HH:mm");
var train1Input =  $("#in_1stTrain").val().trim();
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
//clean up form
clearInput();
});

//Update train record
$("#update").click(function(){
    // var train1Input =  moment($("#in_1stTrain").val().trim(), "hmm").format("HH:mm");
var train1Input =  $("#in_1stTrain").val().trim();
var train1timeSplit = train1Input.split(":");
//calcs minutes since midnight till first train arrives
var trainOneMins = parseInt((train1timeSplit[0] * 60)) + parseInt(train1timeSplit[1]);

var frequencyMins = $("#in_frequency").val().trim();
var trainName = $("#in_trainName").val().trim();
var destination = $("#in_dest").val().trim();


firebase.database().ref("trains/"+butID).update({
    train1Input: train1Input,
    firstTrain: trainOneMins,
    nameTrain: trainName,
    dest: destination,
    frequency: frequencyMins
});
//clean up form
clearInput();

});

//delete train
$("#remove").click(function(){

firebase.database().ref("trains/"+butID).remove();
//clean up form
clearInput();

});


//clear train entry fields
$("#clear").click(function(){
    clearInput();
});

//output table

$(".well").html("<table><tr><th>Train Name:</th><th>Destination:</th><th>First Train:</th><th>Next Train:</th><th>Next Arrival:</th><th>Frequency:</th></tr>");

firebaseRef.ref.orderByChild( "timestampCreated").on("child_added", function(snapshot) {

    // console.log(snapshot);
    var MinsAfterMidnight_currentTime = (moment().get('hour') * 60 ) + moment().get('minute');
    var timestampCreated = snapshot.val().timestampCreated;
    var frequency = snapshot.val().frequency;
    var nameTrain = snapshot.val().nameTrain;
    var MinsAfterMidnight_firstTrain = snapshot.val().firstTrain;
    var train1Input = snapshot.val().train1Input;
    var dest = snapshot.val().dest;
    var key = snapshot.key;

    //calcs
    //if first train arrived before now today
    if (MinsAfterMidnight_currentTime > MinsAfterMidnight_firstTrain) {
        //difference in minutes between now and first train arrival
        var delta_currentTime_firstTrainTime = MinsAfterMidnight_currentTime - MinsAfterMidnight_firstTrain  ;
        //minutes (above) divided by frequency - how many trains so far and remainder
        var diffOverFrequency = delta_currentTime_firstTrainTime / frequency;

        var modulusDiff_Freq = (delta_currentTime_firstTrainTime % frequency) / (frequency) ;
        var nextTrainMins =   Math.floor((frequency) - ( frequency * modulusDiff_Freq ));
        var timeNextTrain = moment().add(nextTrainMins, "minutes").format("HH:mm");
    } else {
    // future first train - will arrive after now
    var nextTrainMins = MinsAfterMidnight_firstTrain - MinsAfterMidnight_currentTime;
    var timeNextTrain = train1Input;
}
var $trainRow = $("<tr>")
$trainRow.addClass('train-row')
$trainRow.attr('id', key)
$trainRow.css({cursor: 'pointer'})
$trainRow.append("<td class='train-name'>"+ nameTrain +"</td>");
$trainRow.append("<td class='train-dest'>"+ dest +"</td>");
$trainRow.append("<td class='train-first'>"+ train1Input +"</td>");
$trainRow.append("<td>"+ timeNextTrain+"</td>");
$trainRow.append("<td>"+ nextTrainMins +" minutes</td>");
$trainRow.append("<td class='train-frequency'>"+ frequency +" minutes</td>");
$("table").append($trainRow);
});


//click a row to update - moves data to input fields from table
$(".well").on("click", ".train-row", function(){
   butID = $(this).attr('id');
   console.log (butID);

   var trainName = $(this).find('.train-name').text()
   var trainDest = $(this).find('.train-dest').text()
   var trainFirst = $(this).find('.train-first').text()
   var trainFrequency = $(this).find('.train-frequency').text()
   var trainFreqSplit = trainFrequency.split(" ");
   var trainFreqFix = parseInt((trainFreqSplit[0]))


   $("#in_trainName").val(trainName);
   $("#in_dest").val(trainDest);
   $("#in_1stTrain").val(trainFirst);
   $("#in_frequency").val(trainFreqFix);

   //ref for editing trains
var firebaseRefKey = firebase.database().ref("trains/"+butID);
  console.log (firebaseRefKey);
  console.log (firebaseRef);
 // alert(trainName)
});


// $(".well").click(function(){
//     alert("The paragraph was clicked.");
// });






//output table  REMOVED

$(".well").html("<table><tr><th>Train Name:</th><th>Destination:</th><th>First Train:</th><th>Next Train:</th><th>Next Arrival:</th><th>Frequency:</th></tr>");

firebaseRef.ref.orderByChild( "timestampCreated").on("child_removed", function(snapshot) {

    // console.log(snapshot);
    var MinsAfterMidnight_currentTime = (moment().get('hour') * 60 ) + moment().get('minute');
    var timestampCreated = snapshot.val().timestampCreated;
    var frequency = snapshot.val().frequency;
    var nameTrain = snapshot.val().nameTrain;
    var MinsAfterMidnight_firstTrain = snapshot.val().firstTrain;
    var train1Input = snapshot.val().train1Input;
    var dest = snapshot.val().dest;
    var key = snapshot.key;

    //calcs
    //if first train arrived before now today
    if (MinsAfterMidnight_currentTime > MinsAfterMidnight_firstTrain) {
        //difference in minutes between now and first train arrival
        var delta_currentTime_firstTrainTime = MinsAfterMidnight_currentTime - MinsAfterMidnight_firstTrain  ;
        //minutes (above) divided by frequency - how many trains so far and remainder
        var diffOverFrequency = delta_currentTime_firstTrainTime / frequency;

        var modulusDiff_Freq = (delta_currentTime_firstTrainTime % frequency) / (frequency) ;
        var nextTrainMins =   Math.floor((frequency) - ( frequency * modulusDiff_Freq ));
        var timeNextTrain = moment().add(nextTrainMins, "minutes").format("HH:mm");
    } else {
    // future first train - will arrive after now
    var nextTrainMins = MinsAfterMidnight_firstTrain - MinsAfterMidnight_currentTime;
    var timeNextTrain = train1Input;
}
var $trainRow = $("<tr>")
$trainRow.addClass('train-row')
$trainRow.attr('id', key)
$trainRow.css({cursor: 'pointer'})
$trainRow.append("<td class='train-name'>"+ nameTrain +"</td>");
$trainRow.append("<td class='train-dest'>"+ dest +"</td>");
$trainRow.append("<td class='train-first'>"+ train1Input +"</td>");
$trainRow.append("<td>"+ timeNextTrain+"</td>");
$trainRow.append("<td>"+ nextTrainMins +" minutes</td>");
$trainRow.append("<td class='train-frequency'>"+ frequency +" minutes</td>");
$("table").append($trainRow);
});



//output table  CHANGED

$(".well").html("<table><tr><th>Train Name:</th><th>Destination:</th><th>First Train:</th><th>Next Train:</th><th>Next Arrival:</th><th>Frequency:</th></tr>");

firebaseRef.ref.orderByChild( "timestampCreated").on("child_changed", function(snapshot) {

    // console.log(snapshot);
    var MinsAfterMidnight_currentTime = (moment().get('hour') * 60 ) + moment().get('minute');
    var timestampCreated = snapshot.val().timestampCreated;
    var frequency = snapshot.val().frequency;
    var nameTrain = snapshot.val().nameTrain;
    var MinsAfterMidnight_firstTrain = snapshot.val().firstTrain;
    var train1Input = snapshot.val().train1Input;
    var dest = snapshot.val().dest;
    var key = snapshot.key;

    //calcs
    //if first train arrived before now today
    if (MinsAfterMidnight_currentTime > MinsAfterMidnight_firstTrain) {
        //difference in minutes between now and first train arrival
        var delta_currentTime_firstTrainTime = MinsAfterMidnight_currentTime - MinsAfterMidnight_firstTrain  ;
        //minutes (above) divided by frequency - how many trains so far and remainder
        var diffOverFrequency = delta_currentTime_firstTrainTime / frequency;

        var modulusDiff_Freq = (delta_currentTime_firstTrainTime % frequency) / (frequency) ;
        var nextTrainMins =   Math.floor((frequency) - ( frequency * modulusDiff_Freq ));
        var timeNextTrain = moment().add(nextTrainMins, "minutes").format("HH:mm");
    } else {
    // future first train - will arrive after now
    var nextTrainMins = MinsAfterMidnight_firstTrain - MinsAfterMidnight_currentTime;
    var timeNextTrain = train1Input;
}
var $trainRow = $("<tr>")
$trainRow.addClass('train-row')
$trainRow.attr('id', key)
$trainRow.css({cursor: 'pointer'})
$trainRow.append("<td class='train-name'>"+ nameTrain +"</td>");
$trainRow.append("<td class='train-dest'>"+ dest +"</td>");
$trainRow.append("<td class='train-first'>"+ train1Input +"</td>");
$trainRow.append("<td>"+ timeNextTrain+"</td>");
$trainRow.append("<td>"+ nextTrainMins +" minutes</td>");
$trainRow.append("<td class='train-frequency'>"+ frequency +" minutes</td>");
$("table").append($trainRow);
});