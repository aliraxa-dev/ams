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

var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function calculateDimensions(screenWidth, screenHeight, widthPercentage, heightPercentage) {
    var widthInPixels = screenWidth * (widthPercentage / 120);
    var heightInPixels = screenHeight * (heightPercentage / 120);

    return { width: widthInPixels, height: heightInPixels };
}

function calculateImageDimensions(widthPercentage, heightPercentage) {
    var widthInPixels = widthPercentage * (screenWidth / 100);
    var heightInPixels = heightPercentage * (screenHeight / 100);

    return { width: widthInPixels, height: heightInPixels };
}

// Example usage:





    $(".cloneable-items").draggable({
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
                var sourceSection = ui.draggable.closest(".section").attr("id");
    
                if (event.target.id === "section1" && sourceSection !== "section1") {
                    console.log("Item dropped in section 1");
                    $(this).append(ui.helper.clone());
                    $(this).children().last().attr("class", "item draggable");
                } else if (event.target.id === "section1" && sourceSection === "section1") {
                    console.log("Item dragged within section 1");
                    $(this).append(ui.draggable);
                    $(this).children().last().attr("class", "item draggable");
                }
            }
        });
    }
    

    $("#section1").on("click", ".item", function () {
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
        saveSectionState();
    }, 1000);

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
            // get the height of the image
            const height = $(this).height();

            section1Items.push({
                id: itemId,
                top: position.top,
                left: position.left,
                image: image,
                height: height
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

        

        const board_dimensions = DB_DATA.board_dimensions.split('x');
        const widthPercentage = board_dimensions[0];
        const heightPercentage = board_dimensions[1];
        var dimensions = calculateDimensions(screenWidth, screenHeight, widthPercentage, heightPercentage);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');

        $('#set_board_title').text(DB_DATA.board_title);
        var section_color = $('#section1').css('background-color', DB_DATA.background_color);

        var color =  getBoardMaterial(DB_DATA.board_material);
        $('#section1').css('background-color', color);

        // set the local storage
        localStorage.setItem("DB_DATA", JSON.stringify(DB_DATA));

        const selectedColor = attributesDropdown.val();
        localStorage.setItem("selectedColor", selectedColor);
        localStorage.setItem("section1State", JSON.stringify(section1Items));
    }
    

    function getDataFromDb() {
        const board_id = window.location.search.split('=')[1];
        if (board_id !== 'new') {
            // get data from the database
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
                    const data = response[0];
                    const section1Items = JSON.parse(data.config_data.replace(/\\/g, ''));
                    const selectedColor = data.options;

                    $('#board_title').val(data.board_title);
                    $('#set_board_title').text(data.board_title);
                    $('#board_dimensions').val(data.board_dimensions);
                    $('#background_color').val(data.background_color);
                    $('#board_style').val(data.board_style);
                    $('#board_material').val(data.board_material);
                    $('#custom_logo').val(data.custom_logo);
                    $('#quantity_of_boards').val(data.quantity_of_boards);

                    // set the section1 witha and height based on the board dimensions
                    const board_dimensions = data.board_dimensions.split('x');
                    const board_width = board_dimensions[0];
                    const board_height = board_dimensions[1];
                    $('#section1').css('width', board_width + 'vw');
                    $('#section1').css('height', board_height + 'vh');

                    for (const item of section1Items) {
                        const newItem = $('<img src="' + item.image + '" alt="' + selectedColor + '" class="draggable" />');
                        newItem.css({
                            top: item.top + "px",
                            left: item.left + "px",
                            position: "absolute",
                            height: item.height + "px"
                        });
                        $("#section1").append(newItem);
                        newItem.draggable({
                            revert: "invalid",
                            helper: "original",
                        });
                    }

                    $('#attributes').val(selectedColor);

                    if (selectedColor) {
                        getVariationImage(selectedColor);
                    }
                    getBoardMaterial(data.board_material)
                },
                error: function (error) {
                    console.error('Error retrieving data:');
                }
            });
        }
    }

    function getVariationImage(color) {
        section2.empty();

        for (const product of WP_PRODUCTS) {
            for (const variation of product.variations) {
                const imageSrc = variation.image;
                const width = variation.width;
                const height = variation.height;
                var dimensions = calculateImageDimensions(parseInt(width) ?? 0, parseInt(height) ?? 0);

                if (color === variation.attributes.attribute_pa_color) {
                    section2.append('<img src="' + imageSrc + '" alt="' + color + '" class="draggable cloneable-items" style="height:' + (height * 96) + 'px;" />');
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
    let section1BackgroundColor;
    // Board Material Dropdown
    function getBoardMaterial(material) {
        const board_material = $('#board_material').val();
        const bg_color = $('#background_color').val();
        var section_color = $('#section1').css('background-color');
   
        console.log(board_material, section_color);
    
        // Default background color if the input is not valid hex color
        const defaultBackgroundColor = 'rgb(255, 255, 255)';
    
        if (section_color === 'rgb(255, 255, 255)' || section_color === '#ffffff') {
            switch (board_material) {
                case 'StorShield':
                case 'StorShield+':
                case 'StorLam':
                    section1BackgroundColor = defaultBackgroundColor;
                    break;
                case 'StorLaze':
                    // Stainless steel color
                    section1BackgroundColor = 'rgb(192, 192, 192)';
                    break;
                case 'StorClear':
                    // Transparent color
                    section1BackgroundColor = 'rgba(0, 0, 0, 0)';
                    break;
                default:
                    section1BackgroundColor = bg_color;
                    break;
            }
        } else {
            section1BackgroundColor = bg_color;
        }
        return section1BackgroundColor;
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
        const id = window.location.search.split('=')[1];
        const data = {
            action: 'update_configurator_data',
            section1Items: section1Items,
            color: color,
            data: DB_DATA,
            id: id
        };
        // console.log(data);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                console.log(response);
                if (window.location.search === '?board=new') {
                    // then replace the url text new with the id
                    window.history.replaceState({}, '', '?board=' + response);
                }
                console.log('Data updated successfully:');
            },
            error: function (error) {
                console.error('Error updating data:');
            }
        });
    }

    // function createNewBoard() {
    //     const ajaxurl = "wp-admin/admin-ajax.php"
    //     const section1Items = localStorage.getItem("section1State");
    //     const color = localStorage.getItem("selectedColor");
    //     DB_DATA.board_title = $('#board_title').val();
    //     DB_DATA.board_dimensions = $('#board_dimensions').val();
    //     DB_DATA.background_color = $('#background_color').val();
    //     DB_DATA.board_style = $('#board_style').val();
    //     DB_DATA.board_material = $('#board_material').val();
    //     DB_DATA.custom_logo = $('#custom_logo').val();
    //     DB_DATA.quantity_of_boards = $('#quantity_of_boards').val();
    //     const data = {
    //         action: 'create_new_board',
    //         section1Items: section1Items,
    //         color: color,
    //         data: DB_DATA
    //     };

    //     $.ajax({
    //         url: ajaxurl,
    //         type: 'POST',
    //         data: data,
    //         success: function (response) {
    //             console.log('New board created successfully:');
    //             console.log(response);
    //             window.location.href = window.location.href + '?board=' + response;
    //         },
    //         error: function (error) {
    //             console.error('Error creating new board:');
    //         }
    //     });
    // }



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
        // createNewBoard();
    } else {
        getDataFromDb();
    }
    allowDrop();
});
