jQuery(document).ready(function ($) {
    // Your JavaScript code goes here
    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone"
    });

    $(".section").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            if (event.target.id === "section1" && ui.helper.attr("id") !== "item") {
                $(this).append(ui.helper.clone());
                $(this).children().last().attr("id", "item");
            }
        }
    });

    $("#section1").on("click", "#item", function () {
        checkOverlap();
        $(this).draggable({
            revert: "invalid"
        });
    });

    function checkOverlap() {
        var items = $("#section1").children(".draggable");

        for (var i = 0; i < items.length; i++) {
            for (var j = i + 1; j < items.length; j++) {
                if (isOverlapping($(items[i]), $(items[j]))) {
                    // Handle overlapping items here
                    // console.log("Item " + i + " and Item " + j + " overlap");
                    // // You can perform actions such as removing one of the overlapping items
                    // $(items[j]).remove();
                    // if overlapped then dropback to original position
                    // select item position 
                    // get the  previous position of the item[j] then drop it back to the previous position
                    const originalPosition = $(items[i]).data("originalPosition");
                    $(items[i]).offset(originalPosition);
                }
            }
        }
    }

    // Function to check if two elements overlap
    function isOverlapping(element1, element2) {
        var rect1 = element1[0].getBoundingClientRect();
        var rect2 = element2[0].getBoundingClientRect();

        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    setInterval(function () {
        checkOverlap(); // Check for overlaps periodically
    }, 1000); // Adjust the interval (in milliseconds) according to your needs

    // Populate the dropdown with color options
    const attributesDropdown = $('#attributes');
    const section2 = $('#section2');

    WP_ATTRIBUTES.pa_color.values.forEach(color => {
        attributesDropdown.append('<option value="' + color.toLowerCase() + '">' + color + '</option>');
    });

    // Listen for change event on the dropdown
    attributesDropdown.change(function () {
        const selectedColor = $(this).val();

        // Clear the existing images
        section2.empty();

        // Filter and append images corresponding to the selected color
        for (const product of WP_PRODUCTS) {
            // Iterate through each variation in the current product
            for (const variation of product.variations) {
                // Access the image property of the current variation
                const imageSrc = variation.image;
                console.log(selectedColor);
                if (selectedColor === variation.attributes.attribute_pa_color) {
                    console.log(imageSrc);
                    // Append the image to the section
                    section2.append('<div class="draggable"><img src="' + imageSrc + '" alt="Product Image" style="height: 70px;" class="draggable" /></div>');
                }
            }
        }

        // Make the new images draggable
        $(".draggable").draggable({
            revert: "invalid",
            helper: "clone",
            start: function (event, ui) {
                $(this).data("top", ui.position.top);
                $(this).data("left", ui.position.left);
            }
        });
    });

    function saveSectionState() {
        const section1Items = [];

        // Iterate through each draggable item in section1 and store relevant data
        $("#section1 .draggable").each(function () {
            const position = $(this).position();
            const itemId = $(this).attr("id");

            section1Items.push({
                id: itemId,
                top: position.top,
                left: position.left
            });
        });

        // Save the state in localStorage
        localStorage.setItem("section1State", JSON.stringify(section1Items));
    }

    // Function to load the state of section1
    function loadSectionState() {
        // Retrieve the saved state from localStorage
        const savedState = localStorage.getItem("section1State");

        if (savedState) {
            // Parse the JSON and iterate through each item to recreate the state
            const section1Items = JSON.parse(savedState);
            for (const item of section1Items) {
                const newItem = $('<div class="draggable" id="' + item.id + '">Item</div>');
                newItem.css({
                    top: item.top + "px",
                    left: item.left + "px",
                    position: "absolute"
                });
                $("#section1").append(newItem);
                newItem.draggable({
                    revert: "invalid",
                    helper: "clone",
                    start: function (event, ui) {
                        $(this).data("originalPosition", ui.helper.offset());
                    }
                });
            }
        }
    }

    // Save the section1 state on page unload
    $(window).on('beforeunload', function () {
        saveSectionState();
    });

    // Load the section1 state on page load
    loadSectionState();











        // board and Tool config
        const boardConfiguration = document.getElementById('boardconfig');
        const boardConfigdiv = document.getElementById('boardconfig-div');
        const toolConfiguration = document.getElementById('toolconfig');
        const toolConfigdiv = document.getElementById('tool-config-div');




        // Toolbank (tool /Hardware)
        const toolbank_button = document.getElementById('toolbank-button');
        const hardwarebank_button = document.getElementById('hardwarebank-button');
        const toolbank_div = document.getElementById('toolbank-div');
        const hardwarebank_div = document.getElementById('hardwarebank-div');



// Color and upload background
        const colorbutton_config = document.getElementById('colorbutton_config');
        const filebutton_config = document.getElementById('filebutton_config');
        const colorInput_config = document.getElementById('colorInput_config');
        const fileInput_config = document.getElementById('fileInput_config');








        // Add a click event listener to boardConfiguration
        boardConfiguration.addEventListener('click', function () {
            toolConfigdiv.classList.add('d-none');
            boardConfigdiv.classList.remove("d-none")
            boardConfiguration.classList.add('active-button');
            toolConfiguration.classList.remove('active-button'); 
        });



        // Add a click event listener to toolConfiguration
        toolConfiguration.addEventListener('click', function () {
            toolConfigdiv.classList.remove('d-none');
            boardConfigdiv.classList.add("d-none")
            toolConfiguration.classList.add('active-button');
            boardConfiguration.classList.remove('active-button');


        });


         // Add a click event listener to Tool bank
         toolbank_button.addEventListener('click', function () {
            hardwarebank_div.classList.add('d-none');
            toolbank_div.classList.remove("d-none")
            toolbank_button.classList.add('active-button');
            hardwarebank_button.classList.remove('active-button');
        });


        // Add a click event listener to Hardware bank
        hardwarebank_button.addEventListener('click', function () {
            hardwarebank_div.classList.remove('d-none');
            toolbank_div.classList.add("d-none")
            toolbank_button.classList.remove('active-button');
            hardwarebank_button.classList.add('active-button');
        });





        // Add a click event listener to Solid color Button
        colorbutton_config.addEventListener('click', function () {
            fileInput_config.classList.add('d-none');
            colorInput_config.classList.remove("d-none")
            colorbutton_config.classList.add('active-button');
            filebutton_config.classList.remove('active-button');
        });


        // Add a click event listener to Upload Background Button
        filebutton_config.addEventListener('click', function () {
            fileInput_config.classList.remove('d-none');
            colorInput_config.classList.add("d-none")
            colorbutton_config.classList.remove('active-button');
            filebutton_config.classList.add('active-button');
         });





    
});





