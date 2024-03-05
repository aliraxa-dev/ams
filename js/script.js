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

const attributesDropdown = $('#attributes');
const section2 = $('#section2');

var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function calculatePixels(desiredInches, givenInches, givenPixels) {
    var desiredPixels = givenPixels * (desiredInches / givenInches);
    return desiredPixels;
}

function getToolpx(boardInches, boardPixels, toolInches) {
    var inchesToPixelsRatio = boardPixels / boardInches;
    var toolPixels = inchesToPixelsRatio * toolInches;
    return toolPixels;
}

function adjustToolSize(w,h) {
    th_inch = h;

    var cb_dim = $('#board_dimensions').val();
    // check custom_board_dimensions display property is flex or none
    let pcd = $('#custom_board_dimensions').css('display');
    let h1 = $('#custom_height').val();
    let w1 = $('#custom_width').val();
    if (cb_dim === 'custom') {
        cb_dim = w1 + 'x' + h1;
    } else if (h1 != '' && w1 != '' && pcd === 'flex') {
        cb_dim = $('#custom_width').val() + 'x' + $('#custom_height').val();
    } else {
        cb_dim = cb_dim;
    }
    console.log(cb_dim, 'cb_dim');
    // seprate the width and height from the string x
    cb_dim = cb_dim.split('x');
    bh_inch = cb_dim[1];
    bw_inch = cb_dim[0];

    // bh_inch = 300; //$('custom_height').val();
    bh_px = $('#section1').height() ;

    console.log(bh_inch, bh_px, th_inch);
    var pixelsForToolHeight = getToolpx(bh_inch, bh_px, th_inch);

    const header_height = $("#title_background_color").height()


    // var pixelsForToolHeight = calculatePixels(th_inch, bh_px, bh_inch);

    // console.log(pixelsForToolHeight, "<pixelsForToolHeight")

    return {width: w, height: (pixelsForToolHeight - header_height)};
    x = false;

    if( x= true ){
        var viewportWidth = $('#section1').width();
        // Calculate aspect ratio of the desired dimensions
        // var aspectRatio = viewportWidth / viewportHeight;
        var aspectRatio = w / h;

        // Calculate width and height based on aspect ratio
        var width = w / aspectRatio;
        var height = (w) / aspectRatio;

        console.log(w, h, aspectRatio, 'w, h, aspectRatio');
        console.log(viewportHeight, viewportWidth, 'viewportHeight, viewportWidth');
        console.log($('#custom_width').val(), $('#custom_height').val(), 'custom dimensions');
        console.log({ width: width, height: height });

        console.log(width, height, 'width, height');

        return { width: width, height: height };
    }

}

function calculateToolSize(w,h,bw,bh) {
    // Calculate aspect ratio of the tool
    var aspectRatio = w / h;

    // Calculate width and height based on aspect ratio and board size
    var width = bw ;
    var height = (bw ) / aspectRatio;

    // If the calculated height exceeds the board height, recalculate width and height
    if (height > bh ) {
        height = bh ;
        width = height * aspectRatio;
    }

    // Return the tool size in pixels
    return { width: width, height: height };
}

function calculateToolPxValues(toolWidthInches, toolHeightInches) {
// Scale tool dimensions to CSS pixels (assuming 96 PPI)
const toolWidthPx = toolWidthInches * 96;
const toolHeightPx = toolHeightInches * 96;

// Get viewport dimensions of the board's container
const viewportWidth = $('#left_section').width();
const viewportHeight = $('#left_section').height();

// Adjust tool dimensions based on aspect ratio and viewport constraints
const adjustedSizes = adjustChildSize(toolWidthPx, toolHeightPx);

// Return the final CSS pixel values
return {
    width: adjustedSizes.width , // Add 'px' unit for CSS
    height: adjustedSizes.height
};
}

function adjustChildSize(w,h) {
    var viewportWidth = $('#left_section').width();
    var viewportHeight = $('#left_section').height();

    // Calculate aspect ratio of the desired dimensions
    var aspectRatio = w / h;

    // Calculate width and height based on aspect ratio
    var width = viewportWidth ;
    var height = (viewportWidth ) / aspectRatio;

    // If the calculated height exceeds the available height, recalculate width and height
    if (height > viewportHeight ) {
        height = viewportHeight ;
        width = height * aspectRatio;
    }
    boardWithTool();
    return { width: width, height: (height -10) };
}

function boardWithTool() {
    let board = $("#section1").width();
    let tool = $(".draggable-container img");
    let toolWidth = tool.width();
    // console.log(board, toolWidth, 'board, tool');

    if (((toolWidth * tool.length) - 80) > board) {
        // console.log("Tool is larger than board");
        // $("#boardWithTool").modal('show');
    } else {
        // console.log("Tool is smaller than board");
    }
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
        $('#section1').droppable('destroy');
        allowDrop();
        updateDatabase();
        saveSectionState();
    },

});

function allowDrop() {
    // $('#section1').droppable('destroy')
    $("#section1").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            var sourceSection = ui.draggable.closest(".section").attr("id");
            const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative;"></div>');
            $(this).append(draggableContainer);

            if (event.target.id === "section1" && sourceSection !== "section1") {
                console.log("Item dropped in section 1");
                const $clone = ui.helper.clone();
                // get the width of the image from data-width attribute
                let width = $clone.data('width');
                let height = $clone.data('height');
                let id = $clone.data('id');

                // append the height in the $clone img data-height attribute
                $clone.data('height', height);
                $clone.data('width', width);
                $clone.data('id', id);


                $clone.css({
                    top: ui.position.top + "px",
                    left: (ui.position.left) + "px",
                    position: "absolute",
                    width: "auto",
                    height: height + "px",
                });
                draggableContainer.append($clone);
                $clone.attr("class", "item draggable");

                // Show the close button
                const closeButton = $('<span class="close-button">X</span>');
                draggableContainer.append(closeButton);

                // Set the position of the close button relative to the cloned item
                closeButton.css({
                    top: (ui.position.top) + "px",
                    left: (ui.position.left) + "px",
                    position: "absolute",
                    // display: "none",
                });

                closeButton.click(function () {
                    draggableContainer.remove();
                    updateDatabase();
                });
                dragElement();
            } else if (event.target.id === "section1" && sourceSection === "section1") {
                // dragElement();
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
                dragElement();
            }
            saveSectionState();
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
    let width = $clone.data('width');
    let height = $clone.data('height');
    let id = $clone.data('id');
    $clone.data('height', height);
    $clone.data('width', width);
    $clone.data('id', id);

    $clone.css({
        top: 0 + "px",
        left: left + "px",
        position: "absolute",
        width: "auto",
        height: height + "px",
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
    saveSectionState();
    dragElement();
});

// $("#section1").on("click", ".item", function () {
//     checkOverlap();
//     console.log("Item clicked ?>>>>>>>>>>>>>>");
//     $(this).draggable({
//         revert: "invalid",
//         helper: "original",
//         start: function (event, ui) {
//             $(this).data("originalPosition", ui.helper.offset());
//         },
//         drag: function (event, ui) {
//             $('#section1').droppable('destroy');
//             allowDrop();
//             saveSectionState();
//         }
//     });
// });

function dragElement() {
    $("#section1 .item").draggable({
        revert: "invalid",
        helper: "original",
        start: function (event, ui) {
            $(this).data("originalPosition", ui.helper.offset());
        },
        drag: function (event, ui) {
            // console.log("Item dragged DragElement");
            $('#section1').droppable('destroy');
            allowDrop();
            saveSectionState();
            boardWithTool();
        }
    });
}


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

// setInterval(function () {
//     checkOverlap();
//     saveSectionState();
// }, 1000);



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
        // let height = $('#section2 img')[0].dataset.height;
        // let width = $("#section2 img")[0].dataset.width;
        // let h1 = $('#section2 img')[0].dataset.h1;
        // let w1 = $("#section2 img")[0].dataset.w1;
        let id = $(this).data('id');
        let height = $(this).data('height');
        let width = $(this).data('width');
        let h1 = $(this).data('h1');
        let w1 = $(this).data('w1');

        $(this).data('h1', h1);
        $(this).data('w1', w1);
        $(this).data('height', height);
        $(this).data('width', width);
        $(this).data('id', id);

        section1Items.push({
            id: itemId,
            top: position.top,
            left: position.left,
            image: image,
            height: height,
            width: width,
            h1: h1,
            w1: w1,
            id: id
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
        // setChildSize(widthPercentage, heightPercentage);
        // var dimensions = applyZoomEffect( widthPercentage, heightPercentage);
        var dimensions = adjustChildSize( widthPercentage, heightPercentage);
        // console.log(dimensions.width, dimensions.height, 'board_dimensions');
        // adjustChildSize
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
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

    // get the logo url from the database
    const logo_url = localStorage.getItem("logo_url");
    if (logo_url) {
        $('#section1_logo').attr('src', logo_url);
        const parts = logo_url.split('/');
        const imageName = parts[parts.length - 1];
        $('#logo_name').text(imageName);
    }

    var board_material = $('#board_material').val();
    // console.log(board_material, 'board_material');
    // get the background image url from the database
    const background_url = localStorage.getItem("background_upload");
    if (background_url && board_material !== 'StorLaze') {
        $('#section1').css('background-image', 'url(' + background_url + ')');
        $('#section1').css('background-size', 'cover');
        $('#section1').css('background-repeat', 'no-repeat');
        const parts = background_url.split('/');
        const imageName = parts[parts.length - 1];
        $('#background_name').text(imageName);
    } else {
        $('#section1').css('background-image', 'none');
    }

    updateTitlePosition();
    updateLogoPosition();

    const selectedColor = attributesDropdown.val();
    localStorage.setItem("selectedColor", selectedColor);
    localStorage.setItem("section1State", JSON.stringify(section1Items));
    localStorage.setItem("boardProperties", JSON.stringify(boardProperties));
    // updateDatabase();
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
                // console.log('Data retrieved successfully:');
                const data = response[0];
                if (data != undefined) {
                    const section1Items = JSON.parse(data.config_data.replace(/\\/g, ''));
                    const selectedColor = data.options;
                    console.log(section1Items, 'section1Items');

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
                    // setChildSize(board_width, board_height);
                    var dimensions = adjustChildSize( board_width, board_height);
                    // console.log(dimensions.width, dimensions.height);

                    $('#section1').css('width', dimensions.width + 'px');
                    $('#section1').css('height', dimensions.height + 'px');
                    for (const item of section1Items) {
                        const newItem = $('<div class="item draggable draggable-container ui-draggable ui-draggable-handle" style="position: relative;"></div>');
                        const newImage = $('<img src="' + item.image + '" alt="' + selectedColor + '" data-id="'+ item.id +'" data-h1="'+ item.h1 +'" data-w1="'+ item.w1 +'" data-height="'+ item.height +'" data-width="'+ item.width +'" class="item draggable" />');
                        const closeButton = $('<span class="close-button">X</span>');

                        // Append the image and close button to the container
                        newItem.append(newImage, closeButton);

                        newImage.css({
                            top: item.top + "px",
                            left: item.left + "px",
                            position: "absolute",
                            width: "auto",
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
                        // newItem.draggable({
                        //     revert: "invalid",
                        //     helper: "original",
                        // });
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
                    if (background_url && data.board_material !== 'StorLaze') {
                        $('#section1').css('background-image', 'url(' + background_url + ')');
                        $('#section1').css('background-size', 'cover');
                        $('#section1').css('background-repeat', 'no-repeat');
                        const parts = background_url.split('/');
                        const imageName = parts[parts.length - 1];
                        $('#background_name').text(imageName);
                    } else {
                        $('#section1').css('background-image', 'none');
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
                        localStorage.setItem("custom_board_dimensions", data.board_dimensions);
                    }

                    const title_bg_color = data.title_bg_color;
                    $('#title_bg_color').val(title_bg_color);
                    saveSectionState();
                    dragElement();
                    updateTitlePosition();
                    updateLogoPosition();
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
            let width = variation.width;
            let height = variation.height;
            var dimensions = adjustToolSize(width, height);

            if (color === variation.attributes.attribute_pa_color) {
                section2.append('<img src="' + imageSrc + '" alt="' + color + '" class="draggable cloneable-items" data-id="'+ variation.id +'" data-width="'+ dimensions.width +'" data-h1="'+ height +'" data-w1="'+ width +'" data-height="'+ dimensions.height +'" style="height: '+ (height * 3) +'px; width: auto;" />');
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
    var section_background_image = $('#section1').css('background-image');

    // Default background color if the input is not a valid hex color
    const defaultBackgroundColor = 'rgb(255, 255, 255)';
    let section1BackgroundColor;

    if (board_material === 'StorLaze') {
        // If board_material is StorLaze, set section1BackgroundColor to StorLaze color
        section1BackgroundColor = 'rgb(192, 192, 192)';

        // Remove background image if StorLaze is set
        $('#section1').css('background-image', 'none');
    } else {
        if (section_color === 'rgb(255, 255, 255)' || section_color === '#ffffff') {
            switch (board_material) {
                case 'StorShield':
                case 'StorShield+':
                case 'StorLam':
                    section1BackgroundColor = defaultBackgroundColor;
                    break;
                case 'StorClear':
                    // Transparent color
                    section1BackgroundColor = 'rgba(0, 0, 0, 0)';
                    $('#section1').css('border', '1px solid #000');
                    break;
                default:
                    section1BackgroundColor = bg_color;
                    break;
            }

            // Restore background image if not StorLaze
            $('#section1').css('background-image', section_background_image);
        } else {
            section1BackgroundColor = bg_color;

            // Restore background image if not StorLaze
            $('#section1').css('background-image', section_background_image);
        }
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
            // console.log('Data updated successfully:');
            $('#dot_alert').css('display', 'block');
            setTimeout(function () {
                $('#dot_alert').css('display', 'none');
            }, 1000);
        },
        error: function (error) {
            // console.error('Error updating data:');
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
                    const parts = response.url.split('/');
                    const imageName = parts[parts.length - 1];
                    $('#logo_name').text(imageName);
                    hidePreloader();
                },
                error: function(error) {
                    console.error(error);
                    hidePreloader();
                }
            });
        };

        reader.readAsBinaryString(file);
    } else {
        hidePreloader();
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
                    const board_material = $('#board_material').val();
                    if (board_material !== 'StorLaze') {
                        localStorage.setItem("background_upload", response.url);
                        $('#section1').css('background-image', 'url(' + response.url + ')');
                        $('#section1').css('background-size', 'cover');
                        $('#section1').css('background-repeat', 'no-repeat');
                        const parts = response.url.split('/');
                        const imageName = parts[parts.length - 1];
                        $('#background_name').text(imageName);
                    }
                    hidePreloader();
                },
                error: function(error) {
                    console.error(error);
                    hidePreloader();
                }
            });
        };

        reader.readAsBinaryString(file);
    } else {
        hidePreloader();
    }
});

$('.show_storlaze_model').on('click', function() {
    const board_material = $('#board_material').val();
    if (board_material === 'StorLaze') {
        $('#backgroundImageModel').modal('show');
    }
});
$('[data-toggle="tooltip"]').tooltip();

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
    saveSectionState();
    updateTitlePosition();
});

$('#title_position').on('change', function() {
    updateTitlePosition();
});

$('#custom_logo').on('change', function() {
    updateLogoPosition();
});

// on board dimensions change update the tools in the section1 and section2
$('#board_dimensions, #custom_height').on('change', function() {
    let s2_data = $('#section2 img');
    let s1_data = $('#section1 .draggable-container img');

    // get the each image data from the section2
    for (let i = 0; i < s2_data.length; i++) {
        let height = s2_data[i].dataset.h1;
        let width = s2_data[i].dataset.w1;
        console.log(height, width, 'height, width');
        let custom = adjustToolSize(width, height);
        let id = s2_data[i].dataset.id;
            for (let j = 0; j < s1_data.length; j++) {
                if (id === s1_data[j].dataset.id) {
                    // console.log(custom.width, custom.height, 'custom');
                    s1_data.eq(j).css("height", "" + custom.height + "px");
                }
            }
    }
    updateDatabase();
    saveSectionState();
});

// $('#board_dimensions').on('change', function() { saveSectionState(); });

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
            $('#section1_logo').css('top', '' + 0 +'%');
            $('#section1_logo').css('left', '' + (dimensions.width - 50) +'px');

        } else if (logoPosition === 'left') {
            $('#section1_logo').removeAttr('style');
            $('#section1_logo').css('position', 'absolute');
            $('#section1_logo').css('float', 'inline-start');
            $('#section1_logo').css('top', '' + 0 +'%');
            // $('#section1_logo').css('left', '' + 15+'in');
        } else if (logoPosition === 'center') {
            $('#section1_logo').removeAttr('style');
            $('#section1_logo').css('position', 'absolute');
            $('#section1_logo').css('float', 'inline-start');
            $('#section1_logo').css('top', '' + (dimensions.height/2) +'px');
            $('#section1_logo').css('left', '' + ((dimensions.width/2) - 20) +'px');
            $('#section1_logo').css('transform', 'translate('+ (-25) +'%, '+ (-50) +'%)');
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
            $('#set_board_title').css('margin-top', '12px');
            $('#set_board_title').css('margin-right', '5px');
        } else if (logoPosition === 'left') {
            // remove all the inline styles
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('float', 'inline-start');
            $('#set_board_title').css('margin-top', '12px');
            $('#set_board_title').css('margin-left', '5px');
        } else if (logoPosition === 'center') {
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('margin-bottom', '0px');
            $('#set_board_title').css('position', 'absolute');
            $('#set_board_title').css('top', '3%');
            $('#set_board_title').css('left', ''+ (((dimensions.width/2) - ((board_title_width) / 2) )) +'px');
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
    $('#backgroundImageModel').modal('hide');
    // $('#boardWithTool').modal('hide');
});

$('.boardWithToolClose').on('click', function() {
    $('#boardWithTool').modal('hide');
    // const baord_dim = localStorage.getItem("custom_board_dimensions");
    // $('#board_dimensions').val(baord_dim);
});

$('.closeModel1').on('click', function() {
    $('#dimentionConfirmationModal').modal('hide');
    $('#custom_board_dimensions').css('display', 'none');

    var board_dimensions_values = $('#board_dimensions').val();
    if (board_dimensions_values === 'custom') {
        $('#board_dimensions').val('120x120');
        saveSectionState();
    }
});

function clearLocalStorage() {
    $('#board_title').val('');
    $('#set_board_title').text('');
    $('#title_bg_color').val('#f5f5f5');
    $('#title_position').val('left');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#ffffff');
    $('#board_style').val("Wall Mount");
    $('#board_material').val("StorSheild");
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
    saveSectionState();
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
$('#board_dimensions, #custom_width, #custom_height').on('change', function() {
    const board_dimensions = $('#board_dimensions').val();
    if (board_dimensions != 'custom') {
        localStorage.setItem("previous_board_dimensions", board_dimensions);
    }

    const board_width = $('#custom_width').val();
    const board_height = $('#custom_height').val();

    let previous_board_dimensions = localStorage.getItem("previous_board_dimensions");

    if (board_width > 120 || board_height > 120) {
        $('#board_dimensions').val(previous_board_dimensions);
        $('#dimentionConfirmationModal').modal('show');
    } else if (board_dimensions === 'custom') {
        $('#custom_board_dimensions').css('display', 'flex');
    } else {
        $('#custom_board_dimensions').css('display', 'none');
        // $('#board_dimensions').val('48x72');
    }



    // if (board_dimensions === 'custom') {
    //     $('#dimentionConfirmationModal').modal('show');
    //     $('#custom_board_dimensions').css('display', 'flex');
    // } else {
    //     $('#custom_board_dimensions').css('display', 'none');
    // }
});

$('#dimentionConfirm').on('click', function() {
    $('#dimentionConfirmationModal').modal('hide');
});

$('.close-button').on('click', function() {
    $(this).parent().remove();
    $('#custom_board_dimensions').css('display', 'none');
    updateDatabase();
});

$('.custom_values').on('change', function() {
    const board_width = $('#custom_width').val();
    const board_height = $('#custom_height').val();
    const board_dimensions = $('#board_dimensions').val();
    let previous_board_dimensions = localStorage.getItem("previous_board_dimensions");
    if (board_width && board_height && board_width <= 120 && board_height <= 120) {
        var dimensions = adjustChildSize( board_width, board_height);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
        // append new board dimentions to the board_dimensions dropdown
        $('#board_dimensions').append('<option value="' + board_width + 'x' + board_height + '">' + board_width + 'x' + board_height + '</option>');
        $('#board_dimensions').val(board_width + 'x' + board_height);
        localStorage.setItem("custom_board_dimensions", board_width + 'x' + board_height);
        localStorage.setItem("previous_board_dimensions", board_width + 'x' + board_height);
        updateDatabase();
    } else if (board_width > 120) {
        $('#custom_width').val(120);
        $('#board_dimensions').val(previous_board_dimensions);
        $('#dimentionConfirmationModal').modal('show');
        $('#custom_board_dimensions').css('display', 'flex');
    } else if (board_height > 120) {
        $('#custom_height').val(120);
        $('#board_dimensions').val(previous_board_dimensions);
        $('#dimentionConfirmationModal').modal('show');
        $('#custom_board_dimensions').css('display', 'flex');
    }
    saveSectionState();
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

function createNewBoard() {
    console.log('Creating new board');
    $('#section1').removeAttr('style');
    $('#title_position').val('left');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#ffffff');
    $('#board_style').val('Wall Mount');
    $('#board_material').val('StorShield');
    $('#custom_logo').val('left');
    $('#quantity_of_boards').val(0);
    $('#section1').css('background-color', '#ffffff');
    $('#attributes').val("null");
    const dimensions = adjustChildSize(24, 72);
    $('#section1').css('width', dimensions.width + 'px');
    $('#section1').css('height',  dimensions.height + 'px');

}

// board style view button click event
$('#board_style_config').on('click', function() {
    let board_style = $('#board_style').val();
    let image = $('#image1');
    // Viewer.js options (common for both conditions)
    var viewerOptions = {
        toolbar: false,
        navbar: false,
        movable: false,
        hidden: function() {
            viewer.destroy();
        }
    };

    // Check board_style value and initialize viewer accordingly
    if (board_style === 'Wall Mount') {
        console.log('Wall Mount');
        image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png');
        image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png';
    } else if (board_style === 'Mobile') {
        console.log('Mobile');
        image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png');
        image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png';
    } else {
        console.log('Magnet Mounted');
        image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png');
        image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png';
    }

    // Initialize Viewer.js
    var viewer = new Viewer(document.getElementById('image1'), viewerOptions);

    // Show the viewer
    viewer.show();
});


const Image = `<img src="" data-original="" alt="Board Style Wall Mount" id="image1" class="img-fluid d-none" />`;
$('body').append(Image);



if (window.location.search === '?board=new') {
    createNewBoard();
    clearLocalStorage();
} else {
    getDataFromDb();
    saveSectionState();
}
allowDrop();

});