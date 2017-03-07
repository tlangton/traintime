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
        var trainOneMins = $("#in_1stTrain").val().trim();
        var frequencyMins = $("#in_frequency").val().trim();
        var trainName = $("#in_trainName").val().trim();
        var destination = $("#in_dest").val().trim();


   firebaseRef.push({
    firstTrain: trainOneMins,
    nameTrain: trainName,
    dest: destination,
    frequency: frequencyMins,
    timestampCreated: firebase.database.ServerValue.TIMESTAMP
});





        var nowMinsAfterMdnt = (moment().get('hour') * 60 ) + moment().get('minute');
        console.log("now Mins After Mdnt " + nowMinsAfterMdnt);

        var difNowFirstMins = nowMinsAfterMdnt - trainOneMins;
        console.log("dif now from first " + difNowFirstMins);

        var diffOverFrequency = difNowFirstMins / frequencyMins;
        console.log("dif over frequency " + diffOverFrequency);

        var modDiff_Freq = (difNowFirstMins % frequencyMins) / frequencyMins ;
        console.log("mod dif over frequency " + modDiff_Freq);

        var nextTrainMins = frequencyMins - ( frequencyMins * modDiff_Freq );
        console.log("next Train Mins " + nextTrainMins);


        var timeNextTrain = moment().add(nextTrainMins, "minutes").format("HH:mm");
        console.log("time Next Train " + timeNextTrain);


        console.log(moment().format("HH:mm"));




        $("#firstTrain").html("First train (mins after midnite): " + trainOneMins);

        $("#frequency").html("Frequency: " + frequencyMins);

        $("#nextTrain").html("Next Train: " + timeNextTrain);
});

        firebaseRef.on("value", function(snapshot) {

        // Print the initial data to the console.
        console.log(snapshot.val());

        $("#firstTrain").html(snapshot.val().firstTrain);
        $("#frequency").html(snapshot.val().frequency);
         // $("#nextTrain").html(snapshot.val().firstTrain);




      // If any errors are experienced, log them to console.
  }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
  });


 firebaseRef.ref.orderByChild( "timestampCreated").on("child_added", function(snapshot) {
$(".well").append("<p>"+snapshot.val().firstTrain+"</p>");

$(".well").append("<p>"+ (snapshot.val().firstTrain)+(snapshot.val().firstTrain)+"</p>");
});













