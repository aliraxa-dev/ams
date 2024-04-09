var boardProperties = {
    board_title: '',
    title_position: '',
    title_bg_color: '',
    title_header_color: '',
    board_dimensions: '',
    background_color: '',
    background_url: '',
    board_style: '',
    board_material: '',
    custom_logo: {top: '', left: '', width: '', height: ''},
    quantity_of_boards: '',
}

const colors = ['#aa182c', '#a87bc9', '#ff5100', '#ffd600', '#9ea1a2', '#6d3628', '#005cb9', '#0db14b', '#ee4d9a', '#231f20', '#ffffff'];


let console_disabled = false;

const nullFunc = function(){};
console = new Proxy(console, {
  get(target, prop, receiver){
    if(prop==='log' && console_disabled){
      return nullFunc;
    }
    return Reflect.get(...arguments)
  }
});

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
const custom_section = $('#custom_section');

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

function GN() {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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
    // console.log(cb_dim, 'cb_dim');
    // seprate the width and height from the string x
    cb_dim = cb_dim.split('x');
    bh_inch = cb_dim[1];
    bw_inch = cb_dim[0];

    // bh_inch = 300; //$('custom_height').val();
    bh_px = $('#section1').height() ;

    // console.log(bh_inch, bh_px, th_inch);
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

        // console.log(w, h, aspectRatio, 'w, h, aspectRatio');
        // console.log(viewportHeight, viewportWidth, 'viewportHeight, viewportWidth');
        // console.log($('#custom_width').val(), $('#custom_height').val(), 'custom dimensions');
        // console.log({ width: width, height: height });

        // console.log(width, height, 'width, height');

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
    canvas.setWidth(width);
    canvas.setHeight(height - 10);
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


function appendColorPalette(item, colors, top, left, id = 0, dateTime) {
    // Create the color palette container
    const colorPalette = $('<div class="custom-color-picker" id=""><div class="color-input cursor-pointer" style="background-color: black" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to change the tool color."><div class="color-options" data-id="'+ dateTime +'"></div></div>');

    // Append the color palette container to the specified item
    item.append(colorPalette);

    // Find the color options within the color palette
    const colorOptions = colorPalette.find('.color-options');

    // Loop through the colors and create color options
    colors.forEach(color => {
        const colorOption = $('<div class="custom-color" style="background-color: ' + color + '"></div>');
        colorOptions.append(colorOption);
    });

    // Set the CSS properties for the color palette
    colorPalette.css({
        top: (top + 30) + "px",
        left: (left+4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
        position: "absolute",
        display: "none",
    });

    // Toggle color options when clicking the color input
    colorPalette.find('.color-input').click(function() {
        $(this).find('.color-options').toggle();
    });

    left+4 <= 10 ? $('.color-options').css('left', '25%') : $('.color-options').css('left', '-150%');

    // Set selected color when clicking a color option
    colorPalette.find('.custom-color').click(function() {

        var color = $(this).css('background-color');
        localStorage.setItem("paletteColor", color);
        let selected = $(this).parents('.color-options').data('id');
        console.log(selected, 'selected');
        $(this).closest('.color-input').css('background-color', color);
        $(this).closest('.color-options').hide();
        $(this).closest('.custom-color-picker').find('.color-options').toggle();

        const src = $("#tool_img_" + selected).attr('src');
        const alt = $("#tool_img_" + selected).attr('alt');
        // console.log(src, color, 'src, color');
        //const src = $(this).parents('.draggable-container').find('img').attr('src');
        console.log(src, color, selected, 'src, color');

        changeSVGColor(src, color, selected, alt);
    });

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
let originalColor;
function allowDrop() {
    // $('#section1').droppable('destroy')
    $("#section1").droppable({
        accept: ".draggable",
        drop: function (event, ui) {
            var sourceSection = ui.draggable.closest(".section").attr("id");
            const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>');
            $(this).append(draggableContainer);

            if (event.target.id === "section1" && sourceSection !== "section1") {
                // console.log("Item dropped in section 1");
                const $clone = ui.helper.clone();
                // get the width of the image from data-width attribute
                let width = $clone.data('width');
                let height = $clone.data('height');
                let id = $clone.data('id');
                let image = $clone.data('image');

                // append the height in the $clone img data-height attribute
                $clone.data('height', height);
                $clone.data('width', width);
                $clone.data('id', id);
                $clone.data('image', image);

                const randomId = GN();

                let left = ui.position.left;

                $clone.css({
                    top: ui.position.top + "px",
                    left: (left) + "px",
                    position: "absolute",
                    width: "auto",
                    height: height + "px",
                });
                draggableContainer.append($clone);
                $clone.attr("class", "item draggable");
                $clone.attr("id", "tool_img_" + randomId);

                // Show the close button
                const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_'+ randomId +'">X</span>');
                draggableContainer.append(closeButton);

                // Set the position of the close button relative to the cloned item
                closeButton.css({
                    top: (ui.position.top) + "px",
                    left: (left+4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
                    position: "absolute",
                    // display: "none",
                });

                appendColorPalette(draggableContainer, colors, ui.position.top, ui.position.left, id, randomId);

                closeButton.click(function () {
                    draggableContainer.remove();
                    updateDatabase();
                });
                dragElement();
            } else if (event.target.id === "section1" && sourceSection === "section1") {
                // dragElement();
                // console.log("Item dragged within section 1");
                const existingContainer = ui.draggable.closest(".draggable-container");
                draggableContainer.append(ui.draggable);
                draggableContainer.css({
                    zIndex: 9999,
                });
                let id = ui.draggable.data('id');
                let randomId = GN();

                ui.draggable.attr("id", "tool_img_" + randomId);

                // Move the existing close button along with the item
                const closeButton = existingContainer.find('.close-button');
                existingContainer.remove(); // Remove the old container
                closeButton.attr('id', 'delete_'+ randomId);
                closeButton.attr('data-bs-toggle', 'tooltip');
                closeButton.attr('data-bs-placement', 'top');
                closeButton.attr('data-bs-trigger', 'hover focus');
                closeButton.attr('title', 'Click here to remove the tool.');

                draggableContainer.append(closeButton);

                let left = ui.position.left;
                // Set the position of the close button relative to the dragged item
                closeButton.css({
                    top: ui.position.top + "px",
                    left: (left+4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
                    position: "absolute",
                    // display: "none",
                });

                // on drag of the item keep the color palette with the item
                const colorPalette = existingContainer.find('.custom-color-picker');
                const color = colorPalette.find('.color-input').css('background-color');
                // console.log(color, 'color on drag');
                colorPalette.remove();

                appendColorPalette(draggableContainer, colors, ui.position.top, ui.position.left, id, randomId);

                ui.draggable.siblings('.custom-color-picker').find('.color-input').css('background-color', color);


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
        start: function() {
            // Save the original color
            originalColor = $("#section1 .color-box-customization .set_board_title").css("color");
            console.log(originalColor, 'originalColor');
        },
        stop: function() {
            // Restore the original color
            $("#section1 .color-box-customization .set_board_title").css("color", originalColor);
        }
    });
}

 // Add click event for adding tools in mobile or tab view
 $("#section2, #custom_section").on("click", ".cloneable-items", function() {
    // console.log("Item clicked");
    var section1 = $("#section1");
    // section1 left position
    var left = section1.offset().left;
    // section1 top position
    var top = section1.offset().top;
    // append the cloneable item to the section1
    const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>');
    section1.append(draggableContainer);
    const $clone = $(this).clone();
    draggableContainer.append($clone);
    let width = $clone.data('width');
    let height = $clone.data('height');
    let id = $clone.data('id');
    let image = $clone.data('image');
    $clone.data('height', height);
    $clone.data('width', width);
    $clone.data('id', id);
    $clone.data('image', image);

    $clone.css({
        top: 0 + "px",
        left: 0 + "px",
        position: "absolute",
        width: "auto",
        height: height + "px",
    });
    let randomId = GN();
    $clone.attr("class", "item draggable");
    $clone.attr("id", "tool_img_" + GN());
    // Show the close button
    const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_'+ randomId +'">X</span>');
    draggableContainer.append(closeButton);
    closeButton.css({
        top: 0 + "px",
        left: (left+4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
        position: "absolute",
        // display: "none",
    });

    appendColorPalette(draggableContainer, colors, 0, left, id, randomId);

    saveSectionState();
    dragElement();
});

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
            if ($(this).hasClass('resizable')) {
                // If the resizable element is being dragged, prevent it from affecting the position of other elements
                ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({target: $('.ui-resizable-handle')}).ratio;
            }
        }
    });
}


function checkOverlap() {
    var items = $("#section1").children(".draggable");
    for (var i = 0; i < items.length; i++) {
        for (var j = i + 1; j < items.length; j++) {
            if (isOverlapping($(items[i]), $(items[j]))) {
                // console.log("Item " + i + " and Item " + j + " overlap");
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
    if (color !== 'Custom') {
        attributesDropdown.append('<option value="' + color.toLowerCase() + '">' + color + '</option>');
    }
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
        const image = $(this).data('image');
        let id = $(this).data('id');
        let height = $(this).data('height');
        let width = $(this).data('width');
        let h1 = $(this).data('h1');
        let w1 = $(this).data('w1');
        let alt = $(this).attr('alt');

        $(this).data('h1', h1);
        $(this).data('w1', w1);
        $(this).data('height', height);
        $(this).data('width', width);
        $(this).data('id', id);

        let color = $(this).siblings('.custom-color-picker').find('.color-input').css('background-color');

        section1Items.push({
            id: itemId,
            top: position.top,
            left: position.left,
            image: image,
            height: height,
            width: width,
            h1: h1,
            w1: w1,
            id: id,
            color: color,
            zIndex: 9999,
            alt: alt,
        });
    });

    // get the custom_logo position and size and save it to the local storage
    let logoPosition = $('#image-container').position();
    let logoSize = $('#image-container').width();
    let logoHeight = $('#image-container').height();

    if (logoPosition !== undefined) {
        var custom_logo = {
            top: logoPosition.top,
            left: logoPosition.left,
            width: logoSize,
            height: logoHeight,
        };
    }

    localStorage.setItem("custom_logo", JSON.stringify(custom_logo));

    // set the boardProperties to the local storage
    boardProperties.board_title = $('#board_title').val();
    boardProperties.title_position = $('#title_position').val();
    boardProperties.board_dimensions = $('#board_dimensions').val();
    boardProperties.background_color = $('#background_color').val();
    boardProperties.board_style = $('#board_style').val();
    boardProperties.board_material = $('#board_material').val();
    boardProperties.custom_logo = custom_logo;
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
        // $('title_background_color').css('width', dimensions.width + 'px');
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
    } else {
        $('#custom_board_dimensions').css('display', 'flex');
    }

    $('#set_board_title').text(boardProperties.board_title);
    $('#section1').css('background-color', boardProperties.background_color);

    var color =  getBoardMaterial(boardProperties.board_material);
    $('#section1').css('background-color', color);

    const title_bg_color = $('#title_bg_color').val();
    $('#title_background_color').css('background-color', title_bg_color);

    localStorage.setItem("title_bg_color", title_bg_color);

    const title_header_color = $('#title_header_color').val();
    $('#set_board_title').css('color', title_header_color);

    localStorage.setItem("title_header_color", title_header_color);

    // get the logo url from the database
    const logo_url = localStorage.getItem("logo_url");
    const logo = localStorage.getItem("logo_image");
    if (logo_url) {
        $('#section1_logo').attr('src', logo_url);
        $('#section1_logo')[0].dataset.logo = logo;
        let image = $('#section1_logo').data('logo');
        const parts = image.split('/');
        const imageName = parts[parts.length - 1];
        $('#logo_name').text(imageName);
        $('#image-container').css({
            display: "block",
        });
    }

    const setFill = localStorage.getItem("shape_filler");
    const setStroke = localStorage.getItem("shape_stroke");
    $('#colorPickerToggle').css('border-color', setStroke);

    const textFill = localStorage.getItem("text_filler");
    const textStroke = localStorage.getItem("text_stroke");
    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject().type === 'textbox' ? true : false;
        const path = canvas.getActiveObject().type === 'path' ? true : false;

        if (!text) {
            if (!path) {
                canvas.getActiveObject().set('fill', setFill);
                canvas.getActiveObject().set('stroke', setStroke);
            } else {
                canvas.getActiveObject().set('fill', 'transparent');
                canvas.getActiveObject().set('stroke', 'black');
            }
            canvas.renderAll();
        } else if (text) {
            canvas.getActiveObject().set('stroke', textStroke);
            canvas.getActiveObject().set('fill', textFill);
            canvas.renderAll();
        }
    }

    $('#drawing_fill').val(setFill);
    $('#drawing_stroke').val(setStroke);
    $('#fill_color_text').val(textFill);
    $('#stroke_color_text').val(textStroke);

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

    // localStorage.setItem("shape_filler", setFill);
    // localStorage.setItem("shape_stroke", setStroke);
    // localStorage.setItem("text_filler", textFill);
    // localStorage.setItem("text_stroke", textStroke);

    updateTitlePosition();
    // updateLogoPosition();
    getCustomImages();

    const selectedColor = attributesDropdown.val();
    localStorage.setItem("selectedColor", selectedColor);
    localStorage.setItem("section1State", JSON.stringify(section1Items));
    localStorage.setItem("boardProperties", JSON.stringify(boardProperties));
    // updateDatabase();
}

setInterval(function() {
    if (window.location.search !== '?board=new') {
        changeBG();
        updateBoardDimensions();
    }
}, 500);

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})


function changeBG() {
    const title_bg_color = $('#title_bg_color').val();
    $('#title_background_color').css('background-color', title_bg_color);
    localStorage.setItem("title_bg_color", title_bg_color);

    const title_header_color = $('#title_header_color').val();
    $('#set_board_title').css('color', title_header_color);
    localStorage.setItem("title_header_color", title_header_color);

    const board_material = $('#board_material').val();

    if (board_material === 'StorLaze') {
        $('#section1').css('background-color', 'rgb(192, 192, 192)');
    } else {
        const background_color = $('#background_color').val();
        $('#section1').css('background-color', background_color);
        localStorage.setItem("background_color", background_color);
    }


    // update title
    const board_title = $('#board_title').val();
    $('#set_board_title').text(board_title);

    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject().type === 'textbox' ? true : false;
        const path = canvas.getActiveObject().type === 'path' ? true : false;



        if (!text) {
            const stroke = $('#drawing_stroke').val();
            const fill = $('#drawing_fill').val();
            if (!path) {
                canvas.getActiveObject().set('fill', fill);
                canvas.getActiveObject().set('stroke', stroke);
                localStorage.setItem("shape_filler", fill);
                localStorage.setItem("shape_stroke", stroke);
            } else {
                canvas.getActiveObject().set('fill', 'transparent');
                canvas.getActiveObject().set('stroke', 'black');
            }
            canvas.renderAll();
            $('#colorPickerToggle').css('border-color', stroke);

        } else if (text) {
            const stroke = $('#stroke_color_text').val();
            const fill = $('#fill_color_text').val();
            canvas.getActiveObject().set('stroke', stroke);
            canvas.getActiveObject().set('fill', fill);
            canvas.renderAll();

            localStorage.setItem("text_filler", fill);
            localStorage.setItem("text_stroke", stroke);
        }
    }

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
                    // console.log(section1Items, 'section1Items');

                    $('#board_title').val(data.board_title);
                    $('#set_board_title').text(data.board_title);
                    $('#title_position').val(data.title_position);
                    $('#background_color').val(data.background_color);
                    $('#board_style').val(data.board_style);
                    $('#board_material').val(data.board_material);
                    // $('#custom_logo').val(data.custom_logo);
                    $('#quantity_of_boards').val(data.quantity_of_boards);


                    // console.log(data.canvasState, 'canvasState');
                    // get the canvous state from the database and set it to the canvas
                    if (data.canvasState !== undefined && data.canvasState !== null && data.canvasState !== '') {
                        const canvasState = JSON.parse(data.canvasState.replace(/\\/g, ''));
                        canvas.loadFromJSON(canvasState, function () {
                            canvas.renderAll();
                        });
                    }

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
                        if (item.image !== undefined) {
                            let randomId = GN();
                            const newItem = $('<div class="item draggable draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>');
                            const newImage = $('<img src="' + item.image + '" data-image="'+ item.image +'" alt="' + item.alt + '" data-id="'+ item.id +'" data-h1="'+ item.h1 +'" data-w1="'+ item.w1 +'" data-height="'+ item.height +'" data-width="'+ item.width +'" id="tool_img_'+ randomId +'" class="item draggable" />');
                            const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool.">X</span>');

                            // Append the image and close button to the container
                            newItem.append(newImage, closeButton);

                            newImage.css({
                                top: item.top + "px",
                                left: item.left + "px",
                                position: "absolute",
                                width: "auto",
                                height: item.height + "px",
                            });

                            $('.canvas-container').css({
                                position: "absolute",
                                zIndex: 99
                            });

                            closeButton.css({
                                top: item.top + "px",
                                left: (item.left+4) <= 40 ? (item.left + 50) + "px" : (item.left + 4) + "px",
                                position: "absolute",
                                // display: "block",
                            });
                            appendColorPalette(newItem, colors, item.top, item.left, item.id, randomId);

                            newItem.find('.color-input').css('background-color', item.color);

                            changeSVGColor(item.image, item.color, randomId, item.alt);


                            $("#section1").append(newItem);

                            closeButton.click(function() {
                                newItem.remove();
                            });
                        }
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
                        let custom_logo = JSON.parse(data.custom_logo.replace(/\\/g, ''));
                        $('#image-container').css({
                            display: "flex",
                            top: custom_logo.top + "px",
                            left: custom_logo.left + "px",
                            with: custom_logo.width + "px",
                            // height: custom_logo.height + "px",
                        });
                        $('#section1_logo').css({
                            width: custom_logo.width + "px",
                            // height: custom_logo.height + "px",
                        });
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

                    const title_header_color = data.title_header_color;
                    $('#title_header_color').val(title_header_color);
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
                section2.append('<div class="flex-column" style="display: flex;" id="nameList_'+ variation.id +'"><img src="' + imageSrc + '" alt="' + color + '" data-image="'+ imageSrc +'" class="draggable cloneable-items" data-id="'+ variation.id +'" data-width="'+ dimensions.width +'" data-h1="'+ height +'" data-w1="'+ width +'" data-height="'+ dimensions.height +'" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">'+ variation.title +'</span></div>');
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

function getCustomImages() {
    custom_section.empty();

    for (const product of WP_PRODUCTS) {
        for (const variation of product.variations) {
            const imageSrc = variation.image;
            let width = variation.width;
            let height = variation.height;
            var dimensions = adjustToolSize(width, height);

            // get the current user id
            const current_user_id = amerison_vars.user_id;
            // console.log(current_user_id, variation.user_id, 'current_user_id');

            // remove p tag from the tool type
            const type = variation.toolType.replace(/<p>/g, '').replace(/<\/p>\n/g, '');
            // console.log(variation.toolType, "variation.toolType");
            // console.log(type, "type");

            if (variation.attributes.attribute_pa_color === '110' && current_user_id === variation.user_id && type ) {
                custom_section.append('<div class="flex-column" style="display: flex;" id="nameList_'+ variation.id +'"><img src="' + imageSrc + '" alt="'+ type +'" data-image="'+ imageSrc +'" class="draggable cloneable-items outline-draggable" data-id="'+ variation.id +'" data-width="'+ dimensions.width +'" data-h1="'+ height +'" data-w1="'+ width +'" data-height="'+ dimensions.height +'" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">'+ variation.title +'</span></div>');
            } else if (variation.attributes.attribute_pa_color === '110' && current_user_id === variation.user_id && !type ) {
                custom_section.append('<div class="no-custom-tools fs-6">You have not added any custom tools yet.</div>');
                return;
            }
        }
    }

    $(".outline-draggable").draggable({
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
    boardProperties.title_header_color = $('#title_header_color').val();
    boardProperties.board_dimensions = $('#board_dimensions').val();
    boardProperties.background_color = $('#background_color').val();
    boardProperties.board_style = $('#board_style').val();
    boardProperties.board_material = $('#board_material').val();
    boardProperties.custom_logo = localStorage.getItem("custom_logo");
    boardProperties.quantity_of_boards = $('#quantity_of_boards').val();
    const id = window.location.search.split('=')[1];
    const data = {
        action: 'update_configurator_data',
        section1Items: section1Items,
        color: color,
        data: boardProperties,
        canvasState: localStorage.getItem("canvasState"),
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
                    localStorage.setItem("logo_image", response.url);
                    $('#section1_logo').attr('src', response.url);
                    const parts = response.url.split('/');
                    const imageName = parts[parts.length - 1];
                    $('#logo_name').text(imageName);
                    // active dragable logo and resizeable
                    $('#image-container').css({
                        display: "flex",
                    });
                    $('#image-container').draggable({
                        drag: function(event, ui) {
                            if ($(this).hasClass('resizable')) {
                                // If the resizable element is being dragged, prevent it from affecting the position of other elements
                                ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({target: $('.ui-resizable-handle')}).ratio;
                            }
                        }
                    });
                    $('#image-container').resizable({
                        containment: "#section1",
                    });
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
if (collapseOne.length) {
    var accordion = new bootstrap.Collapse(collapseOne, { toggle: false });
}


// Handle 'hidden.bs.collapse' event for the second accordion
$('#collapseTwo').on('hidden.bs.collapse', function () {
    if (!accordion._isTransitioning) {
        accordion.show();
    }
});


$(window).on('beforeunload', function () {
    saveSectionState();
});

$('#board_title, #title_bg_color, #title_header_color, #background_color, #board_style, #board_material, #quantity_of_boards').on('change', function() {
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
    updateBoardDimensions();
    updateDatabase();
    saveSectionState();
});


function updateBoardDimensions() {
    let s2_data = $('#section2 img');
    let custom_data = $('#custom_section img');
    let s1_data = $('#section1 .draggable-container img');

    // get the each image data from the section2
    for (let i = 0; i < s2_data.length; i++) {
        let height = s2_data[i].dataset.h1;
        let width = s2_data[i].dataset.w1;
        // console.log(height, width, 'height, width');
        let custom = adjustToolSize(width, height);
        let id = s2_data[i].dataset.id;
            for (let j = 0; j < s1_data.length; j++) {
                if (id === s1_data[j].dataset.id) {
                    // console.log(custom.width, custom.height, 'custom');
                    s1_data.eq(j).css("height", "" + custom.height + "px");
                }
            }
    }

    // get the each image data from the custom section
    for (let i = 0; i < custom_data.length; i++) {
        let height = custom_data[i].dataset.h1;
        let width = custom_data[i].dataset.w1;
        // console.log(height, width, 'height, width');
        let custom = adjustToolSize(width, height);
        let id = custom_data[i].dataset.id;
            for (let j = 0; j < s1_data.length; j++) {
                if (id === s1_data[j].dataset.id) {
                    // console.log(custom.width, custom.height, 'custom');
                    s1_data.eq(j).css("height", "" + custom.height + "px");
                }
            }
    }
}

// $('#board_dimensions').on('change', function() { saveSectionState(); });

function updateLogoPosition() {
    // const dimentions = $('#board_dimensions').val();
    // if (dimentions != undefined) {
    //     const board_dimensions = dimentions.split('x');
    //     const board_width = board_dimensions[0];
    //     const board_height = board_dimensions[1];

    //     const dimensions = adjustChildSize(board_width, board_height);

    //     let logoPosition = $('#custom_logo').val();
    //     if (logoPosition === 'right') {
    //         $('#section1_logo').removeAttr('style');
    //         $('#section1_logo').css('position', 'absolute');
    //         // $('#section1_logo').css('float', 'inline-end');
    //         $('#section1_logo').css('top', '' + 0 +'%');
    //         $('#section1_logo').css('left', '' + (dimensions.width - 50) +'px');

    //     } else if (logoPosition === 'left') {
    //         $('#section1_logo').removeAttr('style');
    //         $('#section1_logo').css('position', 'absolute');
    //         $('#section1_logo').css('float', 'inline-start');
    //         $('#section1_logo').css('top', '' + 0 +'%');
    //         // $('#section1_logo').css('left', '' + 15+'in');
    //     } else if (logoPosition === 'center') {
    //         $('#section1_logo').removeAttr('style');
    //         $('#section1_logo').css('position', 'absolute');
    //         $('#section1_logo').css('float', 'inline-start');
    //         $('#section1_logo').css('top', '' + (dimensions.height/2) +'px');
    //         $('#section1_logo').css('left', '' + ((dimensions.width/2) - 20) +'px');
    //         $('#section1_logo').css('transform', 'translate('+ (-25) +'%, '+ (-50) +'%)');
    //     }
    // }
}

function updateTitlePosition() {
    const dimentions = $('#board_dimensions').val();
    if (dimentions != undefined) {
        let color = localStorage.getItem("title_header_color");

        let logoPosition = $('#title_position').val();
        if (logoPosition === 'right') {
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('position', 'absolute');
            $('#set_board_title').css('width', '100%');
            $('#set_board_title').css('text-align', 'right');
            $('#set_board_title').css('top', '50%');
            $('#set_board_title').css('transform', 'translate(0%, -50%)');

        } else if (logoPosition === 'left') {
            // remove all the inline styles
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('position', 'absolute');
            $('#set_board_title').css('width', '100%');
            $('#set_board_title').css('text-align', 'left');
            $('#set_board_title').css('top', '50%');
            $('#set_board_title').css('transform', 'translate(0%, -50%)');

        } else if (logoPosition === 'center') {
            $('#set_board_title').removeAttr('style');
            $('#set_board_title').css('position', 'absolute');
            $('#set_board_title').css('width', '100%');
            $('#set_board_title').css('text-align', 'center');
            $('#set_board_title').css('top', '50%');
            $('#set_board_title').css('transform', 'translate(0%, -50%)');
        }
        $('#set_board_title').css('color', color);
    }
}

$('#clear-background-image').on('click', function() {
    const image_url = localStorage.getItem("background_upload");
    // deleteImage(image_url);
    localStorage.removeItem("background_upload");
    $('#section1').css('background-image', 'none');
    $('#background_image_upload').val('');
    $('#background_name').text('');
    clearlinksFromDb('background_url', image_url);
    // deleteImage(image_url);
});
$('#clear_logo_image').on('click', function() {
    // const image_url = localStorage.getItem("logo_url");
    const logo = localStorage.getItem("logo_image");
    // deleteImage(image_url);
    localStorage.removeItem("logo_url");
    $('#section1_logo').attr('src', '');
    $('#logo_images').val('');
    $('#logo_name').text('');
    $('#image-container').css('display', 'none');
    clearlinksFromDb('logo_url', logo);
    localStorage.removeItem("custom_logo");
    $('#section1_logo').removeAttr('style');
    saveSectionState();
    updateDatabase();
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
    $('#title_header_color').val('#000000');
    $('#title_position').val('center');
    $('#set_board_title').removeAttr('style');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#ffffff');
    $('#board_style').val("Wall Mount");
    $('#board_material').val("StorLam");
    $('#custom_logo').val({top: 0, left: 0, width: 0, height: 0});
    $('#quantity_of_boards').val(0);
    $('#section1').css('background-image', 'none');
    $('#section1_logo').attr('src', '');
    $('#section1').css('background-color', '#ffffff');
    $('#attributes').val("null");
    canvas.clear();
    if(window.location.search !== '?board=new') {
        location.reload();
    }

    localStorage.removeItem("section1State");
    localStorage.removeItem("selectedColor");
    localStorage.removeItem("background_upload");
    localStorage.removeItem("logo_url");
    localStorage.removeItem("boardProperties");
    localStorage.removeItem("custom_board_dimensions");
    localStorage.removeItem("title_bg_color");
    localStorage.removeItem("title_header_color");
    localStorage.removeItem("custom_logo");
    localStorage.removeItem("canvasState");
    localStorage.removeItem("shape_filler");
    localStorage.removeItem("shape_stroke");
    localStorage.removeItem("text_filler");
    localStorage.removeItem("text_stroke");
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
            // console.log('Board reset successfully:');
        },
        error: function (error) {
            console.error('Error retrieving data:');
        }
    });
}

function deleteImage(imageUrl) {
    // Generate nonce
    var nonce = amerison_vars.nonce;

    // Add nonce to data
    var data = {
        action: 'delete_image_callback',
        image_url: imageUrl,
        security: nonce
    };

    // Send the request
    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: data,
        post_type: 'attachment',
        success: function(response) {
            console.log('Image deleted successfully');
        },
        error: function(error) {
            console.error('Error deleting image', error);
        }
    });
}




function clearlinksFromDb(value, imageUrl) {
    const board_id = window.location.search.split('=')[1];
    const data = {
        action: 'clearLinksFromDb',
        value: value,
        board_id: board_id,
        image_url: imageUrl
    };
    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: data,
        success: function (response) {
            // console.log('Data retrieved successfully:');
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
        $('#custom_width').val('');
        $('#custom_height').val('');
    } else if (board_dimensions === 'custom') {
        $('#custom_board_dimensions').css('display', 'flex');
    } else {
        $('#custom_board_dimensions').css('display', 'none');
        // $('#board_dimensions').val('48x72');
    }
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
    customBoardDimensions();
    saveSectionState();
});

function customBoardDimensions() {
    const board_width = $('#custom_width').val();
    const board_height = $('#custom_height').val();
    let previous_board_dimensions = localStorage.getItem("previous_board_dimensions");
    if (board_width && board_height && board_width <= 120 && board_height <= 120) {
        var dimensions = adjustChildSize( board_width, board_height);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height',  dimensions.height + 'px');
        canvas.setWidth(dimensions.width);
        canvas.setHeight(dimensions.height);
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
}


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
    // console.log(id, title);
    $('#confirmDeleteModal').modal('show');
    $('#delete_board').text(title);
    $('#confirmDeleteModal').find('#delete_board_id').val(id);
});

$('#confirmDeleteBtn').on('click', function() {
    var id = $('#confirmDeleteModal').find('#delete_board_id').val();
    // console.log('Deleting board with id: ', id);
    var data = {
        action: 'deleteBoard',
        board_id: id
    };
    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: data,
        success: function (response) {
            // console.log('Board deleted successfully');
            window.location.reload();
        },
        error: function (error) {
            console.error('Error deleting board');
        }
    });
});

function createNewBoard() {
    // console.log('Creating new board');
    $('#section1').removeAttr('style');
    $('#title_position').val('left');
    $('#board_dimensions').val('24x72');
    $('#background_color').val('#ffffff');
    $('#board_style').val('Wall Mount');
    $('#board_material').val('StorShield');
    $('#custom_logo').val({top: 0, left: 0, width: 0, height: 0});
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
        // console.log('Wall Mount');
        image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png');
        image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png';
    } else if (board_style === 'Mobile') {
        // console.log('Mobile');
        image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png');
        image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png';
    } else {
        // console.log('Magnet Mounted');
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

function changeSVGColor(svgImageUrl, color, selectedId, alt) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", svgImageUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Parse the SVG content as XML
            var parser = new DOMParser();
            var svgDoc = parser.parseFromString(xhr.responseText, "image/svg+xml");
            // console.log(svgDoc, 'svgDoc');

            // Access the SVG elements, e.g., paths
            var paths = svgDoc.querySelectorAll("path");
            // console.log(paths, 'paths');
            paths.forEach(function(path) {
                if (alt === 'solid') {
                    if (color === 'rgba(0, 0, 0, 0)') {
                        path.style.fill = "#000000";
                    } else {
                        path.style.fill = color;
                    }
                } else if (alt === 'outline') {
                    if (color === 'rgba(0, 0, 0, 0)') {
                        if (path.classList.contains('cls-2')) {
                            path.style.fill = "#000000";
                        } else if (path.classList.contains('cls-3') || path.classList.contains('cls-1')) {
                            path.style.fill = "white";
                        } else {
                            path.style.fill = "#000000";
                        }
                    } else {
                        if (path.classList.contains('cls-2')) {
                            path.style.fill = color;
                        } else if (path.classList.contains('cls-3') || path.classList.contains('cls-1')) {
                            path.style.fill = "white";
                        } else {
                            path.style.fill = color;
                        }
                    }
                } else {
                    path.style.fill = "#000000";
                }
            });

            // Serialize the modified SVG back to a string
            var svgString = new XMLSerializer().serializeToString(svgDoc);
            // console.log(svgString, 'svgString');

            // Create a new blob with the modified SVG content
            var blob = new Blob([svgString], { type: "image/svg+xml" });

            // Create a URL for the blob
            var url = URL.createObjectURL(blob);

            // Update the src attribute of the original img element with the modified SVG
            // var imgElement = document.querySelector("img[src='" + svgImageUrl + "']");
            var imgElement = $('#tool_img_' + selectedId)[0];
            // console.log(imgElement, 'imgElement');
            imgElement.src = url;
            saveSectionState();
            updateDatabase();
        }
    };
    // console.log(xhr, 'xhr');
    if (xhr.status !== 404) {
        xhr.send();
    }
}


$('#searchInput').on('input', function() {
    $('.loader').show();
    const searchTerm = $(this).val().toLowerCase().trim();
    $('#section2 .flex-column').each(function() {
        const productName = $(this).find('span').text().toLowerCase().trim();
        // console.log(productName, 'productName');
        const id = $(this).find('img').data('id');
        // console.log(id, 'id');
        if (productName.includes(searchTerm)) {
            // console.log('Match found');
            $('#nameList_' + id).show();
        } else {
            // console.log("No match found");
            $('#nameList_' + id).hide();
        }
    });
    $('.loader').hide();
});


var canvas;
var state;
var undo = [];
var redo = [];

canvas = new fabric.Canvas('canvas');
var drawingMode = 'pencil';
var isTextAdded = false;
var isRectAdded = false;
var isCircleAdded = false;
$('.canvas-container').css({
    zIndex: 999,
    position: 'absolute',
});

function setDrawingMode(mode) {
    drawingMode = mode;
    if (mode === 'pencil') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = 'black';
    } else {
        canvas.isDrawingMode = false;
    }
    canvas.renderAll();
    saveState();
}

function addRectangle() {
    if (!isRectAdded) {
    isRectAdded = true;
    canvas.selection = true;
    canvas.isDrawingMode = false;
    canvas.add(new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 50,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        selectable: true,
        evented: true
    }));
    canvas.renderAll();
    saveState();
    }
}

function addCircle() {
    if (!isCircleAdded) {
    isCircleAdded = true;
    canvas.selection = true;
    canvas.isDrawingMode = false;
    canvas.add(new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: 'transparent',
        stroke: 'black',
        strokeWidth: 2,
        selectable: true,
        evented: true
    }));
    canvas.renderAll();
    saveState();
    }
}



function addText() {
    if (!isTextAdded) {
    isTextAdded = true;
    canvas.selection = true;
    canvas.isDrawingMode = false;
    var text = new fabric.Textbox('Type here', {
        left: 100,
        top: 200,
        width: 150,
        fontSize: 12,
        fontFamily: 'Arial',
        fill: 'black',
        editable: true,
        selectable: true,
        evented: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    text.hiddenTextarea.focus();
    canvas.renderAll();
    saveState();
    }
}

// // logo crop function
// function cropLogo() {
//     var activeObject = canvas.getActiveObject();
//     if (activeObject) {
//         var cropped = activeObject.toDataURL({
//             format: 'png',
//             left: activeObject.left,
//             top: activeObject.top,
//             width: activeObject.width,
//             height: activeObject.height
//         });
//         var img = new Image();
//         img.src = cropped;
//         img.onload = function() {
//             var canvas = document.createElement('canvas');
//             var ctx = canvas.getContext('2d');
//             canvas.width = activeObject.width;
//             canvas.height = activeObject.height;
//             ctx.drawImage(img, 0, 0, activeObject.width, activeObject.height, 0, 0, activeObject.width, activeObject.height);
//             var dataURL = canvas.toDataURL('image/png');
//             activeObject.setElement(new Image(dataURL));
//             canvas.renderAll();
//             saveState();
//         };
//     }
// }



function saveState() {
    redo = [];
    $('#drawing_redo').prop('disabled', true);
    if (state) {
        undo.push(state);
        $('#drawing_undo').prop('disabled', false);
    }
    state = JSON.stringify(canvas.toJSON());
    localStorage.setItem("canvasState", state);
    saveSectionState();
    updateDatabase();
}

function replay(playStack, saveStack, onButton, offButton) {
    saveStack.push(state);
    state = playStack.pop();
    var on = $(onButton);
    var off = $(offButton);
    on.prop('disabled', true);
    off.prop('disabled', true);
    canvas.clear();
    canvas.loadFromJSON(state, function() {
        canvas.renderAll();
        on.prop('disabled', false);
        if (playStack.length) {
            off.prop('disabled', false);
        }
    });
}

canvas.on('object:modified', function() {
    saveState();
});

$('#drawing_undo').click(function() {
    $('#line_stroke').css('display', 'none');

    replay(undo, redo, '#drawing_redo', this);
});

$('#drawing_redo').click(function() {
    $('#line_stroke').css('display', 'none');

    replay(redo, undo, '#drawing_undo', this);
});

// saveState();

$('#drawing_select').on('click', function() {
    canvas.selection = true;
    canvas.isDrawingMode = false;
    isRectAdded = false;
    isCircleAdded = false;
    isTextAdded = false;

    saveState();
});

$("#drawing_pencil").click(function() {
    drawingMode = 'pencil';
    $('#line_stroke').css('display', 'block');
    setDrawingMode(drawingMode);
    
});

$("#drawing_rectangle").click(function() {
    $('#line_stroke').css('display', 'none');
    addRectangle();
});

$("#drawing_circle").click(function() {
    $('#line_stroke').css('display', 'none');
    addCircle();
});

$("#drawing_text").click(function() {
    $('#line_stroke').css('display', 'none');
    addText();
});

$('#drawing_eraser').click(function() {
    $('#line_stroke').css('display', 'none');
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
        canvas.remove(activeObject);
    }
    saveState();
});

$('#drawing_clear').click(function() {
    $('#line_stroke').css('display', 'none');
    canvas.clear();
    saveState();
});

// Enable object dragging
canvas.on('mouse:down', function(options) {
    if (drawingMode === 'pencil') {
    canvas.selection = false;
    } else {
    canvas.selection = true;
    }
});

// Reset flags when deselecting objects
canvas.on('selection:cleared', function(options) {
    isTextAdded = false;
    isRectAdded = false;
});

// Handle shape selection
$('.shape-items').click(function() {
    var shape = $(this)[0].dataset.shape;
    $('#shape_dropdown').html('<i class="text-black fa fa-'+ shape +'"></i> ');
});

$('.drawing_line').on('click', function() {
    var width = $(this)[0].dataset.width;
    // console.log(width, 'width');
    canvas.freeDrawingBrush.width = width;
    $('#line_dropdown span').css('height', width, 'px', 'width', '15px');
});

$('#text_size').on('change', function() {
    $('#line_stroke').css('display', 'none');
    var size = $(this).val();
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().set('fontSize', size);
        canvas.renderAll();
        saveState();
    }
});

canvas.on('path:created', function() {
    saveState();
});

$('#drawing_fill').on('change', function() {
    $('#line_stroke').css('display', 'none');

    var color = $(this).val();
    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject().type === 'textbox' ? true : false;
        const path = canvas.getActiveObject().type === 'path' ? true : false;
        console.log(text, path, 'text, path');

        if (!text) {
            if (path) {
                canvas.getActiveObject().set('fill', 'transparent');
            } else {
                canvas.getActiveObject().set('fill', color);
                canvas.renderAll();
            }
            saveState();
        }
    }
});

$('#drawing_stroke').on('change', function() {
    $('#line_stroke').css('display', 'none');

    var color = $(this).val();
    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject().type === 'textbox' ? true : false;
        const path = canvas.getActiveObject().type === 'path' ? true : false;
        if (!text) {
            if (path) {
                canvas.getActiveObject().set('stroke', 'black');
            } else {
                canvas.getActiveObject().set('stroke', color);
            }
            canvas.renderAll();
            saveState();
        }
    }
});

$('#colorPickerToggle').on('click', function() {
    $('#line_stroke').css('display', 'none');
    $('#drawing_stroke').click();
});


$('#fill_color_text').on('change', function() {
    $('#line_stroke').css('display', 'none');

    var color = $(this).val();
    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject() === null ? false : canvas.getActiveObject().type === 'textbox' ? true : false;
        if (text) {
            canvas.getActiveObject().set('fill', color);
            canvas.renderAll();
            saveState();
        }
    }
});

$('#stroke_color_text').on('change', function() {
    $('#line_stroke').css('display', 'none');

    var color = $(this).val();
    if (canvas.getActiveObject()) {
        const text = canvas.getActiveObject() === null ? false : canvas.getActiveObject().type === 'textbox' ? true : false;
        if (text) {
            canvas.getActiveObject().set('stroke', color);
            canvas.getActiveObject().set('strokeWidth', 0.5);
            canvas.renderAll();
            saveState();
        }
    }
});

$('#stroke_color_toggle').on('click', function(e) {
    e.preventDefault();
    $('#line_stroke').css('display', 'none');
    // $('#stroke_color_text').click();
    $('#stroke_color_text').trigger('click');
});

$('#stroke_color_text').on('change', function() {
    $('#stroke_color_toggle').css('border-color', $(this).val());
});

$('#drawing_stroke').on('change', function() {
    $('#colorPickerToggle').css('border-color', $(this).val());
});

// when user select any object on the canvas then show the line stroke options
canvas.on('selection:created', function() {
    $('#drawing_eraser').css('display', 'block');
});

// if user click outside the canvas then hide the line stroke options
canvas.on('selection:cleared', function() {
    $('#drawing_eraser').css('display', 'none');
});

// const fontCheck = new Set([
//   'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
//     'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
//   ].sort());
//   (async() => {
//     await document.fonts.ready;
//     const fontAvailable = new Set();
//     for (const font of fontCheck.values()) {
//       if (document.fonts.check(`12px "${font}"`)) {
//         fontAvailable.add(font);
//       }
//     }
//     console.log([...fontAvailable.values()]);
//     $("#text_font").append([...fontAvailable.values()].map((font) => `<option value="${font}">${font}</option>`).join(''));
//   })();

$("#text_font").on('change', function() {
    $('#line_stroke').css('display', 'none');

    var font = $(this).val();
    canvas.getActiveObject().set('fontFamily', font);
    canvas.renderAll();
});

// after load the page run saveState function one time after 2 seconds
setTimeout(function() {
    updateBoardDimensions();
}, 500);

$("#image-container").draggable({
    scroll: false,
    drag: function(event, ui) {
        if ($(this).hasClass('resizable')) {
            // If the resizable element is being dragged, prevent it from affecting the position of other elements
            ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({target: $('.ui-resizable-handle')}).ratio;
        }
        updateDatabase();
        saveSectionState();
    }
});

$("#image-container").resizable({
    containment: "#section1",
    aspectRatio: true,
    handles: 'ne, se, sw, nw',
    resize: function(event, ui) {
        var originalWidth = $("#section1_logo").prop("naturalWidth");
        var originalHeight = $("#section1_logo").prop("naturalHeight");
        var newWidth = ui.size.width;
        var newHeight = (originalHeight / originalWidth) * newWidth;
        $("#section1_logo").css("width", newWidth);
        $("#section1_logo").css("height", newHeight);

    },
    stop: function(event, ui) {
        updateDatabase();
        saveSectionState();
    }
});

// var image = document.getElementById('section1_logo');
// var cropper;

// $("#crop-button").click(function() {
//     $('#line_stroke').css('display', 'none');

//     if (!cropper) {
//         cropper = new Cropper(image, {
//             // aspectRatio: 16 / 9, // You can change the aspect ratio as needed
//             crop: function(event) {
//                 // Output the cropped image data URL
//                 var croppedDataURL = cropper.getCroppedCanvas().toDataURL();
//                 // console.log(croppedDataURL);

//                 // Update the image source to the cropped image URL
//                 $("#section1_logo").attr("src", croppedDataURL);
//                 localStorage.setItem("logo_url", croppedDataURL);
//             }
//         });
//     } else {
//         // Finalize the crop and destroy the Cropper.js instance
//         cropper.crop();
//         cropper.destroy();
//         cropper = null;
//     }
// });


$("#request_custom_tool").on('click', function() {
    $('#request_a_custom_tool').modal('show');
});

$(".request_custom_close").on('click', function() {
    $('#request_a_custom_tool').modal('hide');
});

$(".measuring_close").on('click', function() {
    $('#measuring_a_custom_tool').modal('hide');
});

$("#request_measuring_form").on('click', function() {
    $('#measuring_a_custom_tool').modal('show');
    $('#request_a_custom_tool').modal('hide');
});


$("#submit_custom_tool").on("click", function() {
    var file = $('#custom_tool_image').prop('files')[0];
    var board_id = window.location.search.split('=')[1];

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var formData = new FormData();
            formData.append('action', 'process_custom_tool_request');
            formData.append('board_id', board_id);
            formData.append('file', file);

            $.ajax({
                url: amerison_vars.ajaxurl,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    // Hide modal on success
                    // console.log('Custom tool request sent successfully');
                    $('#custom_tool_image').val('');
                    $('#request_a_custom_tool').modal('hide');
                    toastr.success('Custom tool request sent successfully');
                },
                error: function(error) {
                    console.error('Error sending custom tool request');
                }
            });
        }
        reader.readAsDataURL(file);
    }
});



$("#submit_measuring_tool").on("click", function() {
    showPreloader();
    const name = $('#measuring_tool_name').val();
    const address = $('#measuring_postal_address').val();
    const quantity = $('#measuring_tool_quantity').val();
    const comments = $('#measuring_tool_features').val();
    const totalCost = $('#measuring_tool_company').val();
    var board_id = window.location.search.split('=')[1];

    var formData = new FormData();
    formData.append('action', 'process_measuring_tool_request');
    formData.append('board_id', board_id);
    formData.append('name', name);
    formData.append('address', address);
    formData.append('quantity', quantity);
    formData.append('comments', comments);
    formData.append('totalCost', totalCost);

    $.ajax({
        url: amerison_vars.ajaxurl,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            // Hide modal on success
            $('#measuring_a_custom_tool').modal('hide');
            hidePreloader();
            toastr.success('Measuring tool request sent successfully');
        },
        error: function(error) {
            console.error('Error sending measuring tool request');
        }
    });
});


$('#color-picker').on('click', function() {
    $('#drawing_fill').click();
});

if (window.location.search === '?board=new') {
    createNewBoard();
    clearLocalStorage();
} else {
    getDataFromDb();
    saveSectionState();
}
allowDrop();
// googleFontList();

});