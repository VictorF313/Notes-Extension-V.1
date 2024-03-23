// Creating global variables and functions
let myDate = new Date();
const options = {
  day: "numeric",
  month: "long",
  year: "numeric",
};
let myDay = myDate.toLocaleString(undefined, options);
let myHour = myDate.getHours();
let myMinute = myDate.getMinutes();
const fullDate = myDay + " - " + myHour + " : " + myMinute + ": ";
let transaction;
let db;
const connectionRequest = indexedDB.open("Notes", 1); // Opening the database

// This function will run when clearNote button is clicked and after saving note in database
function clearEnteredText() {
  document.querySelectorAll("input")[0].value = "";
  document.querySelectorAll("input")[1].value = "";
  document.querySelectorAll("textarea")[0].value = "";
}

// Increasing searchBar width and hiding the caret
document.getElementById("searchBar").addEventListener("beforeinput", () => {
  document.getElementById("searchBar").style.width = "440px";
  document.getElementById("searchBar").style.caretColor =
    "rgba(144, 238, 144, 0.776)";
});

// Hiding the caret in titleBar
document.getElementById("titleBar").addEventListener("beforeinput", () => {
  document.getElementById("titleBar").style.caretColor =
    "rgba(144, 238, 144, 0.776)";
});

// Setting connection with the database
// This code will run if the database opened successfully
connectionRequest.onsuccess = (event) => {
  // console.log("Database has been opened successfully");

  db = event.target.result;

  // Adding functionality to saveNote button
  document.querySelectorAll("button")[2].addEventListener("click", () => {
    let textField = document.querySelectorAll("textarea")[0].value;
    let allNotes = db
      .transaction("myNotes", "readwrite")
      .objectStore("myNotes");
    let noteTitle = document.querySelectorAll("input")[1].value;
    let noteContent = document.querySelectorAll("textarea")[0].value;
    let uniqueId = Date.now().toString();
    let enteredNote = {
      id: uniqueId,
      text: `Id: (${uniqueId}) ${fullDate} ${noteTitle} => \r\n ${noteContent}`,
    };

    // An alert will be opened if there is no content in the note
    if (textField.length === 0) {
      return alert("Error-code[1]: No Content");
    }
    if (textField.includes("=>")) {
      return alert("Entered content already exixt");
    } else {
      // If there is any content in note then the note will be saved in the database
      let saveNote = allNotes.add(enteredNote);
      saveNote.onsuccess = function () {
        clearEnteredText();
        alert("Note has been saved");
      };

      // An alert will be shown if there is an error on saving the note
      saveNote.onerror = function () {
        alert("Unable to save note");
      };
    }
  });

  // Adding functionality to searchButton
  let searchButton = document.querySelectorAll("button")[0];
  searchButton.addEventListener("click", function () {
    let searchBar = document.querySelectorAll("input")[0].value;
    // console.log("searched for: " + searchBar);

    let transaction = db.transaction("myNotes");
    let savedNotes = transaction.objectStore("myNotes");
    let noteIndex = savedNotes.index("text_index");
    let request = noteIndex.getAll();
    let foundNote = [];
    let retrivedNotes = [];
    request.onsuccess = function () {
      let note = request.result;
      // console.log(note);

      for (let i = 0; i < note.length; i++) {
        foundNote.push(note[i].text);
        JSON.stringify(foundNote);
        // console.log(foundNote);
      }

      for (let i = 0; i < foundNote.length; i++) {
        if (foundNote[i].includes(searchBar)) {
          retrivedNotes.push(foundNote[i]);
          console.log(retrivedNotes);
          let editedNotes = retrivedNotes.join("\r\n" + "\r\n");
          // console.log(editedNotes);

          document.querySelectorAll("textarea")[0].value = editedNotes;
          document.querySelectorAll("textarea")[0].readOnly = true;
        }
      }

      if (retrivedNotes == [] || retrivedNotes.length == 0) {
        alert("No query found");
      }

      if (searchBar == "") {
        alert("Search field is empty");
        clearEnteredText();
        document.querySelectorAll("textarea")[0].readOnly = false;
      }

      if (searchBar == "=>") {
        alert("Unsupported search query");
        clearEnteredText();
      }
    };
  });

  // Adding functionality to showNotes button
  let showAllNotes = document.querySelectorAll("button")[1];

  showAllNotes.addEventListener("click", () => {
    let fetchNotes = db.transaction("myNotes").objectStore("myNotes").getAll();
    fetchNotes.onsuccess = function (event) {
      let notesArray = fetchNotes.result;
      let formattedNotes = notesArray
        .map((note) => note.text)
        .join("\r\n" + "\r\n" + "\r\n"); // This line will extract the notes from the notesArray object and add each notes in new line
      document.querySelectorAll("textarea")[0].value = formattedNotes;
      document.querySelectorAll("textarea")[0].readOnly = true;
      if (document.querySelectorAll("textarea")[0].value == "") {
        alert("No Saved Notes Found");
        document.querySelectorAll("textarea")[0].readOnly = false;
      }
    };
  });

  // Setting functionality to the deleteNotes button
  let deleteNote = document.querySelector("textarea").value;
  let deleteNoteButton = document.querySelector("#deleteNotesButton");

  deleteNoteButton.addEventListener("click", function () {
    // Taking note ID from the user to navigate to the note to delete
    noteId = prompt("Enter the ID of the note");
    if (noteId == null || noteId == "") {
      return alert("Enter a note id");
    } else {
      function removeNote(key) {
        let request = db
          .transaction("myNotes", "readwrite")
          .objectStore("myNotes")
          .delete(key);
        request.onsuccess = () => {
          console.log("Note has been deleted from the database");
          request.onerror = () => {
            console.log("Something went wrong, unable to delete note");
          };
        };
      }
      removeNote(noteId);
    }
  });
};

// Adding functionality to clearNote button
document.querySelectorAll("button")[3].addEventListener("click", () => {
  clearEnteredText();
  document.querySelectorAll("textarea")[0].readOnly = false;
  document.querySelectorAll("textarea")[0].style.height = "130px";
});

// This code will run if there is any error occurred opening the database
connectionRequest.onerror = (event) => {
  alert("An unexpected error occurred");
};

// This code will run whenever the database will upgrade or newly created
connectionRequest.onupgradeneeded = (event) => {
  db = event.target.result;

  if (!db.objectStoreNames.contains("myNotes")) {
    let createdObjectStore = db.createObjectStore("myNotes", { keyPath: "id" });
    let index = createdObjectStore.createIndex("text_index", "text");
  }
};
