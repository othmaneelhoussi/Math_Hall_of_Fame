/* Othmane El Houssi (oe2196)*/

let currentFlashid = 0;
let randomMath = [];

function loadFlashcards() {
    $.ajax({
        type: "GET",
        url: "/get_random_mathematicians",
        dataType: "json",
        success: function(data) {
            randomMath = data["random"];
            if (randomMath.length > 0) {
                currentFlashcard();
            }
        },
        error: function () {
            console.log("Error loading flashcards.");
        }
    });
}


function currentFlashcard() {
    let container = $("#flashcard-container");
    container.empty();
    if (randomMath.length === 0) {
        container.append("<p>No flashcards available.</p>");
        return;
    }
    let math = randomMath[currentFlashid];
    let card = `
        <div class="flashcard mb-3">
            <img src="/static/${math.image}" alt="${math.name}">
            <div>
                <h4><a href="/view/${math.id}">${math.name} (${math.birth_year})<a></h4>
                <p>${math.small_bio}</p>
            </div>
        </div>`;
    container.append(card);
}

$(document).ready(function () {
    loadFlashcards();
    $("#searchInput").focus();

    $("#next-flashcard").click(function () {
        currentFlashid = (currentFlashid + 1) % randomMath.length;
        currentFlashcard();
    });
    
    $("#searchForm").submit(function (event) {
        event.preventDefault();  // Prevent the default form submission
        
        let keywords = $("#searchInput").val().trim();
        
        if (keywords !== "") {
            let Url = '/search/' + encodeURIComponent(keywords);
            $(this).attr('action', Url);
            window.location.href = Url;
        } else {
            $("#resultsList").empty();
            $("#searchInput").focus();
        }
    });
});
