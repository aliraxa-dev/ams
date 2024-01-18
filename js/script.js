jQuery(document).ready(function ($) {

    $(".draggable").draggable({
        revert: "invalid",
        helper: "clone",
        start: function (event, ui) {
            // Store original position on drag start
            $(this).data("originalPosition", ui.helper.offset());
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

    const attributesDropdown = $('#attributes');
    const section2 = $('#section2');

    WP_ATTRIBUTES.pa_color.values.forEach(color => {
        attributesDropdown.append('<option value="' + color.toLowerCase() + '">' + color + '</option>');
    });

    attributesDropdown.change(function () {
        const selectedColor = $(this).val();
        getVariationImage(selectedColor);
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

        const selectedColor = attributesDropdown.val();
        localStorage.setItem("selectedColor", selectedColor);

        localStorage.setItem("section1State", JSON.stringify(section1Items));
    }

    function loadSectionState() {
        const savedState = localStorage.getItem("section1State");
        const selectedColor = localStorage.getItem("selectedColor");

        if (savedState) {
            const section1Items = JSON.parse(savedState);
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
        }

        attributesDropdown.val(selectedColor);

        if (selectedColor) {
            getVariationImage(selectedColor);
        }
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
        const ajaxurl = WP_AJAX.ajax_url;
        const color = localStorage.getItem("selectedColor");
        const data = {
            action: 'update_configurator_data',
            section1Items: JSON.stringify(section1Items),
            color: color
        };
        $.ajax({
            url: ajaxurl, // WordPress AJAX URL
            type: 'POST',
            data: data,
            success: function(response) {
                console.log('Data updated successfully:', response);
            },
            error: function(error) {
                console.error('Error updating data:', error);
            }
        });
    }
    

    $(window).on('beforeunload', function () {
        saveSectionState();
    });

    loadSectionState();
    allowDrop();
});