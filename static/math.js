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

// Send form data using AJAX
function upload_new_math(formData) {
    $.ajax({
        url: "/add",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response.successful) {
                $("#add-entry-form")[0].reset();
                $("#name").focus();

                $('#successful-msg').append(
                    `<h3 class="text-center mb-4 color-green" id="item_successful">
                        Mathematician added successfully! 
                        <a class="text-center mb-4 color-green" href="/view/${response.id}">View</a>
                    </h3>`
                );
            } else {
                $('#error-messages').html('<p class="color-red">Error adding mathematician. Please try again.</p>');
            }
        },
        error: function () {
            $('#error-messages').html('<p class="color-red">An error occurred. Please try again.</p>');
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

    $("#add-entry-form").submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        $('#error-messages').html('');
        let isValid = true;
        let errorMessages = [];
        let formData = new FormData(this); // Collect form data including file uploads

        // Validate Name
        let name = $('#name').val().trim();
        if (name === '') {
            isValid = false;
            errorMessages.push('Name is required.');
            $('#name').css('border', '1px solid red');
            $('#name').focus();
        } else {
            $('#name').css('border', '');
        }

        // Validate Birth Year
        let birthYear = $('#birth_year').val().trim();
        if (birthYear === '') {
            isValid = false;
            errorMessages.push('Birth Year is required.');
            $('#birth_year').css('border', '1px solid red');
        } else if (isNaN(birthYear)) {
            isValid = false;
            errorMessages.push('Birth Year must be a number.');
            $('#birth_year').css('border', '1px solid red');
            $('#birth_year').focus();
        } else {
            $('#birth_year').css('border', '');
        }

        // Validate Small Bio
        let smallBio = $('#small_bio').val().trim();
        if (smallBio === '') {
            isValid = false;
            errorMessages.push('Description is required.');
            $('#small_bio').css('border', '1px solid red');
            $('#small_bio').focus();
        } else {
            $('#small_bio').css('border', '');
        }

        // Validate Contributions
        let contributions = $('#contributions').val().trim();
        if (contributions === '') {
            isValid = false;
            errorMessages.push('Contributions are required.');
            $('#contributions').css('border', '1px solid red');
            $('#contributions').focus();
        } else {
            $('#contributions').css('border', '');
        }

        // Show errors if invalid
        if (!isValid) {
            errorMessages.forEach(function (message) {
                $('#error-messages').append('<p class="color-red">' + message + '</p>');
            });
            return;
        }

        // Submit via AJAX
        upload_new_math(formData);
    });
});
