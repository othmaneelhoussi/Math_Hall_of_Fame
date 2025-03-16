/* Othmane El Houssi (oe2196)*/

let randomMath = [];

function loadFlashcards() {
    $.ajax({
        type: "GET",
        url: "/get_random_mathematicians",
        dataType: "json",
        success: function(data) {
            randomMath = data["random"];
            if (randomMath.length > 0) {
                currentFlashcards();
            }
        },
        error: function () {
            console.log("Error loading flashcards.");
        }
    });
}


function currentFlashcards() {
    let container = $("#flashcard-container");
    container.empty();
    if (randomMath.length === 0) {
        container.append("<p> No flashcards available.</p>");
        return;
    }
    randomMath.forEach(math => {
        let truncate_des = math.small_bio.length > 70 ? math.small_bio.substring(0, 70) + "..." : math.small_bio;
        
        let card = `
            <div class="flashcard mb-3 col-4">
                <a href="/view/${math.id}"><img src="/static/${math.image}" alt="${math.name}"></a>
                <div>
                    <h4><a href="/view/${math.id}">${math.name}</a></h4>
                    <p class="truncate">${truncate_des}</p>
                </div>
            </div>`;
        
        container.append(card);
    });
}

$(document).ready(function () {
    loadFlashcards();
    $("#searchInput").focus();

    currentFlashcards();
    
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
