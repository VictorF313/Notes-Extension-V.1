// Setting themes for the app
themesButton = document.querySelector("#themesButton");

// This function will ask the user to enter a color combination and set that as theme
function changeTheme(bodyColor, noteHolderColor, inputFieldColor) {
  body = document.querySelector("body").style.backgroundColor = bodyColor;
  noteHolder = document.querySelector("textarea").style.color = noteHolderColor;
  inputField = document.querySelectorAll("input");

  for (let i = 0; i < inputField.length; i++) {
    inputField[i].style.color = inputFieldColor;
  }
}

themesButton.addEventListener("click", function () {
  document.querySelector(".button span").innerHTML =
    "<ul><button>Theme1</button><button>Theme2</button><button>Custom</button></ul>";

  document
    .querySelectorAll("#themesButton span ul button")[0]
    .addEventListener("click", function () {
      changeTheme("lightgreen", "white");
    });
  document
    .querySelectorAll("#themesButton span ul button")[1]
    .addEventListener("click", function () {
      changeTheme("skyblue", "white");
    });
  document
    .querySelectorAll("#themesButton span ul button")[2]
    .addEventListener("click", function () {
      let body = prompt("Enter color for the body:");
      let fontColor = prompt("Enter color for the text:");

      changeTheme(body, fontColor, fontColor);
    });
});

document
  .querySelector("#clearNotesButton")
  .addEventListener("click", function () {
    document.querySelector(".button span").innerHTML = "";
  });
