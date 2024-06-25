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
    custom_logo: { top: '', left: '', width: '', height: '' },
    quantity_of_boards: '',
}

const colors = ['#aa182c', '#a87bc9', '#ff5100', '#ffd600', '#9ea1a2', '#6d3628', '#005cb9', '#0db14b', '#ee4d9a', '#231f20', '#ffffff'];
let console_disabled = false;
let originalColor;

const nullFunc = function () { };
console = new Proxy(console, {
    get(target, prop, receiver) {
        if (prop === 'log' && console_disabled) {
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
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}



jQuery(document).ready(function ($) {

    init();

    $(".draggable").on('touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    const attributesDropdown = $('#attributes');
    const section2 = $('#section2');
    const custom_section = $('#custom_section');


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

    function adjustToolSize(w, h) {
        th_inch = h;

        var cb_dim = $('#board_dimensions').val();
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
        // console.log("cb_dim", cb_dim);
        cb_dim = cb_dim == null ? '' : cb_dim.split('x');
        bh_inch = cb_dim[1];
        bw_inch = cb_dim[0];

        bh_px = $('#section1').height();

        var pixelsForToolHeight = getToolpx(bh_inch, bh_px, th_inch);

        const header_height = $("#title_background_color").height()




        return { width: w, height: (pixelsForToolHeight - header_height) };
    }

    function adjustChildSize(w, h) {
        var viewportWidth = $('#left_section').width();
        var viewportHeight = $('#left_section').height();

        var aspectRatio = w / h;

        var width = viewportWidth;
        var height = (viewportWidth) / aspectRatio;

        if (height > viewportHeight) {
            height = viewportHeight;
            width = height * aspectRatio;
        }
        boardWithTool();
        canvas.setWidth(width);
        canvas.setHeight(height - 10);
        return { width: width, height: (height - 10) };
    }

    function boardWithTool() {
        let board = $("#section1").width();
        let tool = $(".draggable-container img");
        let toolWidth = tool.width();

        if (((toolWidth * tool.length) - 80) > board) {
        } else {
        }
    }


    function appendColorPalette(item, colors, top, left, id = 0, randId) {
        const colorPalette = $('<div class="custom-color-picker" id=""><div class="color-input cursor-pointer" style="background-color: black" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to change the tool color."><div class="color-options" data-id="' + randId + '"></div></div>');
        item.append(colorPalette);
        const stainlessSteel = $('#board_material').val();
        if (stainlessSteel !== 'ToughSteel') {
            $('.custom-color-picker').addClass('hide-important');
        }

        const colorOptions = colorPalette.find('.color-options');

        colors.forEach(color => {
            const colorOption = $('<div class="custom-color" style="background-color: ' + color + '"></div>');
            colorOptions.append(colorOption);
        });

        colorPalette.css({
            top: (top + 30) + "px",
            left: (left + 4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
            position: "absolute",
            display: "none",
        });

        colorPalette.find('.color-input').click(function () {
            $(this).find('.color-options').toggle();
        });

        left + 4 <= 10 ? $('.color-options').css('left', '25%') : $('.color-options').css('left', '-150%');

        colorPalette.find('.custom-color').click(function () {

            var color = $(this).css('background-color');
            localStorage.setItem("paletteColor", color);
            let selected = $(this).parents('.color-options').data('id');
            $(this).closest('.color-input').css('background-color', color);
            $(this).closest('.color-options').hide();
            $(this).closest('.custom-color-picker').find('.color-options').toggle();

            const src = $("#tool_img_" + selected).attr('src');
            const alt = $("#tool_img_" + selected).attr('alt');
            $("#tool_img_" + selected).data('color', color);

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

    function allowDrop() {
        $("#section1").droppable({
            accept: ".draggable",
            drop: function (event, ui) {
                var sourceSection = ui.draggable.closest(".section").attr("id");
                const draggableContainer = $('<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>');
                $(this).append(draggableContainer);

                if (event.target.id === "section1" && sourceSection !== "section1") {
                    const $clone = ui.helper.clone();
                    let width = $clone.data('width');
                    let height = $clone.data('height');
                    let id = $clone.data('id');
                    let image = $clone.data('image');

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

                    const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_' + randomId + '">X</span>');
                    draggableContainer.append(closeButton);

                    closeButton.css({
                        top: (ui.position.top) + "px",
                        left: (left + 4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
                        position: "absolute",
                    });

                    appendColorPalette(draggableContainer, colors, ui.position.top, ui.position.left, id, randomId);
                    if ($('#board_material').val() === 'ToughSteel') {
                        changeSVGColor(image, 'black', randomId, 'outline');
                    }

                    closeButton.click(function () {
                        draggableContainer.remove();
                        updateDatabase();
                    });
                    dragElement();
                } else if (event.target.id === "section1" && sourceSection === "section1") {
                    const existingContainer = ui.draggable.closest(".draggable-container");
                    draggableContainer.append(ui.draggable);
                    draggableContainer.css({
                        zIndex: 9999,
                    });
                    let id = ui.draggable.data('id');
                    let randomId = GN();

                    ui.draggable.attr("id", "tool_img_" + randomId);

                    const closeButton = existingContainer.find('.close-button');
                    closeButton.attr('id', 'delete_' + randomId);
                    closeButton.attr('data-bs-toggle', 'tooltip');
                    closeButton.attr('data-bs-placement', 'top');
                    closeButton.attr('data-bs-trigger', 'hover focus');
                    closeButton.attr('title', 'Click here to remove the tool.');

                    draggableContainer.append(closeButton);

                    let left = ui.position.left;
                    closeButton.css({
                        top: ui.position.top + "px",
                        left: (left + 4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
                        position: "absolute",
                    });

                    const colorPalette = existingContainer.find('.custom-color-picker');
                    const color = colorPalette.find('.color-input').css('background-color');
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
            start: function () {
                originalColor = $("#section1 .color-box-customization .set_board_title").css("color");
                console.log(originalColor, 'originalColor');
            },
            stop: function () {
                $("#section1 .color-box-customization .set_board_title").css("color", originalColor);
            }
        });
    }

    $("#section2, #custom_section").on("click", ".cloneable-items", function () {
        var section1 = $("#section1");
        var left = section1.offset().left;
        var top = section1.offset().top;
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
        const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_' + randomId + '">X</span>');
        draggableContainer.append(closeButton);
        closeButton.css({
            top: 0 + "px",
            left: (left + 4) <= 40 ? (left + 50) + "px" : (left + 4) + "px",
            position: "absolute",
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
                $('#section1').droppable('destroy');
                allowDrop();
                saveSectionState();
                boardWithTool();
                if ($(this).hasClass('resizable')) {
                    ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({ target: $('.ui-resizable-handle') }).ratio;
                }
            }
        });
    }

    // if the page url is /configurator
    var url = window.location.href;
    if (url.includes('configurator')) {
        if (WP_ATTRIBUTES !== undefined && WP_ATTRIBUTES.pa_color !== undefined) {
            WP_ATTRIBUTES.pa_color.values.forEach(color => {
                if (color !== 'Custom') {
                    attributesDropdown.append('<option value="' + color.toLowerCase() + '">' + color + '</option>');
                }
            });
        }
    }

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
            var dimensions = adjustChildSize(widthPercentage, heightPercentage);
            $('#section1').css('width', dimensions.width + 'px');
            $('#section1').css('height', dimensions.height + 'px');
        } else {
            $('#custom_board_dimensions').css('display', 'flex');
        }

        $('#set_board_title').text(boardProperties.board_title);
        $('#section1').css('background-color', boardProperties.background_color);

        var color = getBoardMaterial(boardProperties.board_material);
        $('#section1').css('background-color', color);

        const title_bg_color = $('#title_bg_color').val();
        $('#title_background_color').css('background-color', title_bg_color);

        localStorage.setItem("title_bg_color", title_bg_color);

        const title_header_color = $('#title_header_color').val();
        $('#set_board_title').css('color', title_header_color);

        localStorage.setItem("title_header_color", title_header_color);

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
        const background_url = localStorage.getItem("background_upload");
        if (background_url && board_material !== 'ToughSteel') {
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
        getCustomImages();

        const selectedColor = attributesDropdown.val();
        localStorage.setItem("selectedColor", selectedColor);
        localStorage.setItem("section1State", JSON.stringify(section1Items));
        localStorage.setItem("boardProperties", JSON.stringify(boardProperties));
    }

    setInterval(function () {
        if (window.location.search !== '?board=new') {
            changeBG();
            updateBoardDimensions();
        }
        hideCart();
    }, 500);

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    let stanelessSteelPrompt = false;
    function changeBG() {
        const title_bg_color = $('#title_bg_color').val();
        $('#title_background_color').css('background-color', title_bg_color);
        localStorage.setItem("title_bg_color", title_bg_color);

        const title_header_color = $('#title_header_color').val();
        $('#set_board_title').css('color', title_header_color);
        localStorage.setItem("title_header_color", title_header_color);

        const board_material = $('#board_material').val();

        if (board_material === 'ToughSteel') {
            $('#section1').css('background-color', 'rgb(192, 192, 192)');
            if (!stanelessSteelPrompt) {
                $('#stanelessSteelPrompt').modal('show');
            }
            $('#attributes option[value="solid"]').remove();
            // $('#attributes').val($('#attributes option:eq(1)').val());
            $('.custom-color-picker').addClass('hide-important');
        } else {
            const background_color = $('#background_color').val();
            $('#section1').css('background-color', background_color);
            localStorage.setItem("background_color", background_color);
            stanelessSteelPrompt = false;
            // add solid option if it doesn't exist
            if ($('#attributes option[value="solid"]').length === 0) {
                $('#attributes').append('<option value="solid">Solid</option>');
            }
            $('.custom-color-picker').removeClass('hide-important');

        }


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
                    const data = response[0];
                    if (data != undefined && data != null && data.config_data != null) {
                        const section1Items = JSON.parse(data.config_data.replace(/\\/g, ''));
                        const selectedColor = data.options;

                        $('#board_title').val(data.board_title);
                        $('#set_board_title').text(data.board_title);
                        $('#title_position').val(data.title_position);
                        $('#background_color').val(data.background_color);
                        $('#board_style').val(data.board_style);
                        $('#board_material').val(data.board_material);
                        $('#quantity_of_boards').val(data.quantity_of_boards);


                        if (data.canvasState !== undefined && data.canvasState !== null && data.canvasState !== '') {
                            const canvasState = JSON.parse(data.canvasState.replace(/\\/g, ''));
                            canvas.loadFromJSON(canvasState, function () {
                                canvas.renderAll();
                            });
                        }

                        const board_dimensions = data.board_dimensions.split('x');
                        const board_width = board_dimensions[0];
                        const board_height = board_dimensions[1];
                        var dimensions = adjustChildSize(board_width, board_height);

                        $('#section1').css('width', dimensions.width + 'px');
                        $('#section1').css('height', dimensions.height + 'px');
                        for (const item of section1Items) {
                            if (item.image !== undefined) {
                                let randomId = GN();
                                const newItem = $('<div class="item draggable draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>');
                                const newImage = $('<img src="' + item.image + '" data-image="' + item.image + '" alt="' + item.alt + '" data-id="' + item.id + '" data-h1="' + item.h1 + '" data-w1="' + item.w1 + '" data-height="' + item.height + '" data-width="' + item.width + '" id="tool_img_' + randomId + '" class="item draggable" />');
                                const closeButton = $('<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool.">X</span>');

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
                                    left: (item.left + 4) <= 40 ? (item.left + 50) + "px" : (item.left + 4) + "px",
                                    position: "absolute",
                                });
                                appendColorPalette(newItem, colors, item.top, item.left, item.id, randomId);

                                newItem.find('.color-input').css('background-color', item.color);

                                changeSVGColor(item.image, item.color, randomId, item.alt);


                                $("#section1").append(newItem);

                                closeButton.click(function () {
                                    newItem.remove();
                                });
                            }
                        }

                        $('#attributes').val(selectedColor);

                        if (selectedColor) {
                            getVariationImage(selectedColor);
                        }
                        getBoardMaterial(data.board_material)

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
                            });
                            $('#section1_logo').css({
                                width: custom_logo.width + "px",
                            });
                        }

                        const background_url = data.background_url;
                        if (background_url && data.board_material !== 'ToughSteel') {
                            $('#section1').css('background-image', 'url(' + background_url + ')');
                            $('#section1').css('background-size', 'cover');
                            $('#section1').css('background-repeat', 'no-repeat');
                            const parts = background_url.split('/');
                            const imageName = parts[parts.length - 1];
                            $('#background_name').text(imageName);
                        } else {
                            $('#section1').css('background-image', 'none');
                        }

                        $('#board_dimensions').val(data.board_dimensions);

                        localStorage.setItem("custom_board_dimensions", data.board_dimensions);


                        const title_bg_color = data.title_bg_color;
                        $('#title_bg_color').val(title_bg_color);

                        const title_header_color = data.title_header_color;
                        $('#title_header_color').val(title_header_color);
                        saveSectionState();
                        dragElement();
                        updateTitlePosition();
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
        if (url.includes('configurator')) {
            for (const product of WP_PRODUCTS) {
                for (const variation of product.variations) {
                    const imageSrc = variation.image;
                    let width = variation.width;
                    let height = variation.height;
                    var dimensions = adjustToolSize(width, height);

                    if (color === variation.attributes.attribute_pa_color) {
                        section2.append('<div class="flex-column" style="display: flex;" id="nameList_' + variation.id + '"><img src="' + imageSrc + '" alt="' + color + '" data-image="' + imageSrc + '" class="draggable cloneable-items" data-id="' + variation.id + '" data-width="' + dimensions.width + '" data-h1="' + height + '" data-w1="' + width + '" data-height="' + dimensions.height + '" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">' + variation.title + '</span></div>');
                    } else if (color === 'null') {
                        section2.append('<div class="alert alert-danger no-custom-tools fs-6 h-auto d-flex justify-content-center rounded-0 mb-0">You haven\'t select tool type yet.</div>');
                        return;
                    }
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
        let anyConditionTrue = false;

        if (url.includes('configurator')) {
            for (const product of WP_PRODUCTS) {
                for (const variation of product.variations) {
                    const imageSrc = variation.image;
                    let width = variation.width;
                    let height = variation.height;
                    var dimensions = adjustToolSize(width, height);

                    const current_user_id = amerison_vars.user_id;

                    const type = variation.toolType.replace(/<p>/g, '').replace(/<\/p>\n/g, '');

                    if (variation.attributes.attribute_pa_color === '110' && current_user_id === variation.user_id && type) {
                        anyConditionTrue = true;
                        custom_section.append('<div class="flex-column" style="display: flex;" id="nameList_' + variation.id + '"><img src="' + imageSrc + '" alt="' + type + '" data-image="' + imageSrc + '" class="draggable cloneable-items outline-draggable" data-id="' + variation.id + '" data-width="' + dimensions.width + '" data-h1="' + height + '" data-w1="' + width + '" data-height="' + dimensions.height + '" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">' + variation.title + '</span></div>');
                    }
                }
            }

            if (!anyConditionTrue) {
                custom_section.append('<div class="alert alert-danger no-custom-tools fs-6 h-auto d-flex justify-content-center rounded-0 mb-0">You haven\'t requested a custom tool yet.</div>');
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

    function getBoardMaterial(material) {
        const board_material = $('#board_material').val();
        const bg_color = $('#background_color').val();
        var section_color = $('#section1').css('background-color');
        var section_background_image = $('#section1').css('background-image');

        const defaultBackgroundColor = 'rgb(255, 255, 255)';
        let section1BackgroundColor;

        if (board_material === 'ToughSteel') {
            section1BackgroundColor = 'rgb(192, 192, 192)';

            $('#section1').css('background-image', 'none');
        } else {
            if (section_color === 'rgb(255, 255, 255)' || section_color === '#ffffff') {
                switch (board_material) {
                    case 'ToughGuard':
                    case 'ToughGuard+':
                    case 'ToughLite':
                    case 'ToughLam':
                        section1BackgroundColor = defaultBackgroundColor;
                        break;
                    case 'ToughClear':
                        section1BackgroundColor = 'rgba(0, 0, 0, 0)';
                        $('#section1').css('border', '1px solid #000');
                        break;
                    default:
                        section1BackgroundColor = bg_color;
                        break;
                }

                $('#section1').css('background-image', section_background_image);
            } else {
                section1BackgroundColor = bg_color;

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
                $('#dot_alert').css('display', 'block');
                setTimeout(function () {
                    $('#dot_alert').css('display', 'none');
                }, 1000);
            },
            error: function (error) {
                $('#dot_alert').css('display', 'block');
                $('#dot_alert').css('background-color', 'red');
                setTimeout(function () {
                    $('#dot_alert').css('display', 'none');
                }, 1000);
            }
        });
    }

    $('#logo_images').on('change', function () {
        var fileInput = this;
        var file = fileInput.files[0];
        showPreloader();

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
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
                    success: function (response) {
                        localStorage.setItem("logo_url", response.url);
                        localStorage.setItem("logo_image", response.url);
                        $('#section1_logo').attr('src', response.url);
                        const parts = response.url.split('/');
                        const imageName = parts[parts.length - 1];
                        $('#logo_name').text(imageName);
                        $('#image-container').css({
                            display: "flex",
                        });
                        $('#image-container').draggable({
                            drag: function (event, ui) {
                                if ($(this).hasClass('resizable')) {
                                    ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({ target: $('.ui-resizable-handle') }).ratio;
                                }
                            }
                        });
                        $('#image-container').resizable({
                            containment: "#section1",
                        });
                        hidePreloader();
                    },
                    error: function (error) {
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

    $('#background_image_upload').on('change', function () {
        var fileInput = this;
        var file = fileInput.files[0];
        showPreloader();

        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
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
                    success: function (response) {
                        const board_material = $('#board_material').val();
                        if (board_material !== 'ToughSteel') {
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
                    error: function (error) {
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

    $('.show_ToughSteel_model').on('click', function () {
        const board_material = $('#board_material').val();
        if (board_material === 'ToughSteel') {
            $('#backgroundImageModel').modal('show');
        }
    });
    $('[data-toggle="tooltip"]').tooltip();

    const collapseOne = $('#collapseOne');
    if (collapseOne.length) {
        var accordion = new bootstrap.Collapse(collapseOne, { toggle: false });
    }


    $('#collapseTwo').on('hidden.bs.collapse', function () {
        if (!accordion._isTransitioning) {
            accordion.show();
        }
    });


    $(window).on('beforeunload', function () {
        saveSectionState();
    });

    $('#board_title, #title_bg_color, #title_header_color, #background_color, #board_style, #board_material, #quantity_of_boards').on('change', function () {
        updateDatabase();
        saveSectionState();
        updateTitlePosition();
    });

    $('#title_position').on('change', function () {
        updateTitlePosition();
    });

    $('#board_dimensions, #custom_height').on('change', function () {
        updateBoardDimensions();
        updateDatabase();
        saveSectionState();
    });


    function updateBoardDimensions() {
        let s2_data = $('#section2 img');
        let custom_data = $('#custom_section img');
        let s1_data = $('#section1 .draggable-container img');

        for (let i = 0; i < s2_data.length; i++) {
            let height = s2_data[i].dataset.h1;
            let width = s2_data[i].dataset.w1;
            let custom = adjustToolSize(width, height);
            let id = s2_data[i].dataset.id;
            for (let j = 0; j < s1_data.length; j++) {
                if (id === s1_data[j].dataset.id) {
                    s1_data.eq(j).css("height", "" + custom.height + "px");
                }
            }
        }

        for (let i = 0; i < custom_data.length; i++) {
            let height = custom_data[i].dataset.h1;
            let width = custom_data[i].dataset.w1;
            let custom = adjustToolSize(width, height);
            let id = custom_data[i].dataset.id;
            for (let j = 0; j < s1_data.length; j++) {
                if (id === s1_data[j].dataset.id) {
                    s1_data.eq(j).css("height", "" + custom.height + "px");
                }
            }
        }
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

    $('#clear-background-image').on('click', function () {
        const image_url = localStorage.getItem("background_upload");
        localStorage.removeItem("background_upload");
        $('#section1').css('background-image', 'none');
        $('#background_image_upload').val('');
        $('#background_name').text('');
        clearlinksFromDb('background_url', image_url);
    });
    $('#clear_logo_image').on('click', function () {
        const logo = localStorage.getItem("logo_image");
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

    $('#reset_board').on('click', function () {
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
        $('#stanelessSteelPrompt').modal('hide');
        stanelessSteelPrompt = true;
    });

    $('.boardWithToolClose').on('click', function () {
        $('#boardWithTool').modal('hide');
    });

    $('.closeModel1').on('click', function () {
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
        $('#board_material').val("ToughLite");
        $('#custom_logo').val({ top: 0, left: 0, width: 0, height: 0 });
        $('#quantity_of_boards').val(0);
        $('#section1').css('background-image', 'none');
        $('#section1_logo').attr('src', '');
        $('#section1').css('background-color', '#ffffff');
        $('#attributes').val("null");
        canvas.clear();

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
        console.log(board_id);
        const data = {
            action: 'reset_board',
            board_id: board_id
        };
        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                $('#title_position').val('center');
                updateDatabase();
                if (window.location.search !== '?board=new') {
                    location.reload();
                }
            },
            error: function (error) {
                console.error('Error retrieving data:');
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
            },
            error: function (error) {
                console.error('Error retrieving data:');
            }
        });
    }

    $('#board_dimensions, #custom_width, #custom_height').on('change', function () {
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
        }
    });

    $('#dimentionConfirm').on('click', function () {
        $('#dimentionConfirmationModal').modal('hide');
    });

    $('.close-button').on('click', function () {
        $(this).parent().remove();
        $('#custom_board_dimensions').css('display', 'none');
        updateDatabase();
    });

    $('.custom_values').on('change', function () {
        customBoardDimensions();
        saveSectionState();
    });

    function isValidDimension(dimension) {
        return dimension && dimension <= 120;
    }

    function customBoardDimensions() {
        const board_width = $('#custom_width').val();
        const board_height = $('#custom_height').val();
        let previous_board_dimensions = localStorage.getItem("previous_board_dimensions");
        if (isValidDimension(board_width) && isValidDimension(board_height)) {
            var dimensions = adjustChildSize(board_width, board_height);
            $('#section1').css('width', dimensions.width + 'px');
            $('#section1').css('height', dimensions.height + 'px');
            canvas.setWidth(dimensions.width);
            canvas.setHeight(dimensions.height);
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





    function showPreloader() {
        const preloader = $('#preloader');
        preloader.append('<div class="spinner"></div>');
        preloader.css('display', 'flex');
    }

    function hidePreloader() {
        const preloader = $('#preloader');
        preloader.empty();
        preloader.css('display', 'none');
    }


    $('.delete-board').on('click', function () {
        var deleteBoard = $(this)[0];
        var id = deleteBoard.dataset.boardId;
        var title = deleteBoard.dataset.boardTitle;
        $('#confirmDeleteModal').modal('show');
        $('#delete_board').text(title);
        $('#confirmDeleteModal').find('#delete_board_id').val(id);
    });

    $('#confirmDeleteBtn').on('click', function () {
        var id = $('#confirmDeleteModal').find('#delete_board_id').val();
        var data = {
            action: 'deleteBoard',
            board_id: id
        };
        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                window.location.reload();
            },
            error: function (error) {
                console.error('Error deleting board');
            }
        });
    });

    function createNewBoard() {
        $('#section1').removeAttr('style');
        $('#title_position').val('left');
        $('#board_dimensions').val('24x72');
        $('#background_color').val('#ffffff');
        $('#board_style').val('Wall Mount');
        $('#board_material').val('ToughGuard');
        $('#custom_logo').val({ top: 0, left: 0, width: 0, height: 0 });
        $('#quantity_of_boards').val(0);
        $('#section1').css('background-color', '#ffffff');
        $('#attributes').val("null");
        const dimensions = adjustChildSize(24, 72);
        $('#section1').css('width', dimensions.width + 'px');
        $('#section1').css('height', dimensions.height + 'px');

    }

    $('#board_style_config').on('click', function () {
        let board_style = $('#board_style').val();
        let image = $('#image1');
        var viewerOptions = {
            toolbar: false,
            navbar: false,
            movable: false,
            hidden: function () {
                viewer.destroy();
            }
        };

        if (board_style === 'Wall Mount') {
            image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png');
            image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png';
        } else if (board_style === 'Mobile') {
            image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png');
            image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png';
        } else {
            image.attr('src', 'https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png');
            image[0].dataset.original = 'https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png';
        }
        var viewer = new Viewer(document.getElementById('image1'), viewerOptions);
        viewer.show();
    });


    const Image = `<img src="" data-original="" alt="Board Style Wall Mount" id="image1" class="img-fluid d-none" />`;
    $('body').append(Image);

    function changeSVGColor(svgImageUrl, color, selectedId, alt) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", svgImageUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var parser = new DOMParser();
                var svgDoc = parser.parseFromString(xhr.responseText, "image/svg+xml");

                var paths = svgDoc.querySelectorAll("path");
                paths.forEach(function (path) {
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
                                path.style.fill = "transparent";
                            } else {
                                path.style.fill = "#000000";
                            }
                        } else {
                            if (path.classList.contains('cls-2')) {
                                path.style.fill = color;
                            } else if (path.classList.contains('cls-3') || path.classList.contains('cls-1')) {
                                path.style.fill = "transparent";
                            } else {
                                path.style.fill = color;
                            }
                        }
                    } else {
                        path.style.fill = "#000000";
                    }
                });

                var svgString = new XMLSerializer().serializeToString(svgDoc);
                var blob = new Blob([svgString], { type: "image/svg+xml" });
                var url = URL.createObjectURL(blob);

                var imgElement = $('#tool_img_' + selectedId)[0];
                imgElement.src = url;
                imgElement.dataset.color = color;
                saveSectionState();
                updateDatabase();
            }
        };
        if (xhr.status !== 404) {
            xhr.send();
        }
    }


    $('#searchInput').on('input', function () {
        $('.loader').show();
        const searchTerm = $(this).val().toLowerCase().trim();
        $('#section2 .flex-column').each(function () {
            const productName = $(this).find('span').text().toLowerCase().trim();
            const id = $(this).find('img').data('id');
            if (productName.includes(searchTerm)) {
                $('#nameList_' + id).show();
            } else {
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
        canvas.loadFromJSON(state, function () {
            canvas.renderAll();
            on.prop('disabled', false);
            if (playStack.length) {
                off.prop('disabled', false);
            }
        });
    }

    canvas.on('object:modified', function () {
        saveState();
    });

    $('#drawing_undo').click(function () {
        $('#line_stroke').css('display', 'none');

        replay(undo, redo, '#drawing_redo', this);
    });

    $('#drawing_redo').click(function () {
        $('#line_stroke').css('display', 'none');

        replay(redo, undo, '#drawing_undo', this);
    });


    $('#drawing_select').on('click', function () {
        canvas.selection = true;
        canvas.isDrawingMode = false;
        isRectAdded = false;
        isCircleAdded = false;
        isTextAdded = false;

        saveState();
    });

    $("#drawing_pencil").click(function () {
        drawingMode = 'pencil';
        $('#line_stroke').css('display', 'block');
        setDrawingMode(drawingMode);

    });

    $("#drawing_rectangle").click(function () {
        $('#line_stroke').css('display', 'none');
        addRectangle();
    });

    $("#drawing_circle").click(function () {
        $('#line_stroke').css('display', 'none');
        addCircle();
    });

    $("#drawing_text").click(function () {
        $('#line_stroke').css('display', 'none');
        addText();
    });

    $('#drawing_eraser').click(function () {
        $('#line_stroke').css('display', 'none');
        var activeObject = canvas.getActiveObject();
        if (activeObject) {
            canvas.remove(activeObject);
        }
        saveState();
    });

    $('#drawing_clear').click(function () {
        $('#line_stroke').css('display', 'none');
        canvas.clear();
        saveState();
    });

    canvas.on('mouse:down', function (options) {
        if (drawingMode === 'pencil') {
            canvas.selection = false;
        } else {
            canvas.selection = true;
        }
    });

    canvas.on('selection:cleared', function (options) {
        isTextAdded = false;
        isRectAdded = false;
    });

    $('.shape-items').click(function () {
        var shape = $(this)[0].dataset.shape;
        $('#shape_dropdown').html('<i class="text-black fa fa-' + shape + '"></i> ');
    });

    $('.drawing_line').on('click', function () {
        var width = $(this)[0].dataset.width;
        canvas.freeDrawingBrush.width = width;
        $('#line_dropdown span').css('height', width, 'px', 'width', '15px');
    });

    $('#text_size').on('change', function () {
        $('#line_stroke').css('display', 'none');
        var size = $(this).val();
        if (canvas.getActiveObject()) {
            canvas.getActiveObject().set('fontSize', size);
            canvas.renderAll();
            saveState();
        }
    });

    canvas.on('path:created', function () {
        saveState();
    });

    $('#drawing_fill').on('change', function () {
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

    $('#drawing_stroke').on('change', function () {
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

    $('#colorPickerToggle').on('click', function () {
        $('#line_stroke').css('display', 'none');
        $('#drawing_stroke').click();
    });


    $('#fill_color_text').on('change', function () {
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

    $('#stroke_color_text').on('change', function () {
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

    $('#stroke_color_toggle').on('click', function (e) {
        e.preventDefault();
        $('#line_stroke').css('display', 'none');
        $('#stroke_color_text').trigger('click');
    });

    $('#stroke_color_text').on('change', function () {
        $('#stroke_color_toggle').css('border-color', $(this).val());
    });

    $('#drawing_stroke').on('change', function () {
        $('#colorPickerToggle').css('border-color', $(this).val());
    });

    canvas.on('selection:created', function () {
        $('#drawing_eraser').css('display', 'block');
    });

    canvas.on('selection:cleared', function () {
        $('#drawing_eraser').css('display', 'none');
    });


    $("#text_font").on('change', function () {
        $('#line_stroke').css('display', 'none');

        var font = $(this).val();
        canvas.getActiveObject().set('fontFamily', font);
        canvas.renderAll();
    });

    setTimeout(function () {
        updateBoardDimensions();
    }, 500);

    $("#image-container").draggable({
        scroll: false,
        drag: function (event, ui) {
            if ($(this).hasClass('resizable')) {
                ui.position.top = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / $(this).data("ui-draggable")._mouseDrag({ target: $('.ui-resizable-handle') }).ratio;
            }
            updateDatabase();
            saveSectionState();
        }
    });

    $("#image-container").resizable({
        containment: "#section1",
        aspectRatio: true,
        handles: 'ne, se, sw, nw',
        resize: function (event, ui) {
            var originalWidth = $("#section1_logo").prop("naturalWidth");
            var originalHeight = $("#section1_logo").prop("naturalHeight");
            var newWidth = ui.size.width;
            var newHeight = (originalHeight / originalWidth) * newWidth;
            $("#section1_logo").css("width", newWidth);
            $("#section1_logo").css("height", newHeight);

        },
        stop: function (event, ui) {
            updateDatabase();
            saveSectionState();
        }
    });

    stripe = Stripe(amerison_vars.stripe);
    var elements = stripe.elements();
    var card = elements.create('card');

    $("#request_custom_tool").on('click', function () {
        card.mount('#card-element');
        $('#request_a_custom_tool').modal('show');
    });

    $(".request_custom_close").on('click', function () {
        $('#request_a_custom_tool').modal('hide');
    });

    $(".measuring_close").on('click', function () {
        card.unmount();
        $('#measuring_a_custom_tool').modal('hide');
    });

    $("#request_measuring_form").on('click', function () {
        card.unmount();
        card.mount('#card-element-measuring');
        $('#measuring_a_custom_tool').modal('show');
        $('#request_a_custom_tool').modal('hide');
    });

    $('#larger_price').append(amerison_vars.large_measuring);
    $('#custom_price').append(amerison_vars.custom_price);


    /*
    * Handle custom tool submission
    */
    $("#submit_custom_tool").on("click", function () {
        var file = $('#custom_tool_image').prop('files')[0];
        var board_id = window.location.search.split('=')[1];

        if (file && board_id) {
            var cardElement = elements.getElement('card');
            stripe.createToken(cardElement).then(function (result) {
                if (result.error) {
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                    toastr.error(result.error.message);
                } else {
                    var token = result.token;
                    initiatePayment(file, board_id, token);
                }
            });
        } else {
            toastr.error("Please upload a file.")
        }
    });

    /*
    * Initiate payment for custom tool request
    */
    function initiatePayment(file, board_id, token) {
        showPreloader();

        var amount = (amerison_vars.custom_price * 100) ?? 0;
        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: {
                action: 'initiate_stripe_payment',
                token: token,
                amount: amount
            },
            success: function (response) {
                toastr.success('Payment processed successfully');
                submitForm(file, board_id);
            },
            error: function (error) {
                console.error('Error processing payment:', error);
                hidePreloader();
            }
        });
    }

    /*
    * Submit custom tool request
    */
    function submitForm(file, board_id) {
        if (file) {
            var reader = new FileReader();

            reader.onload = function (e) {
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
                    success: function (response) {
                        $('#custom_tool_image').val('');
                        $('#request_a_custom_tool').modal('hide');
                        hidePreloader();
                        toastr.success('Custom tool request sent successfully');
                    },
                    error: function (error) {
                        console.error('Error sending custom tool request');
                    }
                });
            }
            reader.readAsDataURL(file);
        } else {
            toastr.error("File not found");
        }
    }

    /*
    * Handle custom tool submission withot payment
    */
    // $("#submit_custom_tool").on("click", function() {
    //     var file = $('#custom_tool_image').prop('files')[0];
    //     var board_id = window.location.search.split('=')[1];

    //     if (file) {
    //         var reader = new FileReader();

    //         reader.onload = function(e) {
    //             var formData = new FormData();
    //             formData.append('acion', 'process_custom_tool_request');
    //             formData.append('board_id', board_id);
    //             formData.append('file', file);

    //             $.ajax({
    //                 url: amerison_vars.ajaxurl,
    //                 type: 'POST',
    //                 data: formData,
    //                 contentType: false,
    //                 processData: false,
    //                 success: function(response) {
    //                     $('#custom_tool_image').val('');
    //                     $('#request_a_custom_tool').modal('hide');
    //                     toastr.success('Custom tool request sent successfully');
    //                 },
    //                 error: function(error) {
    //                     console.error('Error sending custom tool request');
    //                 }
    //             });
    //         }
    //         reader.readAsDataURL(file);
    //     }
    // });



    /*
    * Handle larger measuring sheet submission
    */
    $("#submit_measuring_tool").on("click", function () {
        showPreloader();
        const name = $('#measuring_tool_name').val();
        const address = $('#measuring_postal_address').val();
        const quantity = $('#measuring_tool_quantity').val();
        const comments = $('#measuring_tool_features').val();
        const totalCost = $('#measuring_tool_company').val();
        var board_id = window.location.search.split('=')[1];

        // name, address, quantity, comments, totalCost validation
        if (name === '' || address === '' || quantity === '' || comments === '' || totalCost === '') {
            hidePreloader();
            toastr.error('Please fill all the fields');
            return;
        }

        var cardElement = elements.getElement('card');
        stripe.createToken(cardElement).then(function (result) {
            if (result.error) {
                hidePreloader();
                toastr.error(result.error.message);
            } else {
                var token = result.token;
                initiateMeasuringPayment(board_id, token, name, address, quantity, comments, totalCost);
            }
        });
    });

    /*
    * Initiate payment for measuring sheet request
    */
    function initiateMeasuringPayment(board_id, token, name, address, quantity, comments, totalCost) {
        var amount = (amerison_vars.large_measuring * 100) ?? 0;

        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: {
                action: 'initiate_stripe_payment',
                token: token,
                amount: amount
            },
            success: function (response) {
                toastr.success('Payment processed successfully');
                submitMeasuringForm(board_id, name, address, quantity, comments, totalCost, response.data);
            },
            error: function (error) {
                console.error('Error processing payment:', error);
            }
        });
    }

    /*
    * Submit measuring sheet request
    * ALTER TABLE `wp_mak2m40npq_measure_request` ADD COLUMN `payment_intent` varchar(255) NULL;
    */
    function submitMeasuringForm(board_id, name, address, quantity, comments, totalCost, payment_intent) {
        var formData = new FormData();
        formData.append('action', 'process_measuring_tool_request');
        formData.append('board_id', board_id);
        formData.append('name', name);
        formData.append('address', address);
        formData.append('quantity', quantity);
        formData.append('comments', comments);
        formData.append('totalCost', totalCost);
        formData.append('payment_intent', payment_intent);

        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                $('#measuring_a_custom_tool').modal('hide');
                hidePreloader();
                toastr.success('Measuring tool request sent successfully');
            },
            error: function (error) {
                console.error('Error sending measuring tool request');
            }
        });
    }

    /*
    * Handle larger measuring sheet submission withot payment
    */
    // $("#submit_measuring_tool").on("click", function() {
    //     showPreloader();
    //     const name = $('#measuring_tool_name').val();
    //     const address = $('#measuring_postal_address').val();
    //     const quantity = $('#measuring_tool_quantity').val();
    //     const comments = $('#measuring_tool_features').val();
    //     const totalCost = $('#measuring_tool_company').val();
    //     var board_id = window.location.search.split('=')[1];

    //     var formData = new FormData();
    //     formData.append('action', 'process_measuring_tool_request');
    //     formData.append('board_id', board_id);
    //     formData.append('name', name);
    //     formData.append('address', address);
    //     formData.append('quantity', quantity);
    //     formData.append('comments', comments);
    //     formData.append('totalCost', totalCost);

    //     $.ajax({
    //         url: amerison_vars.ajaxurl,
    //         type: 'POST',
    //         data: formData,
    //         contentType: false,
    //         processData: false,
    //         success: function(response) {
    //             $('#measuring_a_custom_tool').modal('hide');
    //             hidePreloader();
    //             toastr.success('Measuring tool request sent successfully');
    //         },
    //         error: function(error) {
    //             console.error('Error sending measuring tool request');
    //         }
    //     });
    // });


    $('#color-picker').on('click', function () {
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
    getAmerisanPricingSize();

    /*
    * Add to cart functionality for the board items
    */

    function rgb2hex(rgb) {
        if (rgb.search("rgb") == -1) {
            return rgb;
        } else {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {
                return ("0" + parseInt(x).toString(16)).slice(-2);
            }
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
    }

    $('#add_to_cart').on('click', function () {
        var boardData = $('#section1 .draggable-container img');
        var boardDataArray = [];
        boardData.each(function () {
            var product_id = $(this).data('id');
            var color = $(this).data('color');
            // rgb to hex conversion
            if (color && color.includes('rgb')) {
                color = rgb2hex(color);
            } else {
                color = "#000000";
            }
            boardDataArray.push({ product_id: product_id, quantity: 1, color: color });
        });

        var data = {
            action: 'addBoardDataToCart',
            products: boardDataArray
        };
        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: data,
            success: function (response) {
                toastr.success('Tools are added to cart successfully');
            },
            error: function (error) {
                console.error('Error adding board to cart');
            }
        });
    });

    function hideCart() {
        const tools = $("#section1 .draggable-container img");

        if (tools.length == 0) {
            $('#add_to_cart').css({
                display: 'none'
            })
        } else {
            $('#add_to_cart').css({
                display: 'block'
            })
        }
    }

    $('form.checkout').on('checkout_place_order', function () {
        $('form.checkout').append('<div id="preloader" class="preloader"></div>');
        if ($('form.checkout').find('.woocommerce-error').length === 0) {
            showPreloader();
        }
    });

    $('.bdt-gallery-thumbnail img').click(function () {
        // Find the closest parent portfolio item element
        var portfolioItem = $(this).closest('.bdt-portfolio-inner');

        // Find the title link within the portfolio item
        var titleLink = portfolioItem.find('.bdt-portfolio-desc a');

        // Get the product page URL from the title link's href attribute
        var productPageURL = titleLink.attr('href');

        // Navigate to the product page URL
        window.location.href = productPageURL;
    });


    // ajax to get the size from pricing table
    function getAmerisanPricingSize() {
        const nonce = amerison_vars.nonce;
        $.ajax({
            url: amerison_vars.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_amerisan_pricing_size',
                nonce: nonce
            },
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    const sizes = response.data;
                    $('#board_dimensions').empty();
                    sizes.forEach(function (size) {
                        $('#board_dimensions').append('<option value="' + size.size + '">' + size.size + '</option>');
                    });
                } else {
                    console.error('Error retrieving data:', response.data.message);
                }
            },
            error: function (error) {
                console.error('Error in AJAX request:', error);
            }
        });
    }




    // html2canvas to download the image

    function downloadImage() {
        html2canvas(document.querySelector("#left_section")).then(function (canvas) {
            var link = document.createElement("a");
            link.download = "board.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    

});
