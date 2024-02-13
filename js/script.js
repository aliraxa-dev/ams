function touchHandler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
        {
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup",
        }[event.type],
        true,
        true,
        window,
        1,
        touch.screenX,
        touch.screenY,
        touch.clientX,
        touch.clientY,
        false,
        false,
        false,
        false,
        0,
        null
    );
    touch.target.dispatchEvent(simulatedEvent);
    // event.preventDefault();
}




// Initialize touch event handling
function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}



jQuery(document).ready(function ($) {

    init();

   // Disable scrolling during touchmove in section1
   $(".draggable").on('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

var boardProperties = {
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

const attributesDropdown = $('#attributes');
const section2 = $('#section2');

var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function applyZoomEffect(widthPercentage, heightPercentage) {
    var widthInPixels = screenWidth * (widthPercentage / 120);
    var heightInPixels = screenHeight * (heightPercentage / 120);

    return { width: widthInPixels, height: heightInPixels };
}

function adjustChildSize(w,h) {
    const parentWidth = $('#left_section')[0].offsetWidth / 96;
    const parentHeight = $('#left_section')[0].offsetHeight / 96;

    const childWidth = w;
    const childHeight = h;

    if (childWidth > parentWidth || childHeight > parentHeight) {
        const scaleFactor = Math.min(parentWidth / childWidth, parentHeight / childHeight);

        var new_w = (childWidth / scaleFactor) / 96;
        var new_h = (childHeight / scaleFactor) / 96;
    } else {
        var new_w = childWidth;
        var new_h = childHeight;
    }
    return { width: new_w, height: new_h };
}

// Call the adjustChildSize function whenever the dimensions of the child div change
// window.addEventListener('resize', adjustChildSize);


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

function allowDrop() {
    $(".section").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            var sourceSection = ui.draggable.closest(".section").attr("id");

            const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative;"></div>');
            $(this).append(draggableContainer);

            if (event.target.id === "section1" && sourceSection !== "section1") {
                console.log("Item dropped in section 1");
                const $clone = ui.helper.clone();
                $clone.css({
                    top: ui.position.top + "px",
                    left: (ui.position.left + 800) + "px",
                    position: "absolute",
                });
                draggableContainer.append($clone);
                $clone.attr("class", "item draggable");

                // Show the close button
                const closeButton = $('<span class="close-button">X</span>');
                draggableContainer.append(closeButton);

                // Set the position of the close button relative to the cloned item
                closeButton.css({
                    top: (ui.position.top - 100) + "px",
                    left: (ui.position.left + 850) + "px",
                    position: "absolute",
                    // display: "none",
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
                    // display: "none",
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

 // Add click event for adding tools in mobile or tab view
 $("#section2").on("click", ".cloneable-items", function() {
    console.log("Item clicked");
    var section1 = $("#section1");
    // section1 left position
    var left = section1.offset().left;
    // section1 top position
    var top = section1.offset().top;
    // append the cloneable item to the section1
    const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative;"></div>');
    section1.append(draggableContainer);
    const $clone = $(this).clone();
    draggableContainer.append($clone);
    $clone.css({
        top: 0 + "px",
        left: left + "px",
        position: "absolute",
    });
    $clone.attr("class", "item draggable");
    // Show the close button
    const closeButton = $('<span class="close-button">X</span>');
    draggableContainer.append(closeButton);
    closeButton.css({
        top: 0 + "px",
        left: left + "px",
        position: "absolute",
        // display: "none",
    });

    updateDatabase();
});

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

    // set the boardProperties to the local storage
    boardProperties.board_title = $('#board_title').val();
    boardProperties.title_position = $('#title_position').val();
    boardProperties.board_dimensions = $('#board_dimensions').val();
    boardProperties.background_color = $('#background_color').val();
    boardProperties.board_style = $('#board_style').val();
    boardProperties.board_material = $('#board_material').val();
    boardProperties.custom_logo = $('#custom_logo').val();
    boardProperties.quantity_of_boards = $('#quantity_of_boards').val();

    const board_dimensions_value = $('#board_dimensions').val();
    if (board_dimensions_value !== 'custom' && boardProperties.board_dimensions != undefined) {
        const board_dimensions = boardProperties.board_dimensions.split('x');
        const widthPercentage = board_dimensions[0];
        const heightPercentage = board_dimensions[1];
        // var dimensions = applyZoomEffect( widthPercentage, heightPercentage);
        var dimensions = adjustChildSize( widthPercentage, heightPercentage);
        // adjustChildSize
        $('#section1').css('width', dimensions.width + 'in');
        $('#section1').css('height',  dimensions.height + 'in');
    } else {
        $('#custom_board_dimensions').css('display', 'flex');
    }

    $('#set_board_title').text(boardProperties.board_title);
    var section_color = $('#section1').css('background-color', boardProperties.background_color);

    var color =  getBoardMaterial(boardProperties.board_material);
    $('#section1').css('background-color', color);

    const title_bg_color = $('#title_bg_color').val();
    $('#title_background_color').css('background-color', title_bg_color);

    localStorage.setItem("title_bg_color", title_bg_color);

    updateTitlePosition();
    updateLogoPosition();

    const selectedColor = attributesDropdown.val();
    localStorage.setItem("selectedColor", selectedColor);
    localStorage.setItem("section1State", JSON.stringify(section1Items));
    localStorage.setItem("boardProperties", JSON.stringify(boardProperties));
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
                if (data != undefined) {
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
                    var dimensions = adjustChildSize( board_width, board_height);

                    $('#section1').css('width', dimensions.width + 'in');
                    $('#section1').css('height', dimensions.height + 'in');
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
                            // display: "block",
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
                        const parts = logo_url.split('/');
                        const imageName = parts[parts.length - 1];
                        $('#logo_name').text(imageName);
                    }

                    // get the background image url from the database
                    const background_url = data.background_url;
                    if (background_url) {
                        $('#section1').css('background-image', 'url(' + background_url + ')');
                        $('#section1').css('background-size', 'contain');
                        $('#section1').css('background-repeat', 'round');
                        const parts = background_url.split('/');
                        const imageName = parts[parts.length - 1];
                        $('#background_name').text(imageName);
                    }

                    const board_dimensions_options = $('#board_dimensions').children();

                    for (const option of board_dimensions_options) {
                        const option_value = option.value;
                        // console.log(option_value, data.board_dimensions);
                        if (option_value === data.board_dimensions && option_value !== 'custom') {
                            $('#board_dimensions').val(data.board_dimensions);
                        } else if (option_value === 'custom' && data.board_dimensions !== '24x72' && data.board_dimensions !== '36x72' && data.board_dimensions !== '48x72' ) {
                            $('#board_dimensions').append('<option value="' + data.board_dimensions + '">' + data.board_dimensions + '</option>');
                            $('#board_dimensions').val(data.board_dimensions);
                        }
                    }

                    const title_bg_color = data.title_bg_color;
                    $('#title_bg_color').val(title_bg_color);
                }

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
            var dimensions = adjustChildSize(parseInt(width) ?? 0, parseInt(height) ?? 0);

            if (color === variation.attributes.attribute_pa_color) {
                section2.append('<img src="' + imageSrc + '" alt="' + color + '" class="draggable cloneable-items" style="height:' + (dimensions.height) + 'in; width:' + (dimensions.width) + 'in;" />');
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
    boardProperties.board_title = $('#board_title').val();
    boardProperties.title_position = $('#title_position').val();
    boardProperties.title_bg_color = $('#title_bg_color').val();
    boardProperties.board_dimensions = $('#board_dimensions').val();
    boardProperties.background_color = $('#background_color').val();
    boardProperties.board_style = $('#board_style').val();
    boardProperties.board_material = $('#board_material').val();
    boardProperties.custom_logo = $('#custom_logo').val();
    boardProperties.quantity_of_boards = $('#quantity_of_boards').val();
    const id = window.location.search.split('=')[1];
    const data = {
        action: 'update_configurator_data',
        section1Items: section1Items,
        color: color,
        data: boardProperties,
        id: id
    };
    $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: data,
        success: function (response) {
            if (window.location.search === '?board=new') {
                window.history.replaceState({}, '', '?board=' + response);
            }
            console.log('Data updated successfully:');
            $('#dot_alert').css('display', 'block');
            setTimeout(function () {
                $('#dot_alert').css('display', 'none');
            }, 1000);
        },
        error: function (error) {
            console.error('Error updating data:');
            $('#dot_alert').css('display', 'block');
            $('#dot_alert').css('background-color', 'red');
            setTimeout(function () {
                $('#dot_alert').css('display', 'none');
            }, 1000);
        }
    });
}

$('#logo_images').on('change', function() {
    var fileInput = this;
    var file = fileInput.files[0];
    showPreloader();

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
                hidePreloader();
                },
                error: function(error) {
                    console.error(error);
                }
            });
        };

        reader.readAsBinaryString(file);
    }
});

$('#background_image_upload').on('change', function() {
    var fileInput = this;
    var file = fileInput.files[0];
    showPreloader();

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var formData = new FormData();
            formData.append('action', 'handle_background_upload');
            formData.append('background_image_upload', file);
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
                    hidePreloader();
                },
                error: function(error) {
                    console.error(error);
                }
            });
        };

        reader.readAsBinaryString(file);
    }
});

// Initialize the Bootstrap collapse instances
const collapseOne = $('#collapseOne');
const collapseTwo = $('#collapseTwo');
if (collapseOne.length) {
    var accordion = new bootstrap.Collapse(collapseOne, { toggle: false });
}
if (collapseTwo.length) {
    var otherAccordion = new bootstrap.Collapse(collapseTwo, { toggle: false });
}
// Handle 'hidden.bs.collapse' event for the first accordion
$('#collapseOne').on('hidden.bs.collapse', function () {
    if (!otherAccordion._isTransitioning) {
        otherAccordion.show();
    }
});

// Handle 'hidden.bs.collapse' event for the second accordion
$('#collapseTwo').on('hidden.bs.collapse', function () {
    if (!accordion._isTransitioning) {
        accordion.show();
    }
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
    if (dimentions != undefined) {
        const board_dimensions = dimentions.split('x');
        const board_width = board_dimensions[0];
        const board_height = board_dimensions[1];

        const dimensions = adjustChildSize(board_width, board_height);

        let logoPosition = $('#custom_logo').val();
        if (logoPosition === 'right') {
            $('#section1_logo').removeAttr('style');
            $('#section1_logo').css('position', 'absolute');
            // $('#section1_logo').css('float', 'inline-end');
            $('#section1_logo').css('top', '' +1+'%');
            $('#section1_logo').css('left', '' + (dimensions.width - 0.4) +'in');

        } else if (logoPosition === 'left') {
            $('#section1_logo').removeAttr('style');
            $('#section1_logo').css('position', 'absolute');
            $('#section1_logo').css('float', 'inline-start');
            $('#section1_logo').css('top', '' + 1 +'%');
            // $('#section1_logo').css('left', '' + 15+'in');
        } else if (logoPosition === 'center') {
            $('#section1_logo').removeAttr('style');
            $('#section1_logo').css('position', 'absolute');
            $('#section1_logo').css('float', 'inline-start');
            $('#section1_logo').css('top', '' + (dimensions.height/2) +'in');
            $('#section1_logo').css('left', '' + (dimensions.width/2) +'in');
        }
    }
}

function updateTitlePosition() {
    const dimentions = $('#board_dimensions').val();
    if (dimentions != undefined) {
        const board_dimensions = dimentions.split('x');
        const board_width = board_dimensions[0];
        const board_height = board_dimensions[1];

        // get the width of board title
        const board_title_width = $('#set_board_title').width();

        const dimensions = adjustChildSize(board_width, board_height);

        let logoPosition = $('#title_position').val();
        if (logoPosition === 'right') {
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('float', 'inline-end');
            // $('#set_board_title').css('margin-left', 'calc(' + board_width + 'vw - 150px)');
            // $('#set_board_title').css('margin-top', '0px');
        } else if (logoPosition === 'left') {
            // remove all the inline styles
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('float', 'inline-start');
        } else if (logoPosition === 'center') {
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('float', 'inline-start');
            $('#set_board_title').css('position', 'absolute');
            $('#set_board_title').css('top', '1%');
            $('#set_board_title').css('left', ''+ ((dimensions.width/2) - (board_title_width/2) )+'in');
            // $('#set_board_title').css('transform', 'translate('+ -board_width+'%, '+ board_width/2+'%)');
            $('#set_board_title').css('text-align', 'center');
        }
    }
}

$('#clear-background-image').on('click', function() {
    const image_url = localStorage.getItem("background_upload");
    // deleteImage(image_url);
    localStorage.removeItem("background_upload");
    $('#section1').css('background-image', 'none');
    $('#background_image_upload').val('');
    $('#background_name').text('');
    clearlinksFromDb('background_url');
});
$('#clear_logo_image').on('click', function() {
    const image_url = localStorage.getItem("logo_url");
    // deleteImage(image_url);
    localStorage.removeItem("logo_url");
    $('#section1_logo').attr('src', '');
    $('#logo_images').val('');
    $('#logo_name').text('');
    clearlinksFromDb('logo_url');
});

$('#reset_board').on('click', function() {
    $('#confirmationModal').modal('show');
});

$("#confirmReset").on('click', function () {
    $('#confirmationModal').modal('hide');
    $('#section1').empty();
    const section1Data = `<div class="w-100" style="height: 50px" id="title_background_color"><div class="h5 pt-3 set_board_title" id="set_board_title"></div></div><img src="" alt="" class="section1_logo position-absolute" id="section1_logo">`;
    $('#section1').append(section1Data);
    clearLocalStorage();
    resetBoard();
});

$(".closeModel").on('click', function () {
    $('#confirmationModal').modal('hide');
    $('#confirmDeleteModal').modal('hide');
    $('#dimentionConfirmationModal').modal('hide');
});

function clearLocalStorage() {
    $('#board_title').val('');
    $('#set_board_title').text('');
    $('#title_bg_color').val('#f5f5f5');
    $('#title_position').val('left');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#f5f5f5');
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
    localStorage.removeItem("boardProperties");
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
        url: amerison_vars.ajaxurl,
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

function deleteImage(imageUrl) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this image?')) {
        const delete_image_nonce = amerison_vars.delete_image_nonce;
        // Create a nonce for security
        var data = {
            action: 'delete_image',
            security: delete_image_nonce, // This is the nonce value generated in your HTML
            image_url: imageUrl
        };

        // Send the request
        $.ajax({
            type: 'POST',
            url: amerison_vars.ajaxurl,
            data: data,
            success: function(response) {
                console.log('Image deleted successfully');
            },
            error: function(error) {
                console.error('Error deleting image');
            }
        });
    }
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
        var dimensions = adjustChildSize( board_width, board_height);
        $('#section1').css('width', dimensions.width + 'in');
        $('#section1').css('height',  dimensions.height + 'in');
        // append new board dimentions to the board_dimensions dropdown
        $('#board_dimensions').append('<option value="' + board_width + 'x' + board_height + '">' + board_width + 'x' + board_height + '</option>');
        $('#board_dimensions').val(board_width + 'x' + board_height);
        localStorage.setItem("custom_board_dimensions", board_width + 'x' + board_height);
        updateDatabase();
    }
});


// Function to show preloader
function showPreloader() {
    const preloader = $('#preloader');
    preloader.append('<div class="spinner"></div>');
    preloader.css('display', 'flex');

}

// Function to hide preloader
function hidePreloader() {
    const preloader = $('#preloader');
    preloader.empty();
    preloader.css('display', 'none');
}


// Function delete board
$('.delete-board').on('click', function() {
    var deleteBoard = $(this)[0];
    var id = deleteBoard.dataset.boardId;
    var title = deleteBoard.dataset.boardTitle;
    console.log(id, title);
    $('#confirmDeleteModal').modal('show');
    $('#delete_board').text(title);
    $('#confirmDeleteModal').find('#delete_board_id').val(id);
});

$('#confirmDeleteBtn').on('click', function() {
    var id = $('#confirmDeleteModal').find('#delete_board_id').val();
    console.log('Deleting board with id: ', id);
    var data = {
        action: 'deleteBoard',
        board_id: id
    };
    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: data,
        success: function (response) {
            console.log('Board deleted successfully');
            window.location.reload();
        },
        error: function (error) {
            console.error('Error deleting board');
        }
    });
});



if (window.location.search === '?board=new') {
    // createNewBoard();
} else {
    getDataFromDb();
}
allowDrop();
});
