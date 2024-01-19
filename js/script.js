jQuery(document).ready(function ($) {

var DB_DATA = {
    board_title: '',
    board_dimensions: '',
    background_color: '',
    board_style: '',
    board_material: '',
    custom_logo: '',
    quantity_of_boards: '',
}


    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone",
        start: function (event, ui) {
            // Store original position on drag start
            $(this).data("originalPosition", ui.helper.offset());
        },
        drag: function (event, ui) {
            updateDatabase();
        }
    });

    function allowDrop() {
        $(".section").droppable({
            accept: ".draggable",
            drop: function (event, ui) {
                if (event.target.id === "section1" && ui.helper.attr("id") !== "item") {
                    $(this).append(ui.helper.clone());
                    $(this).children().last().attr("id", "item");
                }
            }
        });
    }

    $("#section1").on("click", "#item", function () {
        checkOverlap();
        $(this).draggable({
            revert: "invalid",
            helper: "original", // Set helper to 'original' for non-cloned items
            start: function (event, ui) {
                // Store original position on drag start
                $(this).data("originalPosition", ui.helper.offset());
            }
        });
        updateDatabase();
    });

    function checkOverlap() {
        var items = $("#section1").children(".draggable");

        for (var i = 0; i < items.length; i++) {
            for (var j = i + 1; j < items.length; j++) {
                if (isOverlapping($(items[i]), $(items[j]))) {
                    // Handle overlapping items here
                    console.log("Item " + i + " and Item " + j + " overlap");
                    // You can perform actions such as removing one of the overlapping items
                    $(items[i]).remove();
                }
            }
        }
        // updateDatabase();
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
        // saveSectionState();
    }, 1000); // Adjust the interval (in milliseconds) according to your needs

    const attributesDropdown = $('#attributes');
    const section2 = $('#section2');

    WP_ATTRIBUTES.pa_color.values.forEach(color => {
        attributesDropdown.append('<option value="' + color.toLowerCase() + '">' + color + '</option>');
    });

    attributesDropdown.change(function () {
        const selectedColor = $(this).val();
        getVariationImage(selectedColor);
        updateDatabase();
    });

    function saveSectionState() {
        const section1Items = [];

        $("#section1 .draggable").each(function () {
            const position = $(this).position();
            const itemId = $(this).attr("id");
            const image = $(this).attr("src");

            section1Items.push({
                id: itemId,
                top: position.top,
                left: position.left,
                image: image
            });
        });

        // set the DB_DATA to the local storage
        DB_DATA.board_title = $('#board_title').val();
        DB_DATA.board_dimensions = $('#board_dimensions').val();
        DB_DATA.background_color = $('#background_color').val();
        DB_DATA.board_style = $('#board_style').val();
        DB_DATA.board_material = $('#board_material').val();
        DB_DATA.custom_logo = $('#custom_logo').val();
        DB_DATA.quantity_of_boards = $('#quantity_of_boards').val();
        console.log(DB_DATA);

        // set the local storage
        localStorage.setItem("DB_DATA", JSON.stringify(DB_DATA));

        const selectedColor = attributesDropdown.val();
        localStorage.setItem("selectedColor", selectedColor);

        localStorage.setItem("section1State", JSON.stringify(section1Items));
    }

    // if url has query ?board_id=new, then load the default board
    
    // function loadSectionState() {
    //     const savedState = localStorage.getItem("section1State");
    //     const selectedColor = localStorage.getItem("selectedColor");
    //     var DB_DATA = localStorage.getItem("DB_DATA");

    //     if (savedState) {
    //         const section1Items = JSON.parse(savedState);
    //         for (const item of section1Items) {
    //             const newItem = $('<img src="' + item.image + '" alt="' + selectedColor + '" class="draggable" />');
    //             newItem.css({
    //                 top: item.top + "px",
    //                 left: item.left + "px",
    //                 position: "absolute"
    //             });
    //             $("#section1").append(newItem);
    //             newItem.draggable({
    //                 revert: "invalid",
    //                 helper: "clone",
    //             });
    //         }
    //     }

    //     attributesDropdown.val(selectedColor);

    //     if (selectedColor) {
    //         getVariationImage(selectedColor);
    //     }

    //     DB_DATA = JSON.parse(DB_DATA);
    //     console.log(DB_DATA);
    //     $('#board_title').val(DB_DATA.board_title);
    //     $('#board_dimensions').val(DB_DATA.board_dimensions);
    //     $('#background_color').val(DB_DATA.background_color);
    //     $('#board_style').val(DB_DATA.board_style);
    //     $('#board_material').val(DB_DATA.board_material);
    //     $('#custom_logo').val(DB_DATA.custom_logo);
    //     $('#quantity_of_boards').val(DB_DATA.quantity_of_boards);
    // }

    function loadSectionState() {
        const board_id = window.location.search.split('=')[1];
        if (board_id !== 'new') {
            return;
        }
        // get data from database
        const ajaxurl = amerison_vars.ajaxurl;
        const data = {
            action: 'get_configurator_data',
            board_id: board_id
        };
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                console.log('Data retrieved successfully:');
                console.log(response);
                const section1Items = JSON.parse(response.section1Items);
                const selectedColor = response.color;
                const DB_DATA = response.data;
                console.log(DB_DATA);
                $('#board_title').val(DB_DATA.board_title);
                $('#board_dimensions').val(DB_DATA.board_dimensions);
                $('#background_color').val(DB_DATA.background_color);
                $('#board_style').val(DB_DATA.board_style);
                $('#board_material').val(DB_DATA.board_material);
                $('#custom_logo').val(DB_DATA.custom_logo);
                $('#quantity_of_boards').val(DB_DATA.quantity_of_boards);

                for (const item of section1Items) {
                    const newItem = $('<img src="' + item.image + '" alt="' + selectedColor + '" class="draggable" />');
                    newItem.css({
                        top: item.top + "px",
                        left: item.left + "px",
                        position: "absolute"
                    });
                    $("#section1").append(newItem);
                    newItem.draggable({
                        revert: "invalid",
                        helper: "clone",
                    });
                }

                attributesDropdown.val(selectedColor);

                if (selectedColor) {
                    getVariationImage(selectedColor);
                }
            },
            error: function (error) {
                console.error('Error retrieving data:');
            }
        });
    }


    function getVariationImage(color) {
        section2.empty();

        for (const product of WP_PRODUCTS) {
            for (const variation of product.variations) {
                const imageSrc = variation.image;
                if (color === variation.attributes.attribute_pa_color) {
                    section2.append('<img src="' + imageSrc + '" alt="' + color + '" class="draggable" />');
                }
            }
        }

        $(".draggable").draggable({
            revert: "invalid",
            helper: "clone",
            start: function (event, ui) {
                $(this).data("top", ui.position.top);
                $(this).data("left", ui.position.left);
            }
        });
    }

    function updateDatabase() {
        const section1Items = localStorage.getItem("section1State");
        const color = localStorage.getItem("selectedColor");
        const ajaxurl = amerison_vars.ajaxurl;
        DB_DATA.board_title = $('#board_title').val();
        DB_DATA.board_dimensions = $('#board_dimensions').val();
        DB_DATA.background_color = $('#background_color').val();
        DB_DATA.board_style = $('#board_style').val();
        DB_DATA.board_material = $('#board_material').val();
        DB_DATA.custom_logo = $('#custom_logo').val();
        DB_DATA.quantity_of_boards = $('#quantity_of_boards').val();
        console.log(DB_DATA);
        const data = {
            action: 'update_configurator_data',
            section1Items: section1Items,
            color: color,
            data: DB_DATA
        };
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                console.log('Data updated successfully:');
            },
            error: function (error) {
                console.error('Error updating data:');
            }
        });
    }



    var accordion = new bootstrap.Collapse(document.getElementById('collapseOne'), {
        toggle: false,
    });

    var otherAccordion = new bootstrap.Collapse(document.getElementById('collapseTwo'), {
        toggle: false,
    });

    // Handle 'hidden.bs.collapse' event for the first accordion
    $('#collapseOne').on('hidden.bs.collapse', function () {
        otherAccordion.show();
    });

    // Handle 'hidden.bs.collapse' event for the second accordion
    $('#collapseTwo').on('hidden.bs.collapse', function () {
        accordion.show();
    })


    // anything change in the section 1, update the database
    $("#section1 #section2").on("change", function () {
        updateDatabase();
    });



    $(window).on('beforeunload', function () {
        saveSectionState();
    });

    if (window.location.search === '?board=new') {
        // loadSectionState();
    } else {
        loadSectionState();
    }
    allowDrop();
});
