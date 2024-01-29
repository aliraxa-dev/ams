jQuery(document).ready(function ($) {

var DB_DATA = {
    board_title: '',
    title_position: '',
    title_bg_color: '',
    board_dimensions: '',
    background_color: '',
    background_url: '',
    board_style: '',
    board_material: '',
    custom_logo: '',
    quantity_of_boards: '',
}

var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const attributesDropdown = $('#attributes');
const section2 = $('#section2');

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

$(".cloneable-items").draggable({
    revert: "invalid",
    helper: "clone",
    start: function (event, ui) {
        $(this).data("originalPosition", ui.helper.offset());
    },
    drag: function (event, ui) {
        var section1 = $("#section1");
        var containmentLeft = section1.offset().left;
        var containmentTop = section1.offset().top;
        var containmentRight = containmentLeft + section1.width() - $(this).width();
        var containmentBottom = containmentTop + section1.height() - $(this).height();

        ui.position.left = Math.min(Math.max(ui.position.left, containmentLeft), containmentRight);
        ui.position.top = Math.min(Math.max(ui.position.top, containmentTop), containmentBottom);

        updateDatabase();
    },

});

// function allowDrop() {
//     $(".section").droppable({
//         accept: ".draggable",
//         drop: function (event, ui) {
//             var sourceSection = ui.draggable.closest(".section").attr("id");
            

//             if (event.target.id === "section1" && sourceSection !== "section1") {
//                 console.log("Item dropped in section 1");
//                 $(this).append(ui.helper.clone());
//                 $(this).children().last().attr("class", "item draggable");
//                 const closeButton = $('.close-button');
//                 closeButton.css({
//                     display: "block",
//                 });
//             } else if (event.target.id === "section1" && sourceSection === "section1") {
//                 console.log("Item dragged within section 1");
//                 $(this).append(ui.draggable);
//                 $(this).children().last().attr("class", "item draggable");
//                 const closeButton = $('.close-button');
//                 closeButton.css({
//                     display: "block",
//                 });
//             }

//             updateDatabase();
//         },
//     });
// }
function allowDrop() {
    $(".section").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            var sourceSection = ui.draggable.closest(".section").attr("id");

            // Create a draggable container
            const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative;"></div>');
            $(this).append(draggableContainer);

            if (event.target.id === "section1" && sourceSection !== "section1") {
                console.log("Item dropped in section 1");
                const $clone = ui.helper.clone();
                draggableContainer.append($clone);
                $clone.attr("class", "item draggable");

                // Show the close button
                const closeButton = $('<span class="close-button">X</span>');
                draggableContainer.append(closeButton);

                // Set the position of the close button relative to the cloned item
                closeButton.css({
                    top: ui.position.top + "px",
                    left: ui.position.left + "px",
                    position: "absolute",
                    display: "block",
                });

                closeButton.click(function () {
                    draggableContainer.remove();
                    updateDatabase();
                });
            } else if (event.target.id === "section1" && sourceSection === "section1") {
                console.log("Item dragged within section 1");
                const existingContainer = ui.draggable.closest(".draggable-container");
                draggableContainer.append(ui.draggable);

                // Move the existing close button along with the item
                const closeButton = existingContainer.find('.close-button');
                existingContainer.remove(); // Remove the old container

                draggableContainer.append(closeButton);

                // Set the position of the close button relative to the dragged item
                closeButton.css({
                    top: ui.position.top + "px",
                    left: ui.position.left + "px",
                    position: "absolute",
                    display: "block",
                });

                ui.draggable.attr("class", "item draggable");
                closeButton.click(function () {
                    draggableContainer.remove();
                    updateDatabase();
                });
            }
            updateDatabase();
        },
    });
}



$("#section1").on("click", ".item", function () {
    checkOverlap();
    $(this).draggable({
        revert: "invalid",
        helper: "original",
        start: function (event, ui) {
            $(this).data("originalPosition", ui.helper.offset());
        },
        drag: function (event, ui) {
            updateDatabase();
        }
    });
});

function checkOverlap() {
    var items = $("#section1").children(".draggable");
    for (var i = 0; i < items.length; i++) {
        for (var j = i + 1; j < items.length; j++) {
            if (isOverlapping($(items[i]), $(items[j]))) {
                console.log("Item " + i + " and Item " + j + " overlap");
                $(items[i]).remove();
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
    checkOverlap();
    saveSectionState();
}, 1000);



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
    DB_DATA.title_position = $('#title_position').val();
    DB_DATA.board_dimensions = $('#board_dimensions').val();
    DB_DATA.background_color = $('#background_color').val();
    DB_DATA.board_style = $('#board_style').val();
    DB_DATA.board_material = $('#board_material').val();
    DB_DATA.custom_logo = $('#custom_logo').val();
    DB_DATA.quantity_of_boards = $('#quantity_of_boards').val();

    const board_dimensions_value = $('#board_dimensions').val();
    if (board_dimensions_value !== 'custom') {
        const board_dimensions = DB_DATA.board_dimensions.split('x');
        const widthPercentage = board_dimensions[0];
        const heightPercentage = board_dimensions[1];
        var dimensions = calculateDimensions(screenWidth, screenHeight, widthPercentage, heightPercentage);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
    } else {
        $('#custom_board_dimensions').css('display', 'flex');
    }

    $('#set_board_title').text(DB_DATA.board_title);
    var section_color = $('#section1').css('background-color', DB_DATA.background_color);

    var color =  getBoardMaterial(DB_DATA.board_material);
    $('#section1').css('background-color', color);

    const title_bg_color = $('#title_bg_color').val();
    $('#title_background_color').css('background-color', title_bg_color);

    localStorage.setItem("title_bg_color", title_bg_color);

    updateTitlePosition();
    updateLogoPosition();

    const selectedColor = attributesDropdown.val();
    localStorage.setItem("selectedColor", selectedColor);
    localStorage.setItem("section1State", JSON.stringify(section1Items));
    localStorage.setItem("DB_DATA", JSON.stringify(DB_DATA));
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
                $('#title_position').val(data.title_position);
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

                // for (const item of section1Items) {
                //     const newItem = $('<img src="' + item.image + '" alt="' + selectedColor + '" class="draggable" />');
                //     newItem.css({
                //         top: item.top + "px",
                //         left: item.left + "px",
                //         position: "absolute",
                //         height: item.height + "px"
                //     });
                //     $("#section1").append(newItem);
                //     newItem.draggable({
                //         revert: "invalid",
                //         helper: "original",
                //     });
                // }

                for (const item of section1Items) {
                    const newItem = $('<div class="draggable-container"></div>');
                    const newImage = $('<img src="' + item.image + '" alt="' + selectedColor + '" class="draggable" />');
                    const closeButton = $('<span class="close-button">X</span>');
                
                    // Append the image and close button to the container
                    newItem.append(newImage, closeButton);
                
                    newImage.css({
                        top: item.top + "px",
                        left: item.left + "px",
                        position: "absolute",
                        height: item.height + "px",
                    });

                    closeButton.css({
                        top: item.top + "px",
                        left: item.left + "px",
                        position: "absolute",
                        display: "block",
                    });
                
                    $("#section1").append(newItem);
                
                    // Make the container draggable
                    newItem.draggable({
                        revert: "invalid",
                        helper: "original",
                    });
                
                    // Make the close button clickable
                    closeButton.click(function() {
                        newItem.remove();
                    });
                }

                $('#attributes').val(selectedColor);

                if (selectedColor) {
                    getVariationImage(selectedColor);
                }
                getBoardMaterial(data.board_material)

                // get the logo url from the database
                const logo_url = data.logo_url;
                if (logo_url) {
                    $('#section1_logo').attr('src', logo_url);
                }

                // get the background image url from the database
                const background_url = data.background_url;
                if (background_url) {
                    $('#section1').css('background-image', 'url(' + background_url + ')');
                    $('#section1').css('background-size', 'cover');
                    $('#section1').css('background-repeat', 'no-repeat');
                }

                const board_dimensions_options = $('#board_dimensions').children();

                for (const option of board_dimensions_options) {
                    const option_value = option.value;
                    if (option_value === data.board_dimensions && option_value !== 'custom') {
                        $('#board_dimensions').val(data.board_dimensions);
                    } else if (option_value === 'custom') {
                        $('#board_dimensions').append('<option value="' + data.board_dimensions + '">' + data.board_dimensions + '</option>');
                        $('#board_dimensions').val(data.board_dimensions);
                    }
                }

                const title_bg_color = data.title_bg_color;
                $('#title_bg_color').val(title_bg_color);

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
    DB_DATA.title_position = $('#title_position').val();
    DB_DATA.title_bg_color = $('#title_bg_color').val();
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
            if (window.location.search === '?board=new') {
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

$('#logo_images').on('change', function() {
    var fileInput = this;
    var file = fileInput.files[0];
    console.log(file);

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var formData = new FormData();
            formData.append('action', 'handle_logo_upload');
            formData.append('logo_images', file);
            formData.append('board_id', window.location.search.split('=')[1]);

            $.ajax({
                type: 'POST',
                url: amerison_vars.ajaxurl,
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                localStorage.setItem("logo_url", response.url);
                $('#section1_logo').attr('src', response.url);

                // if (response.attachment_id !== 0) {
                //     // Display the uploaded image in the specified section
                //     var imageContainer = $('#section1');

                //     // Create an img element
                //     var imgElement = $('<img>', {
                //         src: response.url,
                //         alt: 'Uploaded Logo',
                //         class: 'logo__image',
                //     });

                //     // Empty the section and append the img element
                //     imageContainer.empty().append(imgElement);
                // } else {
                //     // Handle error cases
                //     console.error(response.error);
                // }
                },
                error: function(error) {
                    console.error(error);
                }
            });
        };

        reader.readAsBinaryString(file);
    }
});

$('#background-image-upload').on('change', function() {
    var fileInput = this;
    var file = fileInput.files[0];
    console.log(file);

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var formData = new FormData();
            formData.append('action', 'handle_background_upload');
            formData.append('background-image-upload', file);
            formData.append('board_id', window.location.search.split('=')[1]);

            $.ajax({
                type: 'POST',
                url: amerison_vars.ajaxurl,
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                localStorage.setItem("background_upload", response.url);
                $('#section1').css('background-image', 'url(' + response.url + ')');
                $('#section1').css('background-size', 'cover');
                $('#section1').css('background-repeat', 'no-repeat');
                },
                error: function(error) {
                    console.error(error);
                }
            });
        };

        reader.readAsBinaryString(file);
    }
});

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
});

$(window).on('beforeunload', function () {
    saveSectionState();
});

$('#board_title, #title_position, #title_bg_color, #board_dimensions, #background_color, #board_style, #board_material, #custom_logo, #quantity_of_boards').on('change', function() {
    updateDatabase();
});

$('#title_position').on('change', function() {
    updateTitlePosition();
});

$('#custom_logo').on('change', function() {
    updateLogoPosition();
});

function updateLogoPosition() {
    const dimentions = $('#board_dimensions').val();
    const board_dimensions = dimentions.split('x');
    const board_width = board_dimensions[0];
    const board_height = board_dimensions[1];

    let logoPosition = $('#custom_logo').val();
    if (logoPosition === 'right') {
        $('#section1_logo').css('margin-left', 'calc(' + board_width + 'vw - 230px)');
        $('#section1_logo').css('margin-top', '0px');

    } else if (logoPosition === 'left') {
        $('#section1_logo').css('float', 'inline-start');
        $('#section1_logo').css('margin-left', '0px');
        $('#section1_logo').css('margin-top', '0px');
    } else if (logoPosition === 'center') {
        $('#section1_logo').css('float', 'inline-start');
        $('#section1_logo').css('margin-left', 'calc(' + board_width + 'vw / 2 - 50px)');
        $('#section1_logo').css('margin-top', 'calc(' + board_height + 'vh / 2 - 50px)');
    }
}

function updateTitlePosition() {
    const dimentions = $('#board_dimensions').val();
    const board_dimensions = dimentions.split('x');
    const board_width = board_dimensions[0];
    const board_height = board_dimensions[1];

    let logoPosition = $('#title_position').val();
    if (logoPosition === 'right') {
        $('#set_board_title').css('margin-left', 'calc(' + board_width + 'vw - 150px)');
        $('#set_board_title').css('margin-top', '0px');
    } else if (logoPosition === 'left') {
        $('#set_board_title').css('float', 'inline-start');
        $('#set_board_title').css('margin-left', '0px');
        $('#set_board_title').css('margin-top', '0px');
    } else if (logoPosition === 'center') {
        $('#set_board_title').css('float', 'inline-start');
        $('#set_board_title').css('margin-left', 'calc(' + board_width + 'vw / 2 - 50px)');
        $('#set_board_title').css('margin-top', '0px');
    }
}

$('#clear-background-image').on('click', function() {
    localStorage.removeItem("background_upload");
    $('#section1').css('background-image', 'none');
    clearlinksFromDb('background_url');
});
$('#clear-logo-image').on('click', function() {
    localStorage.removeItem("logo_url");
    $('#section1_logo').attr('src', '');
    clearlinksFromDb('logo_url');
});

$('#reset_board').on('click', function() {
    $('#confirmationModal').modal('show');
    console.log('reset board clicked');
});

$("#confirmReset").on('click', function () {
    $('#confirmationModal').modal('hide');
    // localStorage.clear();
    console.log('reset board confirmed');
    // remove items from the section1
    $('#section1').empty();
    const section1Data = `<div class="w-100" style="height: 50px" id="title_background_color"><div class="h5 pt-4 position-absolute" id="set_board_title"></div></div><img src="" alt="" class="section1_logo position-absolute" id="section1_logo">`;
    $('#section1').append(section1Data);
    clearLocalStorage();
    resetBoard();
});

$(".closeModel").on('click', function () {
    $('#confirmationModal').modal('hide');
    console.log('reset board cancelled');
});

function clearLocalStorage() {
    $('#board_title').val('');
    $('#set_board_title').text('');
    $('#title_bg_color').val('#ffffff');
    $('#title_position').val('left');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#ffffff');
    $('#board_style').val("null");
    $('#board_material').val("null");
    $('#custom_logo').val('left');
    $('#quantity_of_boards').val(0);
    $('#section1').css('background-image', 'none');
    $('#section1_logo').attr('src', '');
    $('#section1').css('background-color', '#ffffff');
    $('#attributes').val("null");

    localStorage.removeItem("section1State");
    localStorage.removeItem("selectedColor");
    localStorage.removeItem("background_upload");
    localStorage.removeItem("logo_url");
    localStorage.removeItem("DB_DATA");
    localStorage.removeItem("custom_board_dimensions");
    localStorage.removeItem("title_bg_color");
}

function resetBoard() {
    const board_id = window.location.search.split('=')[1];
    const data = {
        action: 'resetBoard',
        board_id: board_id
    };
    $.ajax({
        url: 'wp-admin/admin-ajax.php',
        type: 'POST',
        data: data,
        success: function (response) {
            updateDatabase();
            console.log('Board reset successfully:');
        },
        error: function (error) {
            console.error('Error retrieving data:');
        }
    });
}



function clearlinksFromDb(value) {
    const board_id = window.location.search.split('=')[1];
    const data = {
        action: 'clearLinksFromDb',
        value: value,
        board_id: board_id
    };
    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: data,
        success: function (response) {
            console.log('Data retrieved successfully:');
        },
        error: function (error) {
            console.error('Error retrieving data:');
        }
    });
}

// when user select custom board dimentions option then add display block to the custom board dimentions input
$('#board_dimensions').on('change', function() {
    const board_dimensions = $('#board_dimensions').val();
    if (board_dimensions === 'custom') {
        $('#custom_board_dimensions').css('display', 'flex');
        $('#dimentionConfirmationModal').modal('show');
    } else {
        $('#custom_board_dimensions').css('display', 'none');
    }
});

$('#dimentionConfirm').on('click', function() {
    $('#dimentionConfirmationModal').modal('hide');
});

$('.close-button').on('click', function() {
    $(this).parent().remove();
    updateDatabase();
});

$('.custom_values').on('change', function() {
    const board_width = $('#custom_width').val();
    const board_height = $('#custom_height').val();
    if (board_width && board_height) {
        var dimensions = calculateDimensions(screenWidth, screenHeight, board_width, board_height);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
        // append new board dimentions to the board_dimensions dropdown
        $('#board_dimensions').append('<option value="' + board_width + 'x' + board_height + '">' + board_width + 'x' + board_height + '</option>');
        $('#board_dimensions').val(board_width + 'x' + board_height);
        localStorage.setItem("custom_board_dimensions", board_width + 'x' + board_height);
        updateDatabase();
    }
});




if (window.location.search === '?board=new') {
    // createNewBoard();
} else {
    getDataFromDb();
}
allowDrop();
});
