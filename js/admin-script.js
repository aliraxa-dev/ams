
jQuery(document).ready(function ($) {

    $('#delete_all_boards').on('click', function() {
        if (confirm('Are you sure you want to delete all boards?')) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'delete_all'
                },
                success: function(response) {
                    location.reload();
                },
                error: function(xhr, status, error) {
                    alert('Failed to delete boards.');
                }
            });
        }
    });


    $('.delete-board').on('click', function() {
        var board_id = $(this).data('id');
        console.log(board_id);
        if (confirm('Are you sure you want to delete this board?')) {
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'deleteBoard',
                    board_id: board_id
                },
                success: function(response) {
                    location.reload();
                },
                error: function(xhr, status, error) {
                    alert('Failed to delete board.');
                }
            });
        }
    });

    $('.tabcontent').not(':first').hide();

    // Click event handler for tab links
    $('.tablink').click(function() {
        var tabId = $(this).data('tab');
        $('.tabcontent').hide();
        $('#' + tabId).show();
        // toggle active class
        $('.tablink').removeClass('bg-danger');
        $('.tablink').addClass('text-dark');
        $('.tablink').removeClass('text-white');
        $(this).addClass('bg-danger');
        $(this).addClass('text-white');

        // when user reload the page, the tab should be active
        localStorage.setItem('activeTab', tabId);
    });

    // Get the active tab from local storage
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        $('.tabcontent').hide();
        $('#' + activeTab).show();
        $('.tablink').removeClass('bg-danger');
        $('.tablink').addClass('text-dark');
        $('.tablink').removeClass('text-white');
        $('.tablink[data-tab="' + activeTab + '"]').addClass('bg-danger');
        $('.tablink[data-tab="' + activeTab + '"]').addClass('text-white');
    }

    $('.close-model').on('click', function() {
        $('#uploadToolModel').css({
            "display": "none",
        })
    });

    $('.upload-custom-tool').on('click', function() {
        var requestId = $(this).data('id');
        console.log(requestId);
        $('#request-id').val(requestId);
        $('#uploadToolModel').css({
            "display": "block",
        });
    });



    $('#upload_file').click(function() {
        // showPreloader();
        var fileInput = $('#upload-file')[0].files[0];
        var widthInput = $('#tool_width').val();
        var heightInput = $('#tool_height').val();
        var requestId = $('#request-id').val();
        var toolType = $('#tool_type').val();

        // Validate file type
        if (fileInput && fileInput.type === 'image/svg+xml' && widthInput && heightInput && requestId && toolType !== "null") {
            var reader = new FileReader();
            reader.onload = function(e) {
                var formData = new FormData();
                formData.append('file', fileInput);
                formData.append('width', widthInput);
                formData.append('height', heightInput);
                formData.append('request_id', requestId);
                formData.append('tool_type', toolType);
                formData.append('action', 'submit_custom_tool_design');

                // Function to create WooCommerce product
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        alert('Custom Product created successfully.');
                        $('#upload-file').val('');
                        $('#tool_width').val('');
                        $('#tool_height').val('');
                        $('#request-id').val('');
                        $('#tool_type').val('null');

                        // hide the modal
                        $('#uploadToolModel').css('display', 'none');
                        // hidePreloader();
                        location.reload();
                    },
                    error: function(error) {
                        alert(error.responseText);
                    }
                });
            };
            reader.readAsDataURL(fileInput);
        } else {
            alert('Please upload an SVG file.');
        }
    });

    $('.send-measuring-sheet').on("click", function() {
        var requestId = $(this).data('id');
        // showPreloader();

        var formData = new FormData();
        formData.append('action', 'send_measuring_sheet_email');
        formData.append('request_id', requestId);

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                // hidePreloader();
                alert('Measuring sheet delivered successfully!');
                location.reload();
            },
            error: function(xhr, status, error) {
                alert('Failed to send measuring sheet.');
            }
        });
    });

    $('.stripe-refund').on("click", function() {
        var id = $(this).data('id');
        var payment_amount = (admin.large_measuring * 100) ?? 0;

        var formData = {
            action: 'initiate_stripe_refund',
            id: id,
            payment_amount: payment_amount
        };

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData,
            success: function(response) {
                alert(response.data);
                location.reload();
            },
            error: function(xhr, status, error) {
                alert('Failed to initiate refund.');
            }
        });
    });

    // show popup on click
    $('.update_price').on("click", function() {
        showPreloader();
        var id = $(this).data('id');
        console.log(id);
        var formData = {
            action: 'get_amerisan_pricing_by_id',
            id: id
        };
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData,
            success: function(response) {
                console.log(response);
                // populate data
                $('#update_price_id').val(response.data.id);
                $('#inputSize').val(response.data.size);
                $('#inputToughLite').val(response.data.toughlite);
                $('#inputToughGuard').val(response.data.toughguard);
                $('#inputToughGuardPlus').val(response.data.toughguardplus);
                $('#inputToughClear').val(response.data.toughclear);
                $('#updatePriceModal').modal('show');

                hidePreloader();
            },
            error: function(xhr, status, error) {
                alert('Failed to fetch price of current size.');
            }
        });
    });

    $('#submit_price').on("click", function() {
        var id = $('#update_price_id').val();
        var toughlite = $('#inputToughLite').val();
        var toughguard = $('#inputToughGuard').val();
        var toughguardplus = $('#inputToughGuardPlus').val();
        var toughclear = $('#inputToughClear').val();
        showPreloader();
        var formData = {
            action: 'update_amerisan_pricing_by_id',
            id: id,
            toughlite: toughlite,
            toughguard: toughguard,
            toughguardplus: toughguardplus,
            toughclear: toughclear
        };
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData,
            success: function(response) {
                hidePreloader();
                // alert(response.data);
                location.reload();
            },
            error: function(xhr, status, error) {
                alert('Failed to update price of current size.');
            }
        });
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

});
