$(document).ready(function () {

    var firebaseConfig = {
        apiKey: "AIzaSyCz0C9Pqc5nm0Qg6CUuNJVBHMZuoJ42fhw",
        authDomain: "train-scheduler-b5679.firebaseapp.com",
        databaseURL: "https://train-scheduler-b5679.firebaseio.com",
        projectId: "train-scheduler-b5679",
        storageBucket: "",
        messagingSenderId: "14746297995",
        appId: "1:14746297995:web:8bde41b260abdac853968e"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        var database = firebase.database();
        var sKey = [];
      
    $("#add-train").on("click", function(event) {
        event.preventDefault();
        var name = $("#train").val().trim();
        var station = $("#destination").val().trim();
        var firstTrain = $("#firstTrainTime").val().trim();
        var recurrence = parseInt($("#frequency").val().trim());
        var firstTrainPushback = moment(firstTrain, "HH:mm").subtract(1, "years");
        var deltaTime = moment().diff(firstTrainPushback, "minutes");
        var timeRemaining = deltaTime % recurrence;
        var minutesAway = recurrence - timeRemaining;
        var nextArrival = moment().add(minutesAway, "minutes");
        nextArrival = moment(nextArrival).format("hh:mm A");

        database.ref().push({
             train: name,
             destination: station,
             frequency: recurrence,
             nextArrival: nextArrival,
             minutesAway: minutesAway
        });
    });

    database.ref().on("child_added", function(snapshot) {
        var saved = snapshot.val();
        var rowTrain = $("<tr>").append(
            $("<td>").text(saved.train)
        );        
        $("#train-output").append(rowTrain);
        var rowDestination = $("<tr>").append(
            $("<td>").text(saved.destination)
        );
        $("#station-output").append(rowDestination);
        var rowFrequency = $("<tr>").append(
            $("<td>").text(saved.frequency)
        );
        $("#recurrence-output").append(rowFrequency);
        var rowNextArrival = $("<tr>").append(
            $("<td>").text(saved.nextArrival)
        );
        $("#nextArrival-output").append(rowNextArrival);
        var rowMinutesAway = $("<tr>").append(
            $("<td>").text(saved.minutesAway)
        );
        $("#minutesAway-output").append(rowMinutesAway);
        sKey.push(
            {"key": snapshot.key,
            "train": saved.train
        });
    });

    $("#clear").on("click", function(event) {
        event.preventDefault();
        var clearTrain = $("#trainName").val().trim();
        var clearKey = "";
        for (var i = 0; i < sKey.length; i++){
            if (sKey[i].train === clearTrain){
                clearKey = sKey[i].key;
            }
        }
        database.ref().child(clearKey).remove();       
    });
});