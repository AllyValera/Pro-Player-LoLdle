// store fetched data in these variables
let summoner;
let country;
let birthday;
let role; 
let team;

// get a random player - GET request to specified URL
fetch('http://localhost:3000/getRandomPlayer')
    // turn the response into parsed JSON
    .then(response => response.json())
    .then(data => {
        // access fields for the player
        summoner = data.summoner;
        country = data.country;
        birthday = data.birthday;
        role = data.role;
        team = data.team;

        // display fields for the player in the console
        console.log('Summoner:', summoner);
        console.log('Country:', country);
        console.log('Birthday:', birthday);
        console.log('Role:', role);
        console.log('Team:', team);
    })
    .catch(error => console.error('Error:', error));

// event listener for when the window has finished loading
window.addEventListener("load", function() {
    // check local storage to see if the pop up has been shown to the user already
    var popupShown = localStorage.getItem("popupShown");

    // if the pop up was NOT shown, display it after 1000ms
    if (!popupShown) {
        setTimeout(function() {
            document.getElementById("popup").style.display = "block";
        }, 1000);
    }

    // button present inside the pop up to close it
    document.querySelector("#close").addEventListener("click", function() {
        event.preventDefault(); // prevents page from reloading when the popup exits
        document.getElementById("popup").style.display = "none";
        localStorage.setItem("popupShown", true); // alter localStorage data
    });

    // button on main page to open the pop up
    document.getElementById("rules").addEventListener("click", function() {
        document.getElementById("popup").style.display = "block";
    });
});

// check the user's guess
function checkGuess() {
    // get the user's guess to compare it
    var userInput = document.getElementById('userGuess').value;

    userInput = userInput.trim();

    // sanitize user input with regex - get rid of all occurrences of any character that is not a letter or digit
    userInput = userInput.replace(/[^a-zA-Z0-9]/g, '');

    // if the answer is blank
    if (userInput == "") {
        return;
    }

    // fetch and display details for the guessed summoner (even if incorrect)
    // catches network errors, issues with the request, or errors within the server's response handling (input not found in db)
    fetch(`http://localhost:3000/getSummonerDetails?guessedSummoner=${userInput}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(guessedData => {
            // display to console 
            console.log('Guessed Summoner Details:', guessedData);

            // if the user is correct
            if (userInput === summoner) {
                guessDescription(guessedData);
                document.getElementById("win").style.display = "block";
                document.getElementById("guesses").style.display = "none";
                return;
            } 

            // display on the HTML
            guessDescription(guessedData);
        })
        .catch(error => {
            console.error('Error fetching summoner details:', error);
            return;
        });
}

// dynamically draw on the HTML page
function guessDescription(guessedData) {
    const guessesDiv = document.getElementById("guesses");
    const answersDiv = document.getElementById("answers");

    // check if it's the first row, and add descriptors above the columns
    if (answersDiv.childElementCount === 0) {
        const descriptorRow = document.createElement("div");
        descriptorRow.classList.add("descriptorRow");

        const descriptor = document.createElement("div");
        descriptor.classList.add("descriptor");
        descriptor.textContent = "(Hint Order: Team, Role, Country of Birth, Age)";

        // insert the descriptor row before the first row of user guesses
        guessesDiv.appendChild(descriptor);

        // add a horizontal line below descriptors
        const horizontalLine = document.createElement("hr");
        guessesDiv.appendChild(horizontalLine);
    }

    // create a row of boxes for the player's answer and hints in the HTML
    const answerRow = document.createElement("div");
    answerRow.classList.add("answerRow");

    // create playerName div
    const playerNameDiv = document.createElement("div");
    playerNameDiv.classList.add("playerName");
    playerNameDiv.textContent = guessedData.summoner;

    if (guessedData.summoner == summoner) {
        playerNameDiv.classList.add("right");
    } else {
        playerNameDiv.classList.add("empty");
    }

    // add that to the answerRow div
    answerRow.appendChild(playerNameDiv);

    // create and add hint divs 
    answerRow.appendChild(createHintDiv(guessedData.team, team, guessedData));
    answerRow.appendChild(createHintDiv(guessedData.role, role, guessedData));
    answerRow.appendChild(createHintDiv(guessedData.country, country, guessedData));
    answerRow.appendChild(createHintDiv(guessedData.birthday, birthday, guessedData));

    // append the answerRow to the to of the answers div
    answersDiv.insertBefore(answerRow, answersDiv.firstChild);

    // update the height of the answers div and the margin of the foot items based on the number of rows (to not block the content below it)
    answersDiv.style.height = answersDiv.scrollHeight + "px";

    const footDiv = document.querySelector(".foot");
    footDiv.style.marginTop = answersDiv.scrollHeight + "px";

    // clear the input field to prep for next input
    document.getElementById("userGuess").value = "";
}

// create a hint div
function createHintDiv(value, expectedValue, guessedData) {
    const hintDiv = document.createElement("div");
    hintDiv.classList.add("hint");

    // Check if the value is a birthday
    if (isBirthday(value) && isBirthday(expectedValue)) {
        // Extract the birth year from the string, or use NaN if not present
        const guessedYear = extractYear(value);
        const expectedYear = extractYear(expectedValue);

        // Compare years and update the div content and classes
        if (!isNaN(guessedYear) && !isNaN(expectedYear)) {
            if (guessedYear > expectedYear) {
                hintDiv.textContent = `${guessedData.summoner} is Younger`;
                hintDiv.classList.add("wrong");
            } else if (guessedYear < expectedYear) {
                hintDiv.textContent = `${guessedData.summoner} is Older`;
                hintDiv.classList.add("wrong");
            } else {
                hintDiv.textContent = "Same Age";
                hintDiv.classList.add("right");
            }
        } else {
            hintDiv.textContent = "Cannot Determine";
            hintDiv.classList.add("wrong");
        }
    } else {
        // For non-birthday values, use the original logic
        hintDiv.textContent = value;
        hintDiv.classList.add(value === expectedValue ? "right" : "wrong");
    }

    return hintDiv;
}

// Helper function to check if a value represents a birthday
function isBirthday(value) {
    return /\w+ \d{1,2}, \d{4} \(age \d+\)/.test(value);
}

// Helper function to extract the year from a birthday string
function extractYear(birthdayString) {
    const match = birthdayString.match(/\d{4}/);
    return match ? parseInt(match[0]) : NaN;
}

// reset the page
function reset() {
    // close the popup with id "win"
    document.getElementById("win").style.display = "none";

    // refresh the page
    location.reload();
}