document.getElementById("save").addEventListener("click",saveData);
document.getElementById("show").addEventListener("click",showData);
document.getElementById("rescue").addEventListener("click",rescue);
document.addEventListener("deviceReady",connectToDatabase);

//=======vibration on rescue button click
function rescue()
{
    navigator.vibrate(2000);
}



var db = null;
//======open a connection with database========

function connectToDatabase() {
  console.log("device is ready - connecting to database");
  // 2. open the database. The code is depends on your platform!
  if (window.cordova.platformId === 'browser') {
    console.log("browser detected...");
    // For browsers, use this syntax:
    //  (nameOfDb, version number, description, db size)
    // By default, set version to 1.0, and size to 2MB
    db = window.openDatabase("cestar", "1.0", "Database for Cestar College app", 2*1024*1024);
  }
  else {
    alert("mobile device detected");
    console.log("mobile device detected!");
    var databaseDetails = {"name":"cestar.db", "location":"default"}
    db = window.sqlitePlugin.openDatabase(databaseDetails);
    console.log("done opening db");
  }

  if (!db) {
    alert("databse not opened!");
    return false;
  }




//==========create aa table=============

db.transaction(
        function(tx){
            // Execute the SQL via a usually anonymous function 
            // tx.executeSql( SQL string, arrary of arguments, success callback function, failure callback function)
            // To keep it simple I've added to functions below called onSuccessExecuteSql() and onFailureExecuteSql()
            // to be used in the callbacks
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS hero (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, available INTEGER)",
                [],
                onSuccessExecuteSql,
                onError
            )
        },
        onError,
        onReadyTransaction
    )
    }
//========save data in the table=======================

function saveData(){
console.log("save button clicked");
alert("save button clicked");
var name= document.getElementById("name").value;
var available= document.getElementById("available").value;
console.log(name,available);


db.transaction(
        function(tx){
            tx.executeSql( "INSERT INTO hero(name, available) VALUES(?,?)",
            [name,available],
            onSuccessExecuteSql,
            onError )
        },
        onError,
        onReadyTransaction
    )

}

//=================display data ======================
function showData(){
document.getElementById("resultsSection").innerHTML = "";
console.log("show button clicked");
alert("show button clicked");

db.transaction(
        function(tx){
            tx.executeSql( "SELECT * FROM hero",
            [],
            displayResults,
            onError )
        },
        onError,
        onReadyTransaction
    )

}



//common database function

function onReadyTransaction( ){
  console.log( 'Transaction completed' )
}
function onSuccessExecuteSql( tx, results ){
  console.log( 'Execute SQL completed' )
}
function onError( err ){
  console.log( err )
}

//=====display function=========
function displayResults( tx, results ){
        
        if(results.rows.length == 0) {
            alert("No records found");
            return false;
        }
        
        var row = "";
        for(var i=0; i<results.rows.length; i++) {
     if(results.rows.item(i).available == 1)
     {
       document.getElementById("resultsSection").innerHTML +=
          "<p> Name: "
        +   results.rows.item(i).name
        + "<br>"
        + "available to hire: "
        +  "Yes"
        + "</p>"; 
     }
     else
     {
        document.getElementById("resultsSection").innerHTML +=
          "<p> Name: "
        +   results.rows.item(i).name
        + "<br>"
        + "available to hire: "
        +  "No"
        + "</p>"; 
     }
        }
       
    }


