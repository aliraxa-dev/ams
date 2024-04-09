<?php
/*
Plugin Name: Amerison Configurator
Description: This plugin is used to create a product configurator.
Version: 1.0
Author: Ali Raza
URL: aliraza.live
*/

// Enqueue the necessary scripts and styles

function enqueue_amerison_scripts() {
    $timestamp = time();
    wp_enqueue_style('amerison_style', plugin_dir_url(__FILE__) . 'css/style.css', array(), $timestamp);
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js', array('jquery'), null, true);
    wp_enqueue_script('amerison_script', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery', 'jquery-ui'), $timestamp, true);
    // add bootstrap css and js
    wp_enqueue_style('jquery-ui-css', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
    wp_enqueue_style('cropper-css', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.css');
    wp_enqueue_script('popper-js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js', array(), $timestamp, true);
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
    wp_enqueue_style('toaster-css', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css', array(), null);
    wp_enqueue_style('viewerjs-css', 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.css');
    wp_enqueue_script('viewerjs', 'https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.6/viewer.min.js', array(), null, true);
    wp_enqueue_script('fabric-js', 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js', array(), null, true);
    wp_enqueue_script('cropperjs', 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js', array(), null, true);
    wp_enqueue_script('toaster-js', 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js', array(), null, true);


    // Pass Ajax URL to script.js
    wp_localize_script(
        'amerison_script',
        'amerison_vars',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'user_id' => get_current_user_id(),
        )
    );
}
add_action('wp_enqueue_scripts', 'enqueue_amerison_scripts');

function enqueue_admin_bootstrap() {
    // Enqueue Bootstrap CSS
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

    // Enqueue Bootstrap JavaScript (optional)
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');
}
add_action('admin_enqueue_scripts', 'enqueue_admin_bootstrap');

function enqueue_admin_assets() {
    $timestamp = time();
    // Enqueue your custom CSS
    wp_enqueue_style('custom-admin-css', plugin_dir_url(__FILE__) . '/css/style.css', array(), $timestamp);

    // Enqueue your custom JavaScript
    wp_enqueue_script('custom-admin-js', plugin_dir_url(__FILE__) . '/js/admin-script.js?v=001', array('jquery'), $timestamp, true);

    wp_localize_script(
        'amerison_script',
        'amerison_vars',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
        )
    );
}
add_action('admin_enqueue_scripts', 'enqueue_admin_assets');



function configurator_page() {
    $page_title = 'Boards List';
    $menu_title = 'Boards List';
    $capability = 'manage_options';
    $menu_slug = 'amerison-configurator';
    $function = 'configurator_page_content';
    $icon_url = 'dashicons-admin-generic';
    $position = 20;

    add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position);

    $sub_menu_title = 'Custom Requests';
    $sub_menu_slug = 'request-custom-tool';
    $sub_function = 'request_custom_tool_page_content';
    add_submenu_page($menu_slug, $page_title, $sub_menu_title, $capability, $sub_menu_slug, $sub_function);
}

add_action('admin_menu', 'configurator_page');


// Add the page content for the configurator page list all the boards
function configurator_page_content() {
    $configurator = get_all_boards();
    $delete_all = admin_url('admin-ajax.php?action=delete_all');

    // show the list of all the boards here in the table
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">List of Boards</h1>

    <!-- Delete All Boards -->
    <button id="delete_all_boards" class="button button-primary" style="margin-left: 20px; float: inline-end; margin-bottom: 20px;">Delete All Boards</button>

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th style="width: 60px">ID</th>
                <th>Title</th>
                <th>Dimensions</th>
                <th>Board Color</th>
                <th>Style</th>
                <th>Material</th>
                <th>Quantity</th>
                <th>Logo</th>
                <th>Background</th>
                <th>Updated at</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($configurator as $board) : ?>
                <tr>
                    <td><?= $board->id ?></td>
                    <td><?= $board->board_title ?></td>
                    <td><?= $board->board_dimensions ?></td>
                    <td>
                        <div style="border: 1px solid black; width: 30px; height: 30px; background-color: <?= $board->background_color ?>;"></div>
                    </td>

                    <td><?= $board->board_style ?></td>
                    <td><?= $board->board_material ?></td>
                    <td><?= $board->quantity_of_boards ?></td>
                    <td>
                        <?php if (!empty($board->logo_url)): ?>
                            <img src="<?= $board->logo_url ?>" alt="Logo" style="width: 30px">
                        <?php else: ?>
                            No Logo
                        <?php endif; ?>
                    </td>

                    <td>
                        <?php if (!empty($board->background_url)): ?>
                            <img src="<?= $board->background_url ?>" alt="Background" style="width: 30px">
                        <?php else: ?>
                            No Background
                        <?php endif; ?>
                    </td>

                    <td><?= $board->timestamp ?></td>
                    <td>
                        <!-- <a href="<?= admin_url('admin.php?page=amerison-configurator&board=' . $board->id) ?>">Edit</a> -->
                        <a href="#" class="delete-board" data-id="<?= $board->id ?>">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
    <?php
}



function request_custom_tool_page_content() {
    ?>
    <div id="preloader" class="preloader"></div>

    <div class="wrap">
        <!-- <h1 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">Request Custom Tools List</h1> -->

        <div id="tabs" style="border-bottom: 3px solid #000000;">
            <button class="tablink btn tab-color rounded-0 fw-bolder text-dark" data-tab="Tab1">Custom Tools</button>
            <button class="tablink btn tab-color rounded-0 fw-bolder text-dark" data-tab="Tab2">Measuring Sheets</button>
        </div>
        <div id="Tab1" class="tabcontent">
        <div id="custom-tools" class="tab-content py-3">
            <?php
            // Display Custom Tools Requests Table
            echo '<h4 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">Custom Tool Requests</h4>';
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>File Download</th>
                        <th>Request Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>';
            echo '<tbody>';
            $custom_tool_requests = get_custom_tool_requests();
            foreach ($custom_tool_requests as $request) {
                echo '<tr>';
                echo '<td>' . $request['id'] . '</td>';
                echo '<td>' . ucwords(get_user_name_by_id($request['user_id'])) . '</td>';
                echo '<td><a href="' . ($request['file']) . '" download>Download</a></td>';
                echo '<td>' . ($request['created_at'] === null ? 'N/A' : $request['created_at']) . '</td>';
                echo '<td>' . ($request['status']) . '</td>';
                // upload action
                echo '<td><button class="upload-custom-tool btn btn-primary cursor-pointer" ' . ($request['status'] === "Pending" ? '' : 'disabled') . ' data-id="' . $request['id'] . '">Upload</button></td>';
                echo '</tr>';
            }
            echo '</tbody>';
            echo '</table>';
            ?>

            <div class="modal" id="uploadToolModel" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Upload custom tool</h5>
                    <button type="button" class="close close-model" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="d-flex flex-column gap-2">
                        <input type="hidden" id="request-id">
                        <input type="file" class="form-control" id="upload-file">
                        <div class="form-group">
                            <label for="tool_width">Width</label>
                            <input type="number" class="form-control" id="tool_width" placeholder="Enter Width">
                            <small id="widthHelp" class="form-text text-muted">Please write tool width in inches.</small>
                        </div>
                        <div class="form-group">
                            <label for="tool_height">Height</label>
                            <input type="number" class="form-control" id="tool_height" placeholder="Enter Height">
                            <small id="heightHelp" class="form-text text-muted">Please write tool height in inches.</small>
                        </div>

                        <div class="form-group mb-3">
                            <label for="tool_type">Tool Type</label>
                            <select class="form-select form-select-sm mw-100" id="tool_type" aria-label=".form-select-sm example">
                                <option selected value=null>Select Type</option>
                                <option value="solid">Solid</option>
                                <option value="outline">Outline</option>
                            </select>
                        </div>

                        <button type="button" class="btn btn-primary" id="upload_file">Upload</button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        <div id="Tab2" class="tabcontent" style="display: none">
        <div id="measuring-tools" class="tab-content py-3">
            <?php
            // Display Measuring Tools Requests Table
            echo '<h4 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">Measuring Sheet Requests</h4>';
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>
                    <tr>
                        <th>User</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th style="width: 85px">Quantity</th>
                        <th>Comments</th>
                        <th>Total cost</th>
                        <th>Status</th>
                        <th>Request Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>';
            echo '<tbody>';
            $measuring_tool_requests = get_measuring_tool_requests();
            foreach ($measuring_tool_requests as $request) {
                echo '<tr>';
                echo '<td>' . ucwords(get_user_name_by_id($request['user_id'])) . '</td>';
                echo '<td>' . $request['name'] . '</td>';
                echo '<td>' . ($request['address'] === null ? 'N/A' : $request['address']) . '</td>';
                echo '<td>' . $request['quantity'] . '</td>';
                echo '<td>' . $request['comments'] . '</td>';
                echo '<td>' . $request['total_cost'] . '</td>';
                echo '<td>' . ($request['status']) . '</td>';
                echo '<td>' . ($request['created_at'] === null ? 'N/A' : $request['created_at']) . '</td>';
                echo '<td><button class="send-measuring-sheet btn btn-primary" ' . ($request['status'] === "Pending" ? '' : 'disabled') . ' id="send_measuring_sheet_' . $request['id'] . '" data-id="' . $request['id'] . '">Update</button></td>';
                echo '</td>';
            }
            echo '</tbody>';
            echo '</table>';
            ?>
        </div>
        </div>
    </div>
    <?php
}

function get_user_name_by_id($user_id) {
    $user_info = get_userdata($user_id);
    return $user_info ? $user_info->display_name : '';
}

function get_custom_tool_requests() {
    global $wpdb;
    // Retrieve data from custom tool requests table
    $custom_tool_requests = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}request_custom_tool", ARRAY_A);
    return $custom_tool_requests;
}

function get_measuring_tool_requests() {
    global $wpdb;
    // Retrieve data from measuring tool requests table
    $measuring_tool_requests = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}measure_request", ARRAY_A);
    return $measuring_tool_requests;
}

add_action('wp_ajax_send_measuring_sheet_email', 'send_measuring_sheet_email');
add_action('wp_ajax_nopriv_send_measuring_sheet_email', 'send_measuring_sheet_email');

// function send_measuring_sheet_email() {
//     if (isset($_POST['request_id']) && isset($_FILES['file'])) {
//         $request_id = $_POST['request_id'];

//         $upload_dir = wp_upload_dir();
//         $file_name = time() . '_' . $_FILES['file']['name'];
//         $file_tmp = $_FILES['file']['tmp_name'];
//         $file_path = $upload_dir['path'] . '/' . $file_name;
//         $file_link = $upload_dir['url'] . '/' . $file_name;


//         // Move uploaded file to the upload directory
//         if (move_uploaded_file($file_tmp, $file_path)) {
//             $id = get_sheet_by_id('id', $request_id);

//             $user_id = $id->user_id;
//             $subject = 'Measuring Sheet Request';
//             $message = "
//                 <h3>Dear " . get_user_name_by_id($user_id). ",</h3>
//                 <p>Your measuring sheet has been created. You can download it from the link below:\n</p>
//                 <p><a href=" . $file_link . ">Download Measuring Sheet</a>\n</p>
//                 <p>Thank you.</p>
//                 <p>Regards,</p>
//                 <p>Amerison</p>
//             ";

//             // Check if the file exists before sending the email
//             if (file_exists($file_path)) {
//                 send_email_to_user($user_id, $subject, $message);

//                 // Update the request status to 'Sent'
//                 global $wpdb;
//                 $table_name = $wpdb->prefix . 'measure_request';
//                 $wpdb->update($table_name, array('status' => 'Sent'), array('id' => $request_id));
//             } else {
//                 echo 'File not found.';
//             }

//         } else {
//             // Move uploaded file to the upload directory
//             if (move_uploaded_file($file_tmp, $file_path)) {
//                 // File successfully uploaded
//             } else {
//                 // Failed to move the file
//                 $last_error = error_get_last();
//                 if ($last_error) {
//                     error_log('File upload error: ' . print_r($last_error, true));
//                 }
//                 echo 'Error moving file.';
//                 wp_die();
//             }
//         }
//     }
//     wp_die();
// }

function send_measuring_sheet_email() {
    if (isset($_POST['request_id'])) {
        $request_id = $_POST['request_id'];

        $id = get_sheet_by_id('id', $request_id);
        $user_id = $id->user_id;
        $subject = 'Measuring Sheet Request';
        $message = "
            <h3>Dear " . get_user_name_by_id($user_id). ",</h3>
            <p>Your measuring sheet has been delivered. You will receive it soon.\n</p>
            <p>Thank you.</p>
            <p>Regards,</p>
            <p>Amerison</p>
        ";

        // Send email to user
        send_email_to_user($user_id, $subject, $message);

        // Update the request status to 'Sent'
        global $wpdb;
        $table_name = $wpdb->prefix . 'measure_request';
        $wpdb->update($table_name, array('status' => 'Sent'), array('id' => $request_id));

        echo 'Email sent successfully.';
    } else {
        echo 'Request ID not provided.';
    }
    wp_die();
}




function submit_custom_tool_design() {
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in.');
    }

    if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        wp_send_json_error('No file uploaded.');
    }

    $request_id = isset($_POST['request_id']) ? $_POST['request_id'] : '';

    if (empty($request_id)) {
        wp_send_json_error('Invalid board ID.');
    }

    // using request_id to get the user id from the request_custom_tool table
    $user_id = get_custom_sheet_by_id('id', $request_id)->user_id;


    // Handle file upload
    $upload_dir = wp_upload_dir();
    $file_name = time() . $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_path = $upload_dir['path'] . '/' . $file_name;
    $file_link = $upload_dir['url'] . '/' . $file_name;


    // Move the uploaded file to the upload directory
    if (!move_uploaded_file($file_tmp, $file_path)) {
        wp_send_json_error('Failed to move uploaded file.');
    }

    // Prepare attachment data
    $attachment = array(
        'guid'           => $upload_dir['url'] . '/' . $file_name,
        'post_mime_type' => $_FILES['file']['type'],
        'post_title'     => sanitize_file_name($file_name),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );

    // Insert the attachment into the media library
    $attachment_id = wp_insert_attachment($attachment, $file_path);


    $width = $_POST['width'] ? $_POST['width'] : 0;
    $height = $_POST['height'] ? $_POST['height'] : 0;
    $toolType = $_POST['tool_type'] ? $_POST['tool_type'] : '';
    // Get terms for the "Color" attribute
    $attribute_terms = get_terms('pa_color', array('hide_empty' => false));

    // print_r($attribute_terms);
    // exit;

    if (!empty($attribute_terms)) {
        $attribute_custom = $attribute_terms[2];

        $product = new WC_Product_Variable();
        $name = 'TOOL' . time();
        $product->set_name($name);
        // set image
        $product->set_image_id($attachment_id);
        $product->set_status('publish');
        $product->set_catalog_visibility('hidden');
        $product->set_description('This is a custom tool requested by a user.');
        $product->set_short_description('Custom requested Tool');
        $product->set_stock_status('in stock');

        $product->set_backorders('no');
        $product->set_tag_ids(array(23));
        $product->set_reviews_allowed(false);
        $product->set_sold_individually(false);
        $product->set_category_ids(array(25));
        $product->set_width($width);
        $product->set_height($height);
        $product->set_weight($user_id);
        $product->set_sku(time());

        $product_id = $product->save();

        // add the color attribute
        $attribute = new WC_Product_Attribute();
        $attribute->set_id( wc_attribute_taxonomy_id_by_name( 'pa_color' ) );
        $attribute->set_name( 'pa_color' );
        // see if current format attribute exists and set as var
        $pa_color_term = get_term_by('name', $woo_product_meta['format'], 'pa_color');
        if(!$pa_color_term){
            // create new pa_color term
            wp_insert_term(
                $woo_product_meta['custom'], // the term
                'pa_color' // the taxonomy
            );
            $pa_color_term = get_term_by('name', $woo_product_meta['format'], 'pa_color');
        } else {
            echo 'Existing pa_color term detected: ' . $pa_color_term->name;
        }
        $attribute->set_options( array( $attribute_custom->term_id ) );
        $attribute->set_position( 0 );
        $attribute->set_visible( true );
        $attribute->set_variation( true );
        $attribute->is_taxonomy( true );
        $attributes[] = $attribute;

        $product->set_attributes( $attributes );

        // create product variation
        $variation = new WC_Product_Variation();
        $variation->set_parent_id( $product_id );

        $variation->save();

        // set attributes
        $variation->set_attributes(
            array(
                'pa_color' => $attribute_custom->term_id,
            )
        );

        $variation->save();

        // $variation_data = $variation->get_data();

        $variation->set_image_id( $attachment_id );
        $variation->set_regular_price(0);
        $variation->set_weight($user_id);
        $variation->set_length(0);
        $variation->set_width($width);
        $variation->set_height($height);
        $variation->set_description($toolType);

        $variation->save();

        $product->save();

        // echo 'Variation added successfully.';
    } else {
        echo 'No attribute terms found.';
    }

    // update the current request status to sent
    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $wpdb->update($table_name, array('status' => 'Sent'), array('id' => $request_id));

    $subject = 'Completion of Your Custom Tool Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We're pleased to inform you that your custom tool request has been successfully completed and uploaded on Configurator.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerison</p>
    ";

    send_email_to_user($user_id, $subject, $message);

    // Send success response
    wp_send_json_success('Custom tool request sent successfully.');

}

add_action('wp_ajax_submit_custom_tool_design', 'submit_custom_tool_design');
add_action('wp_ajax_nopriv_submit_custom_tool_design', 'submit_custom_tool_design');


function send_email_to_user($user_id, $subject, $message) {
    $user_info = get_userdata($user_id);
    $to = $user_info->user_email;
    $subject = $subject;
    $message = $message;
    $headers = array('Content-Type: text/html; charset=UTF-8');

    $sent = wp_mail($to, $subject, $message, $headers);
}

function get_user_by_id($field, $value) {
    global $wpdb;
    $user = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $wpdb->users WHERE $field = %d",
        $value
    ));
    return $user;
}

function get_sheet_by_id($field, $value) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $sheet = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE $field = %d",
        $value
    ));
    return $sheet;
}

function get_custom_sheet_by_id($field, $value) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $sheet = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE $field = %d",
        $value
    ));
    return $sheet;
}


function delete_all() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "DELETE FROM $table_name";
    $wpdb->query($sql);
    wp_die();
}

add_action('wp_ajax_delete_all', 'delete_all');
add_action('wp_ajax_nopriv_delete_all', 'delete_all');


// get woocommeres products
function get_products()
{
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'orderby' => 'title',
        'order' => 'ASC',
    );

    $products = new WP_Query($args);
    $product_list = array();

    foreach ($products->posts as $product) {
        $product_id = $product->ID;

        // Get product data
        $product_data = wc_get_product($product_id);

        // Get product attributes
        $attributes = array();
        foreach ($product_data->get_attributes() as $attribute) {
            $attributes[$attribute->get_name()] = $attribute->get_options();
        }

        // Get variations
        $variations = array();
        if ($product_data->is_type('variable')) {
            foreach ($product_data->get_available_variations() as $variation) {
                $variations[] = array(
                    'title' => $product_data->get_name(),
                    'id' => $variation['variation_id'],
                    'attributes' => $variation['attributes'],
                    'price' => $variation['display_price'],
                    'image' => wp_get_attachment_url($variation['image_id']),
                    'width' => $variation['dimensions']['width'],
                    'height' => $variation['dimensions']['height'],
                    'user_id' => $variation['weight'],
                    // remove p tag from description
                    'toolType' => $variation['variation_description'],
                );
            }
        }

        $product_list[] = array(
            'id' => $product_id,
            'title' => $product_data->get_name(),
            'price' => $product_data->get_regular_price(),
            'image' => wp_get_attachment_url(get_post_thumbnail_id($product_id)),
            'link' => get_permalink($product_id),
            'attributes' => $attributes,
            'variations' => $variations,
        );
    }

    wp_reset_postdata();
    return $product_list;
}

// woo-commerce product attributes function
function get_product_attributes()
{
    $attributes = array();
    $taxonomies = array('pa_color');
    foreach ($taxonomies as $taxonomy) {
        $attribute = get_taxonomy($taxonomy);
        $attributes[$taxonomy] = array(
            'name' => $attribute->labels->singular_name,
            'values' => array(),
        );
        $terms = get_terms($taxonomy);
        foreach ($terms as $term) {
            $attributes[$taxonomy]['values'][] = $term->name;
        }
    }
    return $attributes;
}
function create_configurator_table()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        user_id mediumint(9) NULL,
        board_title varchar(14) NULL,
        title_bg_color varchar(14) NULL,
        title_header_color varchar(14) NULL,
        title_position varchar(14) NULL DEFAULT 'left',
        board_dimensions varchar(14) NULL,
        background_color varchar(14) NULL,
        board_style varchar(14) NULL,
        board_material varchar(14) NULL,
        custom_logo varchar(14) NULL,
        quantity_of_boards varchar(14) NULL,
        config_data varchar(14) NULL,
        options varchar(14) NULL,
        attachment_id mediumint(9) NULL,
        logo_url varchar(14) NULL,
        background_url varchar(14) NULL,
        canvasState varchar(14) NULL,
        timestamp datetime DEFAULT '0000-00-00 00:00:00' NULL,
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

    $resp = dbDelta($sql);

    if (is_wp_error($resp)) {
        error_log('Error creating database table: ' . $resp->get_error_message());
    } else {
        error_log('Database table created successfully!');
    }
}
register_activation_hook(__FILE__, 'create_configurator_table');

// // a function which create a column canvasState in the table configurator_data
// function add_column_to_configurator_table()
// {
//     global $wpdb;
//     $table_name = $wpdb->prefix . 'configurator_data';
//     $column_name = 'canvasState';
//     $column_type = 'text';
//     $default = 'NULL';

//     $sql = "ALTER TABLE $table_name CHANGE $column_name $column_name $column_type $default";

//     $wpdb->query($sql);
// }

// // Hook the function to plugin activation
// register_activation_hook(__FILE__, 'add_column_to_configurator_table');



function create_measure_request_table() {
    global $wpdb;

    // Define table name with WordPress prefix
    $table_name = $wpdb->prefix . 'measure_request';

    // SQL query to create table
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255),
        address VARCHAR(300),
        quantity INT,
        comments TEXT NOT NULL,
        total_cost INT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    // Include WordPress upgrade functions
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );

    // Execute SQL query to create table
    dbDelta( $sql );
}

// Hook function to plugin activation
register_activation_hook( __FILE__, 'create_measure_request_table' );


function is_measure_request_table_created() {
    global $wpdb;

    // Define table name with WordPress prefix
    $table_name = $wpdb->prefix . 'measure_request';

    // SQL query to check if the table exists
    $sql = "SHOW TABLES LIKE '$table_name'";

    // Execute SQL query
    $result = $wpdb->get_var( $sql );

    // Check if the table exists
    if ( $result == $table_name ) {
        return true;
    } else {
        return false;
    }
}

// // Example usage
// if ( is_measure_request_table_created() ) {
//     echo 'Table wp_measure_request exists!';
//     // die;
// } else {
//     echo 'Table wp_measure_request does not exist.';
//     // die;
// }

function create_request_custom_tool_table() {
    global $wpdb;

    // Define table name
    $table_name = $wpdb->prefix . 'request_custom_tool';

    // Check if table already exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        // Table doesn't exist, so we create it
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file VARCHAR(255) NOT NULL,
            width INT,
            height INT,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            board_id INT,
            user_id INT
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}

// Hook the function to plugin activation
register_activation_hook(__FILE__, 'create_request_custom_tool_table');

function process_custom_tool_request() {

    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in.');
    }

    if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        wp_send_json_error('No file uploaded.');
    }

    $board_id = isset($_POST['board_id']) ? $_POST['board_id'] : '';

    if (empty($board_id)) {
        wp_send_json_error('Invalid board ID.');
    }



    // Handle file upload
    $upload_dir = wp_upload_dir();
    // update each file name with unique name add time stamp
    $file_name = time() . $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_path = $upload_dir['path'] . '/' . $file_name;
    $file_link = $upload_dir['url'] . '/' . $file_name;

    // print_r($file_link);
    // exit;


    // Move the uploaded file to the upload directory
    if (!move_uploaded_file($file_tmp, $file_path)) {
        wp_send_json_error('Failed to move uploaded file.');
    }

    // get the current user id
    $user_id = get_current_user_id();
    $width = $_POST['width'] ? $_POST['width'] : 0;
    $height = $_POST['height'] ? $_POST['height'] : 0;

    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $wpdb->insert($table_name, array(
        'file' => $file_link,
        'width' => $width,
        'height' => $height,
        'status' => 'Pending', // default status is 'Pending
        'created_at' => current_time('mysql'), // current time
        'board_id' => $board_id,
        'user_id' => $user_id,
    ));

    $subject = 'Acknowledgement of Your Custom Tool Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We\'ve received your request for a custom tool. Further instructions will be provided soon.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerison</p>
    ";

    send_email_to_user($user_id, $subject, $message);

    // Send success response
    // wp_send_json_success('Custom tool request sent successfully.');
}

add_action('wp_ajax_process_custom_tool_request', 'process_custom_tool_request');
add_action('wp_ajax_nopriv_process_custom_tool_request', 'process_custom_tool_request');


function process_measuring_tool_request() {
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in.');
    }

    // get the current user id
    $user_id = get_current_user_id();
    $name = $_POST['name'] ? $_POST['name'] : '';
    $address = $_POST['address'] ? $_POST['address'] : '';
    $comments = $_POST['comments'] ? $_POST['comments'] : '';
    $quantity = $_POST['quantity'] ? $_POST['quantity'] : 0;
    $totalCost = $_POST['totalCost'] ? $_POST['totalCost'] : '';

    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $wpdb->insert($table_name, array(
        'user_id' => $user_id,
        'name' => $name,
        'address' => $address,
        'quantity' => $quantity,
        'comments' => $comments,
        'total_cost' => $totalCost,
        'status' => 'Pending',
        'created_at' => current_time('mysql')
    ));

    $subject = 'Acknowledgement of Your Larger Measuring Sheet Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We've received your request for a larger measuring sheet. Further instructions will be provided soon.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerison</p>
    ";
    send_email_to_user($user_id, $subject, $message);

}

add_action('wp_ajax_process_measuring_tool_request', 'process_measuring_tool_request');
add_action('wp_ajax_nopriv_process_measuring_tool_request', 'process_measuring_tool_request');



function update_configurator_data() {
   if (isset($_POST['section1Items'])) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'configurator_data';

        $user_id = get_current_user_id();
        $config_data = sanitize_text_field($_POST['section1Items']);
        $color = sanitize_text_field($_POST['color']);
        $data = $_POST['data'];
        $id = $_POST['id'];
        $canvasState = $_POST['canvasState'];


        // Check if there's existing data for the id
        $existing_data = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));

        if ($existing_data) {
            // If data exists, update it
            $wpdb->update(
                $table_name,
                array(
                    'board_title' => $data['board_title'],
                    'title_position' => $data['title_position'],
                    'title_bg_color' => $data['title_bg_color'],
                    'title_header_color' => $data['title_header_color'],
                    'board_dimensions' => $data['board_dimensions'],
                    'background_color' => $data['background_color'],
                    'board_style' => $data['board_style'],
                    'board_material' => $data['board_material'],
                    'custom_logo' => $data['custom_logo'],
                    'quantity_of_boards' => $data['quantity_of_boards'],
                    'config_data' => $config_data,
                    'options' => $color,
                    'canvasState' => $canvasState,
                    'timestamp' => current_time('mysql')
                ),
                array('id' => $id),
                array('%s', '%s', '%s','%s','%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'),
                array('%d')
            );
        } else {
            // If no data exists, insert a new record
            $wpdb->insert(
                $table_name,
                array(
                    'user_id' => $user_id,
                    'board_title' => $data['board_title'],
                    'title_position' => $data['title_position'],
                    'title_bg_color' => $data['title_bg_color'],
                    'title_header_color' => $data['title_header_color'],
                    'board_dimensions' => $data['board_dimensions'],
                    'background_color' => $data['background_color'],
                    'board_style' => $data['board_style'],
                    'board_material' => $data['board_material'],
                    'custom_logo' => $data['custom_logo'],
                    'quantity_of_boards' => $data['quantity_of_boards'],
                    'config_data' => $config_data,
                    'options' => $color,
                    'canvasState' => $canvasState,
                    'timestamp' => current_time('mysql')
                ),
                array('%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
            );
        }

        $new_id = $wpdb->insert_id;
        echo $new_id;
        wp_die();
    } else {
        wp_send_json_error('Invalid request!');
    }

}

add_action('wp_ajax_update_configurator_data', 'update_configurator_data');
add_action('wp_ajax_nopriv_update_configurator_data', 'update_configurator_data'); // Allow non-logged in users to use the AJAX endpoint

// Function to get configurator data from database table based on user id
function get_configurator_data_from_db() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';

    $user_id = get_current_user_id();
    $config_data = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM $table_name WHERE user_id = %d",
        $user_id
    ), ARRAY_A);

    return $config_data;
}

// WordPress AJAX handler for getting configurator data
add_action('wp_ajax_get_configurator_data', 'get_configurator_data');
add_action('wp_ajax_nopriv_get_configurator_data', 'get_configurator_data');

function get_configurator_data() {
    global $wpdb;

    // Get the board ID from the AJAX request
    $board_id = isset($_POST['board_id']) ? intval($_POST['board_id']) : 0;

    // Your table name
    $table_name = $wpdb->prefix . 'configurator_data';

    // Query to get configurator data based on board ID
    $config_data = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $board_id
        ),
        ARRAY_A
    );

    // Send the JSON-encoded response
    wp_send_json($config_data);
}


function get_data_by_id($board_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "SELECT * FROM $table_name WHERE id = $board_id";
    $board = $wpdb->get_row($sql);
    return $board;
}

// get all the boards if current user is admin
function get_all_boards() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "SELECT * FROM $table_name";
    $boards = $wpdb->get_results($sql);
    return $boards;
}


// function handle_logo_upload() {
//     error_log(print_r($_FILES, true));

//     if (isset($_FILES['logo_images'])) {
//         $uploaded_logo = $_FILES['logo_images'];
//         if ($uploaded_logo['error'] == 0) {
//             $upload_overrides = array('test_form' => false);
//             $movefile = wp_handle_upload($uploaded_logo, $upload_overrides);

//             if ($movefile && empty($movefile['error'])) {
//                 // File successfully uploaded, handle the attachment
//                 $attachment = array(
//                     'post_title' => sanitize_file_name($uploaded_logo['name']),
//                     'post_content' => '',
//                     'post_status' => 'inherit',
//                     'post_mime_type' => $uploaded_logo['type'],
//                 );

//                 $attach_id = wp_insert_attachment($attachment, $movefile['file']);
//                 require_once(ABSPATH . 'wp-admin/includes/image.php');
//                 $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
//                 wp_update_attachment_metadata($attach_id, $attach_data);

//                 // Return success response
//                 echo json_encode(array('success' => true, 'url' => $movefile['url']));
//             } else {
//                 // Error handling for wp_handle_upload
//                 echo json_encode(array('error' => $movefile['error']));
//             }
//         } else {
//             // Error handling for file upload
//             echo json_encode(array('error' => 'Error uploading file. Error code: ' . $uploaded_logo['error']));
//         }
//     }
// }

// // Hook for both logged in and non-logged in users
// add_action('wp_ajax_handle_logo_upload', 'handle_logo_upload');
// add_action('wp_ajax_nopriv_handle_logo_upload', 'handle_logo_upload');

function handle_logo_upload() {
    if (isset($_FILES['logo_images'], $_POST['board_id'])) {
        $uploaded_logo = $_FILES['logo_images'];
        $board_id = intval($_POST['board_id']);

        if ($uploaded_logo['error'] == 0 && $board_id > 0) {
            $upload_overrides = array('test_form' => false);
            $movefile = wp_handle_upload($uploaded_logo, $upload_overrides);

            if ($movefile && empty($movefile['error'])) {
                // File successfully uploaded, handle the attachment
                $attachment = array(
                    'post_title'     => sanitize_file_name($uploaded_logo['name']),
                    'post_content'   => '',
                    'post_status'    => 'inherit',
                    'post_mime_type' => $uploaded_logo['type'],
                );

                $attach_id = wp_insert_attachment($attachment, $movefile['file']);
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
                wp_update_attachment_metadata($attach_id, $attach_data);

                // Save information to custom database table
                save_logo_data_to_database($board_id, $attach_id, $movefile['url']);

                // Return success response
                echo json_encode(array('success' => true, 'url' => $movefile['url']));
            } else {
                // Error handling for wp_handle_upload
                echo json_encode(array('error' => $movefile['error']));
            }
        } else {
            // Error handling for invalid board_id or file upload error
            echo json_encode(array('error' => 'Invalid request.'));
        }
    } else {
        // Error handling for missing file or board_id
        echo json_encode(array('error' => 'Invalid request.'));
    }

    wp_die();
}

function save_logo_data_to_database($board_id, $attachment_id, $logo_url) {
    global $wpdb;

    // Your table name
    $table_name = $wpdb->prefix . 'configurator_data';

    // Check if there's existing data for the id
    $existing_data = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $board_id
    ));

    if ($existing_data) {
        // If data exists, update it
        $wpdb->update(
            $table_name,
            array(
                'attachment_id' => $attachment_id,
                'logo_url' => $logo_url,
                'timestamp' => current_time('mysql')
            ),
            array('id' => $board_id),
            array('%d', '%s'),
            array('%d')
        );
    } else {
        // If no data exists, insert a new record
        $wpdb->insert(
            $table_name,
            array(
                'id' => $board_id,
                'attachment_id' => $attachment_id,
                'logo_url' => $logo_url,
                'timestamp' => current_time('mysql')
            ),
            array('%d', '%d', '%s')
        );
    }

    // Send the JSON-encoded response with url and attachment_id
    wp_send_json(array('url' => $logo_url, 'attachment_id' => $attachment_id));
}

add_action('wp_ajax_handle_logo_upload', 'handle_logo_upload');
add_action('wp_ajax_nopriv_handle_logo_upload', 'handle_logo_upload');

function handle_background_upload() {
    if (isset($_FILES['background_image_upload'], $_POST['board_id'])) {
        $uploaded_background = $_FILES['background_image_upload'];
        $board_id = intval($_POST['board_id']);

        if ($uploaded_background['error'] == 0 && $board_id > 0) {
            $upload_overrides = array('test_form' => false);
            $movefile = wp_handle_upload($uploaded_background, $upload_overrides);

            if ($movefile && empty($movefile['error'])) {
                // File successfully uploaded, handle the attachment
                $attachment = array(
                    'post_title'     => sanitize_file_name($uploaded_background['name']),
                    'post_content'   => '',
                    'post_status'    => 'inherit',
                    'post_mime_type' => $uploaded_background['type'],
                );

                $attach_id = wp_insert_attachment($attachment, $movefile['file']);
                require_once(ABSPATH . 'wp-admin/includes/image.php');
                $attach_data = wp_generate_attachment_metadata($attach_id, $movefile['file']);
                wp_update_attachment_metadata($attach_id, $attach_data);

                // Save information to custom database table
                save_background_data_to_database($board_id, $attach_id, $movefile['url']);

                // Return success response
                echo json_encode(array('success' => true, 'url' => $movefile['url']));
            } else {
                // Error handling for wp_handle_upload
                echo json_encode(array('error' => $movefile['error']));
            }
        } else {
            // Error handling for invalid board_id or file upload error
            echo json_encode(array('error' => 'Invalid request.'));
        }
    } else {
        // Error handling for missing file or board_id
        echo json_encode(array('error' => 'Invalid request.'));
    }

    wp_die();
}

function save_background_data_to_database($board_id, $attachment_id, $background_url) {
    global $wpdb;

    // Your table name
    $table_name = $wpdb->prefix . 'configurator_data';

    // Check if there's existing data for the id
    $existing_data = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $board_id
    ));

    if ($existing_data) {
        // If data exists, update it
        $wpdb->update(
            $table_name,
            array(
                'background_url' => $background_url,
                'timestamp' => current_time('mysql')
            ),
            array('id' => $board_id),
            array('%s'),
            array('%d')
        );
    } else {
        // If no data exists, insert a new record
        $wpdb->insert(
            $table_name,
            array(
                'id' => $board_id,
                'background_url' => $background_url,
                'timestamp' => current_time('mysql')
            ),
            array('%d', '%s')
        );
    }

    // Send the JSON-encoded response with url and attachment_id
    wp_send_json(array('url' => $background_url, 'attachment_id' => $attachment_id));
}

add_action('wp_ajax_handle_background_upload', 'handle_background_upload');
add_action('wp_ajax_nopriv_handle_background_upload', 'handle_background_upload');


function clearLinksFromDb() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $value = $_POST['value'];
    $board_id = $_POST['board_id'];
    if ($value == 'logo_url') {
        $sql = "UPDATE $table_name SET attachment_id = NULL, logo_url = NULL WHERE id = '$board_id'";
        $wpdb->query($sql);
    } else if ($value == 'background_url') {
        $sql = "UPDATE $table_name SET background_url = NULL WHERE id = '$board_id'";
        $wpdb->query($sql);
    }
    delete_image_callback($_POST['image_url']);
    wp_die();
}

add_action('wp_ajax_clearLinksFromDb', 'clearLinksFromDb');
add_action('wp_ajax_nopriv_clearLinksFromDb', 'clearLinksFromDb');

function deleteBoard() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $board_id = $_POST['board_id'];
    $sql = "DELETE FROM $table_name WHERE id = '$board_id'";
    $wpdb->query($sql);
    wp_die();
}

add_action('wp_ajax_deleteBoard', 'deleteBoard');
add_action('wp_ajax_nopriv_deleteBoard', 'deleteBoard');

function resetBoard() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'configurator_data';
    $board_id = $_POST['board_id'];

    $data = [
        'board_title' => '',
        'title_position' => 'left',
        'board_dimensions' => '24x72',
        'title_bg_color' => '#ffffff',
        'title_header_color' => '#000000',
        'background_color' => '#ffffff',
        'board_style' => null,
        'board_material' => null,
        'custom_logo' => 'left',
        'quantity_of_boards' => 0,
        'config_data' => null,
        'options' => null,
        'attachment_id' => null,
        'logo_url' => null,
        'background_url' => null,
        'timestamp' => current_time('mysql')
    ];

    $wpdb->update(
        $table_name,
        $data,
        ['id' => $board_id],
        ['%s', '%s', '%s','%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s', '%d', '%s', '%s', '%s'],
        ['%d']
    );

    wp_die();
}

add_action('wp_ajax_resetBoard', 'resetBoard');
add_action('wp_ajax_nopriv_resetBoard', 'resetBoard');

function delete_image_callback($image_url) {
    // Check if image URL is provided
    if ($image_url) {
        // Get attachment ID from image URL
        $attachment_id = attachment_url_to_postid($image_url);

        // Check if attachment ID is valid
        if ($attachment_id) {
            // Delete the attachment
            $deleted = wp_delete_attachment($attachment_id, true);

            if ($deleted) {
                // Return success response
                wp_send_json_success('Image deleted successfully.');
            } else {
                // Return error response
                wp_send_json_error('Error deleting image.');
            }
        } else {
            // Return error response if attachment ID is not found
            wp_send_json_error('Attachment ID not found for the provided image URL.');
        }
    } else {
        // Return error response if image URL is not provided
        wp_send_json_error('Image URL is missing.');
    }

    // Make sure to exit after sending the JSON response
    wp_die();
}

// Register shortcode
function drag_and_clone_shortcode() {
    if (is_user_logged_in()) {
        $products = get_products();
        $configurator = get_configurator_data_from_db();
        $attributes = get_product_attributes();
        ob_start();
        // get the url of the current page
        $url = $_SERVER['REQUEST_URI'];

        if( isset($_GET['board']) ) {
            $board_id = $_GET['board'];
            $board = get_data_by_id($board_id);
            include plugin_dir_path(__FILE__) . 'configurator.php';
        } else if( strpos($url, '/custom-request') !== false  ) {
            $board_id = $_GET['board'];
            $board = get_data_by_id($board_id);
            include plugin_dir_path(__FILE__) . 'custom-tool.php';
        } else {
            include plugin_dir_path(__FILE__) . 'board-list.php';
        }

        ?>
        <script>
            var WP_PRODUCTS = <?= json_encode($products) ?>;
            var WP_ATTRIBUTES = <?= json_encode($attributes) ?>;
            var WP_CONFIGURATOR = <?= json_encode($configurator) ?>;
            var CONFIGURATOR_ENG = {};
        </script>
        <?php

        return ob_get_clean();
    } else {
        include plugin_dir_path(__FILE__) . 'main.php';
    }
}

add_shortcode('amerison_configurator', 'drag_and_clone_shortcode');

// Register script for the shortcode
function drag_and_clone_script()
{
    // Leave this empty since the script is now enqueued separately
}

add_action('wp_footer', 'drag_and_clone_script');