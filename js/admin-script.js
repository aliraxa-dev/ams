
jQuery(document).ready(function ($) {

    $('#delete_all_boards').on('click', function() {
        if (confirm('Are you sure you want to delete all boards?')) {
            $.post('<?= $delete_all ?>', {
                action: 'delete_all'
            }, function(response) {
                if (response) {
                    console.log('All boards deleted successfully!');
                    location.reload();
                }
            });
        }
    });

    $('.delete-board').on('click', function() {
        var board_id = $(this).data('id');
        if (confirm('Are you sure you want to delete this board?')) {
            $.post(ajaxurl, {
                action: 'delete_all',
                board_id: board_id
            }, function(response) {
                if (response) {
                    location.reload();
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


    // $('.send-measuring-sheet').on("click", function() {
    //     var requestId = $(this).data('id');
    //     var file = $('#upload_file_measure_' + requestId).prop('files')[0];
        // showPreloader();

    //     if (file) {
    //         var render = new FileReader();
    //         render.onload = function(e) {
    //             var formData = new FormData();
    //             formData.append('action', 'send_measuring_sheet_email');
    //             formData.append('request_id', requestId);
    //             formData.append('file', file);

    //             $.ajax({
    //                 url: ajaxurl,
    //                 type: 'POST',
    //                 data: formData,
    //                 contentType: false,
    //                 processData: false,
    //                 success: function(response) {
                        // hidePreloader();
    //                     alert('Measuring sheet sent successfully!');
    //                     location.reload();
    //                 },
    //                 error: function(xhr, status, error) {
    //                     alert('Failed to send measuring sheet.');
    //                 }
    //             });
    //         }
    //         render.readAsDataURL(file);
    //     }
    // });

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
