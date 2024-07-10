<?php
/*
Plugin Name: Amerison Configurator
Description: This plugin is used to create a product configurator.
Version: 1.0
Author: Ali Raza
URL: alirazaofficial.com
*/

/*
* All the scripts, libraries and custom files
*/

function enqueue_amerison_scripts() {
    $timestamp = time();
    wp_enqueue_style('amerison_style', plugin_dir_url(__FILE__) . 'css/style.css', array(), $timestamp);
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.3/jquery-ui.min.js', array('jquery'), null, true);
    wp_enqueue_script('amerison_script', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery', 'jquery-ui'), $timestamp, true);
    wp_enqueue_style('jquery-ui-css', 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.3/themes/base/jquery-ui.min.css');
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
    wp_enqueue_script('html2canvas', 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js', array(), null, true);
    wp_enqueue_script('stripe-js', 'https://js.stripe.com/v3/', array(), null, true);
    wp_add_inline_script('stripe-js', 'var stripe = Stripe("' . get_option('stripe_settings')['publishable_key'] . '");');

    wp_localize_script(
        'amerison_script',
        'amerison_vars',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'user_id' => get_current_user_id(),
            'stripe' => get_option('stripe_settings')['publishable_key'],
            'custom_price' => get_option('stripe_settings')['custom_price'],
            'large_measuring' => get_option('stripe_settings')['large_measuring'],
            'nonce' => wp_create_nonce('amerison_nonce'),
        )
    );
}
add_action('wp_enqueue_scripts', 'enqueue_amerison_scripts');


/*
* Included labraries on admin side
*/
function enqueue_admin_bootstrap() {
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');
}
add_action('admin_enqueue_scripts', 'enqueue_admin_bootstrap');

/*
* Included custom files on admin side
*/

function enqueue_admin_assets() {
    $timestamp = time();
    wp_enqueue_style('custom-admin-css', plugin_dir_url(__FILE__) . 'css/style.css', array(), $timestamp);
    wp_enqueue_script('custom-admin-js', plugin_dir_url(__FILE__) . 'js/admin-script.js', array('jquery'), $timestamp, true);

    wp_localize_script(
        'custom-admin-js',
        'admin',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'large_measuring' => get_option('stripe_settings')['large_measuring'],
        )
    );
}
add_action('admin_enqueue_scripts', 'enqueue_admin_assets');

/*
* Custom plugin admin dashboard board list menu and custom request menu
*/

function configurator_page() {
    $page_title = 'Configurator';
    $menu_title = 'Configurator';
    $main_submenu_title = 'Configurator';
    $capability = 'manage_options';
    $menu_slug = 'amerisan-configurator';
    $function = 'configurator_page_content';
    $icon_url = 'dashicons-admin-generic';
    $position = 20;

    // Add the main menu page
    add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position);

    // Add the submenu page with a different menu title
    $sub_menu_title = 'All Shadow Boards';
    add_submenu_page($menu_slug, $page_title, $sub_menu_title, $capability, $menu_slug, $function);


    $sub_menu_title = 'All Requests';
    $sub_menu_slug = 'custom-request';
    $sub_function = 'request_custom_tool_page_content';
    add_submenu_page($menu_slug, $page_title, $sub_menu_title, $capability, $sub_menu_slug, $sub_function);

    $stripe_settings_page = 'Stripe Settings';
    $stripe_settings_title = 'Stripe Settings';
    $stripe_settings_capability = 'manage_options';
    $stripe_settings_slug = 'stripe-settings';
    $stripe_settings_function = 'render_stripe_setting_page';
    add_submenu_page($menu_slug, $stripe_settings_page, $stripe_settings_title, $stripe_settings_capability, $stripe_settings_slug, $stripe_settings_function);

    $pricing_page = 'Pricing';
    $pricing_title = 'Pricing';
    $pricing_capability = 'manage_options';
    $pricing_slug = 'pricing';
    $pricing_function = 'render_pricing_page';
    add_submenu_page($menu_slug, $pricing_page, $pricing_title, $pricing_capability, $pricing_slug, $pricing_function);
}
add_action('admin_menu', 'configurator_page');

/*
* Admin dashboard board list page content
*/
function configurator_page_content() {
    $configurator = get_all_boards();
    $delete_all = admin_url('admin-ajax.php?action=delete_all');
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline mb-3 fw-bold">List of Boards</h1>
    <button id="delete_all_boards" class="btn btn-danger" style="margin-left: 20px; float: inline-end; margin-bottom: 20px;">Delete All Boards</button>
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th style="width: 60px">ID</th>
                <th style="width: 200px">Title</th>
                <th style="width: 100px">Dimensions</th>
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
                    <td><div style="border: 1px solid black; width: 30px; height: 30px; background-color: <?= $board->background_color ?>;"></div></td>
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
                    <td><button class="delete-board btn btn-danger py-0" data-id="<?= $board->id ?>">Delete</button></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
    </div>
    <?php
}



/*
* Admin dashboard custom request page content
*/

function request_custom_tool_page_content() {
    ?>
    <div id="preloader" class="preloader"></div>
    <div class="wrap">
        <div id="tabs" style="border-bottom: 3px solid #000000;">
            <button class="tablink btn tab-color rounded-0 fw-bolder text-dark" data-tab="Tab1">Custom Tools</button>
            <button class="tablink btn tab-color rounded-0 fw-bolder text-dark" data-tab="Tab2">Measuring Sheets</button>
        </div>
        <div id="Tab1" class="tabcontent">
        <div id="custom-tools" class="tab-content py-3">
            <?php
            echo '<h4 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">Custom Tool Requests</h4>';
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>
                    <tr>
                        <th style="width: 80px">ID</th>
                        <th style="width: 200px">User Name</th>
                        <th style="width: 200px">File Download</th>
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
                echo '<td><button class="upload-custom-tool btn btn-primary cursor-pointer" ' . ($request['status'] === "Pending" ? '' : 'disabled') . ' data-id="' . $request['id'] . '">'. ($request['status'] === "Pending" ? 'Upload' : 'Uploaded') . '</button></td>';
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
            echo '<h4 class="wp-heading-inline mb-3 fw-bold alert alert-success w-100">Measuring Sheet Requests</h4>';
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>
                    <tr>
                        <th style="width: 100px">User</th>
                        <th style="width: 200px">Name</th>
                        <th style="width: 200px">Address</th>
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
                echo '<td style="display: flex; gap: 3px"><button class="send-measuring-sheet btn btn-primary" ' . ($request['status'] === "Pending" ? '' : 'disabled') . ' id="send_measuring_sheet_' . $request['id'] . '" data-id="' . $request['id'] . '">'. ($request['status'] === "Pending" ? 'Update' : 'Updated') . '</button> <button class="stripe-refund btn btn-danger" ' . ($request['payment_intent'] === "Refunded" ? 'disabled' : '') . ' id="stripe_refund_' . $request['id'] . '" data-id="' . $request['id'] . '">' . ($request['payment_intent'] === "Refunded" ? 'Refunded' : 'Refund') . '</button></td>';
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


// Render settings page
function render_stripe_setting_page() {
    ?>
    <div class="wrap">
        <h2>Stripe Settings</h2>
        <form method="post" action="options.php">
            <?php settings_fields('stripe_settings_group'); ?>
            <?php do_settings_sections('my-plugin-settings'); ?>
            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <?php
}

// Register settings and fields
function stripe_register_settings() {
    register_setting('stripe_settings_group', 'stripe_settings', 'stripe_validate_settings');
    add_settings_section('stripe_settings_section', '', 'stripe_settings_section_callback', 'my-plugin-settings');
    add_settings_field('stripe_publishable_key', 'Publishable Key', 'stripe_publishable_key_callback', 'my-plugin-settings', 'stripe_settings_section');
    add_settings_field('stripe_secret_key', 'Secret Key', 'stripe_secret_key_callback', 'my-plugin-settings', 'stripe_settings_section');
    add_settings_section('stripe_price_settings_section', '', 'stripe_price_settings_section_callback', 'my-plugin-settings');
    add_settings_field('stripe_custom_tool_price', 'Custom Tool Price ($)', 'stripe_custom_tool_price_callback', 'my-plugin-settings', 'stripe_price_settings_section');
    add_settings_field('stripe_large_measuring_price', 'Large Measuring Price ($)', 'stripe_large_measuring_price_callback', 'my-plugin-settings', 'stripe_price_settings_section');
}
add_action('admin_init', 'stripe_register_settings');

// Validate settings
function stripe_validate_settings($input) {
    // Validate and sanitize input data
    $output = array();
    $output['publishable_key'] = sanitize_text_field($input['publishable_key']);
    $output['secret_key'] = sanitize_text_field($input['secret_key']);
    $output['custom_price'] = sanitize_text_field($input['custom_price']);
    $output['large_measuring'] = sanitize_text_field($input['large_measuring']);
    // Add additional validation if needed
    return $output;
}

// Settings section callback
function stripe_settings_section_callback() {
    echo '<div class="badge bg-success">Enter your Stripe API keys below:</div>';
}

// Publishable key field callback
function stripe_publishable_key_callback() {
    $options = get_option('stripe_settings');
    echo '<input type="text" id="publishable_key" class="w-50" name="stripe_settings[publishable_key]" value="' . esc_attr($options['publishable_key']) . '" />';
    echo '<p class="description">You can find your API keys in your Stripe dashboard.</p>';
}

// Secret key field callback
function stripe_secret_key_callback() {
    $options = get_option('stripe_settings');
    echo '<input type="password" id="secret_key" class="w-50" name="stripe_settings[secret_key]" value="' . esc_attr($options['secret_key']) . '" />';
    echo '<p class="description">You can find your API keys in your Stripe dashboard.</p>';
    echo '<div class="badge bg-danger">Please note that the secret key should be kept confidential.</div>';
}

// Settings section callback
function stripe_price_settings_section_callback() {
    echo '<hr>';
    echo '<div class="badge bg-success">Enter your prices for the custom requests below:</div>';
}
// custom tool amount field
function stripe_custom_tool_price_callback() {
    $options = get_option('stripe_settings');
    echo '<input type="text" id="custom_price" class="w-50" name="stripe_settings[custom_price]" value="' . esc_attr($options['custom_price']) . '" />';
    echo '<p class="description">Enter the price for custom tool request price (default $15).</p>';
}

// custom tool amount field
function stripe_large_measuring_price_callback() {
    $options = get_option('stripe_settings');
    echo '<input type="text" id="large_measuring" class="w-50" name="stripe_settings[large_measuring]" value="' . esc_attr($options['large_measuring']) . '" />';
    echo '<p class="description">Enter the price for large measuring sheet request price (default $40).</p>';
}

// Pricing page
function render_pricing_page() {
    ?>
    <div id="preloader" class="preloader"></div>
    <div class="wrap">
        <h2>Pricing</h2>
        <!-- Add pricing table here -->
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>SIZE</th>
                    <th>TOUGHLAM</th>
                    <th>TOUGHLITE</th>
                    <th>TOUGHGUARD</th>
                    <th>TOUGHGUARD+</th>
                    <th>TOUGHCLEAR</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                    <?php
                    $prices = get_amerisan_pricing();
                    foreach ($prices as $price) {
                        echo '<tr>';
                        echo '<td>' . $price['size'] . '</td>';
                        echo '<td>$' . $price['toughlam'] . '</td>';
                        echo '<td>$' . $price['toughlite'] . '</td>';
                        echo '<td>$' . $price['toughguard'] . '</td>';
                        echo '<td>$' . $price['toughguardplus'] . '</td>';
                        echo '<td>$' . $price['toughclear'] . '</td>';
                        echo '<td><button id="update_price" data-id="' . $price['id'] . '" class="update_price btn btn-primary btn-sm">Update</button></td>';
                        echo '</tr>';
                    }
                    ?>
            </tbody>
        </table>

        <!-- Model Popup -->
        <div class="modal fade" id="updatePriceModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered mx-auto">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalToggleLabel">Update price for size <span id="update_price_size"></span></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <!-- input fields here for pricing -->
                    <div id="update_price_form">
                        <input type="hidden" id="update_price_id" name="update_price_id" value="">
                        <div class="row mb-3">
                            <label for="inputSize" class="col-sm-2 col-form-label text-uppercase">Size</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputSize" disabled>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="inputToughLam" class="col-sm-2 col-form-label  text-uppercase">ToughLam</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputToughLam" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="inputToughLite" class="col-sm-2 col-form-label text-uppercase">ToughLite</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputToughLite" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="inputToughGuard" class="col-sm-2 col-form-label text-uppercase">ToughGuard</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputToughGuard" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="inputToughGuardPlus" class="col-sm-2 col-form-label text-uppercase">ToughGuard+</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputToughGuardPlus" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <label for="inputToughClear" class="col-sm-2 col-form-label text-uppercase">ToughClear</label>
                            <div class="col-sm-10">
                            <input type="text" class="form-control" id="inputToughClear" required>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-bs-target="#updatePriceModal" data-bs-toggle="modal" id="submit_price" data-bs-dismiss="modal">Submit</button>
                </div>
                </div>
            </div>
        </div>
        <!-- Model Popup -->
    </div>
    <?php
}

function initiate_stripe_payment() {
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in.');
    }

    $amount = isset($_POST['amount']) ? intval($_POST['amount']) : 0; // Convert amount to integer
    $token = $_POST['token']['id'];

    // Create a Payment Intent
    $stripe = new \Stripe\StripeClient(get_option('stripe_settings')['secret_key']);
    $payment_intent = $stripe->paymentIntents->create([
        'amount' => $amount,
        'currency' => 'usd',
        'payment_method_types' => ['card'],
    ]);

    // Charge the Payment Intent with payment method data
    $responce = $stripe->paymentIntents->confirm(
        $payment_intent->id,
        [
            'payment_method_data' => [
                'type' => 'card',
                'card' => ['token' => $token]
            ]
        ]
    );

    if ($responce->status === 'succeeded') {
        wp_send_json_success($responce->id);
    } else {
        wp_send_json_error('Payment failed.');
    }
}


add_action('wp_ajax_initiate_stripe_payment', 'initiate_stripe_payment');
add_action('wp_ajax_nopriv_initiate_stripe_payment', 'initiate_stripe_payment');

function get_payment_intent_id($id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $payment_intent = $wpdb->get_row("SELECT * FROM $table_name WHERE id = $id", ARRAY_A);
    return $payment_intent['payment_intent'];
}

function update_user_refund_status($id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $wpdb->update($table_name, array('payment_intent' => 'Refunded'), array('id' => $id));
}

function initiate_stripe_refund() {
    // Check if the user is eligible for a refund (e.g., if they made a payment of $40)
    $id = isset($_POST['id']) ? sanitize_text_field($_POST['id']) : '';
    $payment_amount = isset($_POST['payment_amount']) ? sanitize_text_field($_POST['payment_amount']) : '';

    // get the payment intent id from the database from table where user id is equal to $id
    $payment_intent_id = get_payment_intent_id($id);

    if ($payment_amount > 0 && !empty($payment_intent_id)) {
        try {
            // Refund the payment
            $stripe = new \Stripe\StripeClient(get_option('stripe_settings')['secret_key']);
            $refund = $stripe->refunds->create([
                'payment_intent' => $payment_intent_id,
            ]);

            // Check if the refund was successful
            if ($refund->status === 'succeeded') {
                // Refund successful, update user's payment status or refund details in your database
                update_user_refund_status($id);
                $id = get_sheet_by_id('id', $id);
                $user_id = $id->user_id;
                $subject = 'Refund Initiated';
                $message = "
                    <h3>Dear " . get_user_name_by_id($user_id). ",</h3>
                    <p>Refund of $". get_option('stripe_settings')['large_measuring'] . " is initiated successfully.\n</p>
                    <p>Thank you.</p>
                    <p>Regards,</p>
                    <p>Amerisan</p>
                ";
                send_email_to_user($user_id, $subject, $message);
                wp_send_json_success('Refund initiated successfully!');
            } else {
                // Refund failed, handle error
                wp_send_json_success('Refund failed!');
            }
        } catch (\Stripe\Exception\CardException $e) {
            // Handle card errors
            echo 'Refund failed: ' . $e->getError()->message;
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            // Handle invalid request errors
            echo 'Refund failed: ' . $e->getError()->message;
        } catch (\Stripe\Exception\AuthenticationException $e) {
            // Handle authentication errors
            echo 'Refund failed: ' . $e->getError()->message;
        } catch (\Stripe\Exception\ApiConnectionException $e) {
            // Handle network errors
            echo 'Refund failed: ' . $e->getError()->message;
        } catch (\Stripe\Exception\ApiErrorException $e) {
            // Handle generic API errors
            echo 'Refund failed: ' . $e->getError()->message;
        }
    } else {
        echo 'User is not eligible for a refund.';
        update_user_refund_status($id);
    }
}

add_action('wp_ajax_initiate_stripe_refund', 'initiate_stripe_refund');
add_action('wp_ajax_nopriv_initiate_stripe_refund', 'initiate_stripe_refund');

/**
 * Function to get user name by user id
 *
 * @param int $user_id The ID of the user whose name is to be retrieved.
 * @return string The name of the user corresponding to the provided user ID.
 */

function get_user_name_by_id($user_id) {
    $user_info = get_userdata($user_id);
    return $user_info ? $user_info->display_name : '';
}

/**
 * Retrieves custom tool requests from the database.
 *
 * This function retrieves custom tool requests stored in the WordPress database
 * table named with the prefix 'wp_{$wpdb->prefix}request_custom_tool'.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @return array|null Array of custom tool requests as associative arrays,
 *                    or null if no requests are found.
 */

 function get_custom_tool_requests() {
    global $wpdb;
    $custom_tool_requests = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}request_custom_tool ORDER BY created_at DESC", ARRAY_A);
    return $custom_tool_requests;
}


/**
 * Retrieves measuring tool requests from the database.
 *
 * This function retrieves measuring tool requests stored in the WordPress database
 * table named with the prefix 'wp_{$wpdb->prefix}measure_request'.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @return array|null Array of measuring tool requests as associative arrays,
 *                    or null if no requests are found.
 */

function get_measuring_tool_requests() {
    global $wpdb;
    $measuring_tool_requests = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}measure_request ORDER BY created_at DESC", ARRAY_A);
    return $measuring_tool_requests;
}

/**
 * Sends an email containing a measuring sheet to the user associated with a given request ID.
 *
 * This function checks if a request ID is provided via the $_POST superglobal.
 * If a request ID is provided, it retrieves the user ID associated with the request ID,
 * constructs an email containing a message with the user's name and sends it to the user.
 * It also updates the status of the request in the database to 'Sent'.
 * If no request ID is provided, it echoes a message indicating the absence of the request ID.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

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
            <p>Amerisan</p>
        ";
        send_email_to_user($user_id, $subject, $message);
        global $wpdb;
        $table_name = $wpdb->prefix . 'measure_request';
        $wpdb->update($table_name, array('status' => 'Sent'), array('id' => $request_id));

        echo 'Email sent successfully.';
    } else {
        echo 'Request ID not provided.';
    }
    wp_die();
}
add_action('wp_ajax_send_measuring_sheet_email', 'send_measuring_sheet_email');
add_action('wp_ajax_nopriv_send_measuring_sheet_email', 'send_measuring_sheet_email');

/**
 * Submits a custom tool design request.
 *
 * This function is responsible for processing a custom tool design request. It first verifies if the user is logged in.
 * Then it checks if a file has been uploaded and if a request ID is provided.
 * If the conditions are met, it moves the uploaded file to the designated upload directory.
 * It then inserts the file as an attachment to the WordPress media library and retrieves its ID.
 * With the provided width, height, and tool type, it creates a new WooCommerce product variation representing the custom tool.
 * If the required attribute term ('pa_color') exists, it assigns it to the product variation.
 * Finally, it updates the status of the custom tool request in the database to 'Sent', sends an email notification to the user,
 * and returns a success message.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function submit_custom_tool_design() {
    $request_id = isset($_POST['request_id']) ? $_POST['request_id'] : '';
    $user_id = get_custom_sheet_by_id('id', $request_id)->user_id;

    if (empty($request_id)) { wp_send_json_error('Invalid board ID.'); }
    if (!is_user_logged_in()) { wp_send_json_error('User not logged in.'); }
    if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) { wp_send_json_error('No file uploaded.'); }

    $upload_dir = wp_upload_dir();
    $file_name = time() . $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_path = $upload_dir['path'] . '/' . $file_name;
    $file_link = $upload_dir['url'] . '/' . $file_name;
    if (!move_uploaded_file($file_tmp, $file_path)) { wp_send_json_error('Failed to move uploaded file.'); }

    $attachment = array(
        'guid'           => $upload_dir['url'] . '/' . $file_name,
        'post_mime_type' => $_FILES['file']['type'],
        'post_title'     => sanitize_file_name($file_name),
        'post_content'   => '',
        'post_status'    => 'inherit'
    );
    $attachment_id = wp_insert_attachment($attachment, $file_path);


    $width = $_POST['width'] ? $_POST['width'] : 0;
    $height = $_POST['height'] ? $_POST['height'] : 0;
    $toolType = $_POST['tool_type'] ? $_POST['tool_type'] : '';

    $attribute_terms = get_terms('pa_color', array('hide_empty' => false));

    if (!empty($attribute_terms)) {
        $attribute_custom = $attribute_terms[2];
        $product = new WC_Product_Variable();
        $name = 'TOOL' . time();
        $product->set_name($name);
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

        $attribute = new WC_Product_Attribute();
        $attribute->set_id( wc_attribute_taxonomy_id_by_name( 'pa_color' ) );
        $attribute->set_name( 'pa_color' );
        $pa_color_term = get_term_by('name', $woo_product_meta['format'], 'pa_color');
        if(!$pa_color_term){
            wp_insert_term(
                $woo_product_meta['custom'],
                'pa_color'
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
        $variation = new WC_Product_Variation();
        $variation->set_parent_id( $product_id );
        $variation->save();
        $variation->set_attributes(
            array(
                'pa_color' => $attribute_custom->term_id,
            )
        );
        $variation->save();
        $variation->set_image_id( $attachment_id );
        $variation->set_regular_price(0);
        $variation->set_weight($user_id);
        $variation->set_length(0);
        $variation->set_width($width);
        $variation->set_height($height);
        $variation->set_description($toolType);
        $variation->save();
        $product->save();
    } else {
        echo 'No attribute terms found.';
    }

    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $wpdb->update($table_name, array('status' => 'Sent'), array('id' => $request_id));
    $subject = 'Completion of Your Custom Tool Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We're pleased to inform you that your custom tool request has been successfully completed and uploaded on Configurator.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerisan</p>
    ";
    send_email_to_user($user_id, $subject, $message);
    wp_send_json_success('Custom tool request sent successfully.');
}
add_action('wp_ajax_submit_custom_tool_design', 'submit_custom_tool_design');
add_action('wp_ajax_nopriv_submit_custom_tool_design', 'submit_custom_tool_design');

/**
 * Sends an email to a user.
 *
 * This function constructs and sends an email to the user identified by the provided user ID.
 * It retrieves the user's email address using the user ID, constructs the email with the provided subject and message,
 * and sends it using WordPress's wp_mail function.
 *
 * @param int $user_id The ID of the user to whom the email will be sent.
 * @param string $subject The subject of the email.
 * @param string $message The content of the email.
 */

function send_email_to_user($user_id, $subject, $message) {
    $user_info = get_userdata($user_id);
    $to = $user_info->user_email;
    $subject = $subject;
    $message = $message;
    $headers = array('Content-Type: text/html; charset=UTF-8');
    $sent = wp_mail($to, $subject, $message, $headers);
}

/**
 * Retrieves a user from the database by a specific field value.
 *
 * This function queries the WordPress database to retrieve a user based on a specified field value.
 * It accepts the field name and its corresponding value as parameters, constructs and executes a prepared SQL query,
 * and returns the user object if found.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param string $field The name of the field to search against.
 * @param mixed $value The value of the field to match.
 * @return object|null The user object if found, or null if not found.
 */

function get_user_by_id($field, $value) {
    global $wpdb;
    $user = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $wpdb->users WHERE $field = %d",
        $value
    ));
    return $user;
}

/**
 * Retrieves a measuring sheet from the database by a specific field value.
 *
 * This function queries the WordPress database to retrieve a measuring sheet based on a specified field value.
 * It accepts the field name and its corresponding value as parameters, constructs and executes a prepared SQL query,
 * and returns the measuring sheet object if found.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param string $field The name of the field to search against.
 * @param mixed $value The value of the field to match.
 * @return object|null The measuring sheet object if found, or null if not found.
 */

function get_sheet_by_id($field, $value) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $sheet = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE $field = %d",
        $value
    ));
    return $sheet;
}

/**
 * Retrieves a custom tool request sheet from the database by a specific field value.
 *
 * This function queries the WordPress database to retrieve a custom tool request sheet based on a specified field value.
 * It accepts the field name and its corresponding value as parameters, constructs and executes a prepared SQL query,
 * and returns the custom tool request sheet object if found.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param string $field The name of the field to search against.
 * @param mixed $value The value of the field to match.
 * @return object|null The custom tool request sheet object if found, or null if not found.
 */

function get_custom_sheet_by_id($field, $value) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $sheet = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE $field = %d",
        $value
    ));
    return $sheet;
}

/**
 * Deletes all records from the 'configurator_data' table.
 *
 * This function deletes all records from the 'configurator_data' table in the WordPress database.
 * It constructs and executes an SQL query to delete all records from the specified table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function delete_all() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "DELETE FROM $table_name";
    $wpdb->query($sql);
    wp_die();
}
add_action('wp_ajax_delete_all', 'delete_all');
add_action('wp_ajax_nopriv_delete_all', 'delete_all');

/**
 * Retrieves a list of products with their details and variations.
 *
 * This function queries the WordPress database to retrieve a list of products along with their details and variations.
 * It constructs a WP_Query object to fetch all products, iterates through each product, and collects relevant information,
 * such as product ID, name, price, image, attributes, and variations.
 * It then returns an array containing the collected product data.
 *
 * @return array An array containing details of products and their variations.
 */

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
        $product_data = wc_get_product($product_id);
        $attributes = array();
        foreach ($product_data->get_attributes() as $attribute) {
            $attributes[$attribute->get_name()] = $attribute->get_options();
        }
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

/**
 * Retrieves product attributes and their values.
 *
 * This function retrieves product attributes and their corresponding values.
 * It iterates through the specified taxonomies, retrieves the attributes' labels and values,
 * and stores them in an array.
 *
 * @return array An array containing product attributes and their values.
 */

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

/**
 * Creates the 'configurator_data' table in the WordPress database.
 *
 * This function creates the 'configurator_data' table if it does not already exist in the WordPress database.
 * It defines the table structure including columns for various configuration data related to a configurator,
 * such as user ID, board title, colors, dimensions, background, style, material, quantity, and more.
 * The function utilizes WordPress's dbDelta function to execute the SQL query and create the table.
 * It also registers this function to run during plugin activation.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

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


// create table for pricing with the columns id, size, toughlite, toughguard, toughguard+, toughclear, created_at, updated_at
function create_amerisan_pricing_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        size VARCHAR(255) NOT NULL,
        toughlite float,
        toughlam float,
        toughguard float,
        toughguardplus float,
        toughclear float,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'create_amerisan_pricing_table');


// get all the pricing data from the database
function get_amerisan_pricing() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';
    $pricing = $wpdb->get_results("SELECT * FROM $table_name", ARRAY_A);
    return $pricing;
}

function get_amerisan_pricing_size_callback() {
    // check_ajax_referer('nonce', 'nonce');

    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';

    $results = $wpdb->get_results("SELECT size FROM $table_name", ARRAY_A);

    if ($results) {
        wp_send_json_success($results);
    } else {
        wp_send_json_error('No pricing data found.');
    }
}

add_action('wp_ajax_get_amerisan_pricing_size', 'get_amerisan_pricing_size_callback');
add_action('wp_ajax_nopriv_get_amerisan_pricing_size', 'get_amerisan_pricing_size_callback');

function get_amerisan_pricing_by_id_callback() {
    // check_ajax_referer('nonce', 'nonce');
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';
    $pricing = $wpdb->get_row("SELECT * FROM $table_name WHERE id = $id", ARRAY_A);

    if ($pricing) {
        wp_send_json_success($pricing);
    } else {
        wp_send_json_error('No pricing data found.');
    }
}

add_action('wp_ajax_get_amerisan_pricing_by_id', 'get_amerisan_pricing_by_id_callback');
add_action('wp_ajax_nopriv_get_amerisan_pricing_by_id', 'get_amerisan_pricing_by_id_callback');


function update_amerisan_pricing_by_id_callback() {
    // check_ajax_referer('nonce', 'nonce');
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $toughlite = isset($_POST['toughlite']) ? floatval($_POST['toughlite']) : 0;
    $toughlam = isset($_POST['toughlam']) ? floatval($_POST['toughlam']) : 0;
    $toughguard = isset($_POST['toughguard']) ? floatval($_POST['toughguard']) : 0;
    $toughguardplus = isset($_POST['toughguardplus']) ? floatval($_POST['toughguardplus']) : 0;
    $toughclear = isset($_POST['toughclear']) ? floatval($_POST['toughclear']) : 0;
    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';
    $wpdb->update(
        $table_name,
        array(
            'toughlite' => $toughlite,
            'toughlam' => $toughlam,
            'toughguard' => $toughguard,
            'toughguardplus' => $toughguardplus,
            'toughclear' => $toughclear,
            'updated_at' => date('Y-m-d H:i:s')
        ),
        array('id' => $id)
    );
    wp_send_json_success('Pricing updated successfully.');
}

add_action('wp_ajax_update_amerisan_pricing_by_id', 'update_amerisan_pricing_by_id_callback');
add_action('wp_ajax_nopriv_update_amerisan_pricing_by_id', 'update_amerisan_pricing_by_id_callback');

function get_amerisan_selected_pricing_price_callback() {
    $size = isset($_POST['size']) ? $_POST['size'] : '';
    global $wpdb;
    $table_name = $wpdb->prefix . 'amerisan_pricing';
    $pricing = $wpdb->get_row("SELECT * FROM $table_name WHERE size = '$size'", ARRAY_A);
    if ($pricing) {
        wp_send_json_success($pricing);
    } else {
        wp_send_json_error('No pricing data found.');
    }
}

add_action('wp_ajax_get_amerisan_selected_pricing_price', 'get_amerisan_selected_pricing_price_callback');
add_action('wp_ajax_nopriv_get_amerisan_selected_pricing_price', 'get_amerisan_selected_pricing_price_callback');

// get_amerisan_pricing_size();
/**
 * Creates the 'measure_request' table in the WordPress database.
 *
 * This function creates the 'measure_request' table if it does not already exist in the WordPress database.
 * It defines the table structure including columns for storing information related to measuring sheet requests,
 * such as user ID, name, address, quantity, comments, total cost, status, and creation timestamp.
 * The function utilizes WordPress's dbDelta function to execute the SQL query and create the table.
 *
 * Note: This function should be called during plugin or theme activation.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function create_measure_request_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255),
        address VARCHAR(300),
        quantity INT,
        comments TEXT NOT NULL,
        total_cost INT,
        status VARCHAR(50) DEFAULT 'Pending',
        payment_intent VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}
register_activation_hook( __FILE__, 'create_measure_request_table' );

/**
 * Checks if the 'measure_request' table exists in the WordPress database.
 *
 * This function checks if the 'measure_request' table exists in the WordPress database.
 * It constructs an SQL query to check if a table with the specified name exists.
 * If the table exists, it returns true; otherwise, it returns false.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @return bool True if the table exists, false otherwise.
 */

function is_measure_request_table_created() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'measure_request';
    $sql = "SHOW TABLES LIKE '$table_name'";
    $result = $wpdb->get_var( $sql );
    if ( $result == $table_name ) {
        return true;
    } else {
        return false;
    }
}

/**
 * Creates the 'request_custom_tool' table in the WordPress database.
 *
 * This function creates the 'request_custom_tool' table if it does not already exist in the WordPress database.
 * It defines the table structure including columns for storing information related to custom tool requests,
 * such as file name, dimensions, status, creation timestamp, associated board ID, and user ID.
 * The function checks if the table exists before attempting to create it to avoid duplication.
 * It utilizes WordPress's dbDelta function to execute the SQL query and create the table.
 *
 * Note: This function should be called during plugin or theme activation.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function create_request_custom_tool_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
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
register_activation_hook(__FILE__, 'create_request_custom_tool_table');

/**
 * Processes a custom tool request.
 *
 * This function processes a custom tool request submitted by a logged-in user.
 * It first checks if the user is logged in and if a file has been uploaded.
 * If a board ID is provided, it moves the uploaded file to the designated upload directory,
 * inserts a record into the 'request_custom_tool' table with relevant details including file link, dimensions, status, and user ID.
 * It then sends an email notification to the user acknowledging the receipt of the request.
 * This function is hooked to the 'wp_ajax_process_custom_tool_request' action to handle requests from logged-in users,
 * and to the 'wp_ajax_nopriv_process_custom_tool_request' action to handle requests from non-logged-in users.
 *
 * Note: This function assumes the existence of the 'request_custom_tool' table and the 'send_email_to_user' function.
 */

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

    $upload_dir = wp_upload_dir();
    $file_name = time() . $_FILES['file']['name'];
    $file_tmp = $_FILES['file']['tmp_name'];
    $file_path = $upload_dir['path'] . '/' . $file_name;
    $file_link = $upload_dir['url'] . '/' . $file_name;

    if (!move_uploaded_file($file_tmp, $file_path)) {
        wp_send_json_error('Failed to move uploaded file.');
    }

    $user_id = get_current_user_id();
    $width = $_POST['width'] ? $_POST['width'] : 0;
    $height = $_POST['height'] ? $_POST['height'] : 0;
    global $wpdb;
    $table_name = $wpdb->prefix . 'request_custom_tool';
    $wpdb->insert($table_name, array(
        'file' => $file_link,
        'width' => $width,
        'height' => $height,
        'status' => 'Pending',
        'created_at' => current_time('mysql'),
        'board_id' => $board_id,
        'user_id' => $user_id,
    ));
    $subject = 'Acknowledgement of Your Custom Tool Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We\'ve received your request for a custom tool. Further instructions will be provided soon.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerisan</p>
    ";
    send_email_to_user($user_id, $subject, $message);
}
add_action('wp_ajax_process_custom_tool_request', 'process_custom_tool_request');
add_action('wp_ajax_nopriv_process_custom_tool_request', 'process_custom_tool_request');

/**
 * Processes a measuring tool request.
 *
 * This function processes a measuring tool request submitted by a logged-in user.
 * It retrieves user details and request information from the submitted data,
 * inserts a record into the 'measure_request' table with relevant details including user ID, name, address, quantity, comments, total cost, and status.
 * It then sends an email notification to the user acknowledging the receipt of the request.
 * This function is hooked to the 'wp_ajax_process_measuring_tool_request' action to handle requests from logged-in users,
 * and to the 'wp_ajax_nopriv_process_measuring_tool_request' action to handle requests from non-logged-in users.
 *
 * Note: This function assumes the existence of the 'measure_request' table and the 'send_email_to_user' function.
 */

function process_measuring_tool_request() {
    if (!is_user_logged_in()) {
        wp_send_json_error('User not logged in.');
    }
    $user_id = get_current_user_id();
    $name = $_POST['name'] ? $_POST['name'] : '';
    $address = $_POST['address'] ? $_POST['address'] : '';
    $comments = $_POST['comments'] ? $_POST['comments'] : '';
    $quantity = $_POST['quantity'] ? $_POST['quantity'] : 0;
    $totalCost = $_POST['totalCost'] ? $_POST['totalCost'] : '';
    $payment_intent = $_POST['payment_intent'] ? $_POST['payment_intent'] : '';

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
        'payment_intent' => $payment_intent,
        'created_at' => current_time('mysql')
    ));
    $subject = 'Acknowledgement of Your Larger Measuring Sheet Request';
    $message = "
        <h3>Dear " . get_user_name_by_id($user_id) . ",</h3>
        <p>We've received your request for a larger measuring sheet. Further instructions will be provided soon.\n</p>
        <p>Thank you.</p>
        <p>Regards,</p>
        <p>Amerisan</p>
    ";
    send_email_to_user($user_id, $subject, $message);

    wp_send_json_success('Request submitted successfully.');
}
add_action('wp_ajax_process_measuring_tool_request', 'process_measuring_tool_request');
add_action('wp_ajax_nopriv_process_measuring_tool_request', 'process_measuring_tool_request');

/**
 * Updates or inserts configurator data into the database.
 *
 * This function processes a request to update or insert configurator data into the database.
 * It retrieves data from the submitted POST request, including section items, colors, and other configuration details.
 * Based on the existence of existing data, it either updates or inserts a record into the 'configurator_data' table.
 * It then sends the response containing the new ID of the inserted record.
 * This function is hooked to the 'wp_ajax_update_configurator_data' action to handle requests from logged-in users,
 * and to the 'wp_ajax_nopriv_update_configurator_data' action to handle requests from non-logged-in users.
 *
 * Note: This function assumes the existence of the 'configurator_data' table and the use of sanitize_text_field function.
 */

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
        $existing_data = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        if ($existing_data) {
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
add_action('wp_ajax_nopriv_update_configurator_data', 'update_configurator_data');


/**
 * Retrieves image data from the POST request. and then uplaod it to the media library.
 * and inserts an attachment into the media library and retrieves the attachment ID.
 * and in response sends a JSON-encoded response indicating success or failure of the upload process.
 * with the attachment ID.
 *
 */

function upload_image_amerisan() {
    if (isset($_POST['file'])) {
        $image_data = $_POST['file'];
        $image_data = str_replace('data:image/png;base64,', '', $image_data);
        $image_data = str_replace(' ', '+', $image_data);
        $image_data = base64_decode($image_data);
        $upload_dir = wp_upload_dir();
        $upload_dir = $upload_dir['basedir'];
        $filename = $_POST['name'] . '.png';
        $file = $upload_dir . '/' . $filename;
        // echo $file;
        file_put_contents($file, $image_data);
        $attachment = array(
            'guid' => $file,
            'post_mime_type' => 'image/png',
            'post_title' => $filename,
            'post_content' => '',
            'post_status' => 'inherit'
        );
        $attachment_id = wp_insert_attachment($attachment, $file);
        $image = wp_get_attachment_image($attachment_id, 'full');

        $style = $_POST['board_style'];
        $material = $_POST['board_material'];
        $dimentions = $_POST['board_dimensions'];
        $board_quantity = $_POST['board_quantity'];


        $product = create_amerisan_simple_product($_POST['name'], $_POST['price'], $attachment_id, $style, $material, $dimentions, $board_quantity);

        $cart = WC()->cart;
        $cart->add_to_cart($product, $board_quantity);

        if ($image && $product) {
            $response = array(
                'success' => true,
                'attachment_id' => $attachment_id,
                'product_id' => $product,
                'quantity' => $board_quantity
            );
        } else {
            $response = array(
                'success' => false
            );
        }
        echo json_encode($response);
        wp_die();
    }
}

add_action('wp_ajax_upload_image_amerisan', 'upload_image_amerisan');
add_action('wp_ajax_nopriv_upload_image_amerisan', 'upload_image_amerisan');


function create_amerisan_simple_product($name, $price, $attachment_id, $style, $material, $dimentions, $board_quantity) {
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_inactive', 'WooCommerce is not active.');
    }

    // Validate input
    if (empty($name) || !is_numeric($price) || !is_numeric($attachment_id)) {
        return new WP_Error('invalid_input', 'Invalid input provided.');
    }

    // Sanitize input
    $name = sanitize_text_field($name);
    $price = floatval($price);
    $attachment_id = intval($attachment_id);

    // Create product post array
    $product = array(
        'post_title' => $name,
        'post_content' => '', // You can add content here if needed
        'post_status' => 'publish',
        'post_type' => 'product',
        'post_author' => get_current_user_id(),
        'post_parent' => 0,
    );

    // Insert the product post
    $product_id = wp_insert_post($product);

    // Check if product creation was successful
    if (is_wp_error($product_id)) {
        return $product_id;
    }

    // Set product quantity in cart
    update_post_meta($product_id, '_stock', $board_quantity);
    // Set product data
    update_post_meta($product_id, '_price', $price);
    update_post_meta($product_id, '_regular_price', $price);
    update_post_meta($product_id, '_thumbnail_id', $attachment_id);

    wp_set_post_terms($product_id, 'simple_product', 'product_tag');
    // Set product type
    wp_set_object_terms($product_id, 'simple', 'product_type');

    // Example: Set stock status (optional)
    update_post_meta($product_id, '_stock_status', 'instock');

    // Add custom fields
    update_post_meta($product_id, '_board_dimensions', $dimentions);
    update_post_meta($product_id, '_board_material', $material);
    update_post_meta($product_id, '_board_style', $style);

    return $product_id;
}

// Add custom fields to cart item data
function add_custom_fields_to_cart_item($cart_item_data, $product_id) {
    $custom_fields = [
        'board_dimensions' => get_post_meta($product_id, '_board_dimensions', true),
        'board_material' => get_post_meta($product_id, '_board_material', true),
        'board_style' => get_post_meta($product_id, '_board_style', true),
    ];

    foreach ($custom_fields as $key => $value) {
        if (!empty($value)) {
            $cart_item_data[$key] = $value;
        }
    }

    return $cart_item_data;
}
add_filter('woocommerce_add_cart_item_data', 'add_custom_fields_to_cart_item', 10, 2);

// Display custom fields on the cart page
function display_custom_fields_in_cart($item_data, $cart_item) {
    $custom_fields = [
        'board_dimensions' => __('Board Dimensions', 'woocommerce'),
        'board_material' => __('Board Material', 'woocommerce'),
        'board_style' => __('Board Style', 'woocommerce'),
    ];

    foreach ($custom_fields as $key => $label) {
        if (isset($cart_item[$key])) {
            $item_data[] = array(
                'key'   => $label,
                'value' => wc_clean($cart_item[$key]),
            );
        }
    }

    return $item_data;
}
add_filter('woocommerce_get_item_data', 'display_custom_fields_in_cart', 10, 2);

// Preserve custom fields in order items
function add_custom_fields_to_order_items($item, $cart_item_key, $values, $order) {
    $custom_fields = ['board_dimensions', 'board_material', 'board_style'];

    foreach ($custom_fields as $field) {
        if (isset($values[$field])) {
            $item->add_meta_data(__('Board ' . ucwords(str_replace('_', ' ', $field)), 'woocommerce'), $values[$field], true);
        }
    }
}
add_action('woocommerce_checkout_create_order_line_item', 'add_custom_fields_to_order_items', 10, 4);

// Display custom fields in admin order view
function display_custom_fields_in_admin_order($item_id, $item, $product) {
    $custom_fields = ['board_dimensions', 'board_material', 'board_style'];

    foreach ($custom_fields as $field) {
        if ($meta = wc_get_order_item_meta($item_id, $field, true)) {
            echo '<p><strong>' . __('Board ' . ucwords(str_replace('_', ' ', $field)), 'woocommerce') . ':</strong> ' . $meta . '</p>';
        }
    }
}
add_action('woocommerce_admin_order_item_headers', 'display_custom_fields_in_admin_order', 10, 3);

// Include custom fields in order emails
function include_custom_fields_in_order_email($fields, $sent_to_admin, $order) {
    foreach ($order->get_items() as $item_id => $item) {
        $custom_fields = ['board_dimensions', 'board_material', 'board_style'];

        foreach ($custom_fields as $field) {
            if ($meta = wc_get_order_item_meta($item_id, $field, true)) {
                $fields[] = [
                    'label' => __('Board ' . ucwords(str_replace('_', ' ', $field)), 'woocommerce'),
                    'value' => $meta,
                ];
            }
        }
    }

    return $fields;
}
add_filter('woocommerce_email_order_meta_fields', 'include_custom_fields_in_order_email', 10, 3);


/**
 * Retrieves configurator data from the database for the current user.
 *
 * This function retrieves configurator data from the database for the currently logged-in user.
 * It queries the 'configurator_data' table based on the user ID and returns the results.
 * This function is hooked to the 'wp_ajax_get_configurator_data' action to handle requests from logged-in users,
 * and to the 'wp_ajax_nopriv_get_configurator_data' action to handle requests from non-logged-in users.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @return array Configurator data for the current user.
 */

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
add_action('wp_ajax_get_configurator_data', 'get_configurator_data');
add_action('wp_ajax_nopriv_get_configurator_data', 'get_configurator_data');

/**
 * Retrieves configurator data from the database based on board ID.
 *
 * This function retrieves configurator data from the database based on the provided board ID.
 * It constructs an SQL query to select data from the 'configurator_data' table for the specified board ID,
 * executes the query, and sends the JSON response containing the retrieved data.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function get_configurator_data() {
    global $wpdb;
    $board_id = isset($_POST['board_id']) ? intval($_POST['board_id']) : 0;
    $table_name = $wpdb->prefix . 'configurator_data';
    $config_data = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $board_id
        ),
        ARRAY_A
    );
    wp_send_json($config_data);
}

/**
 * Retrieves configurator data from the database based on board ID.
 *
 * This function retrieves configurator data from the database based on the provided board ID.
 * It constructs an SQL query to select data from the 'configurator_data' table for the specified board ID,
 * executes the query, and returns the result.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param int $board_id The ID of the board to retrieve data for.
 * @return object|null The board data if found, or null if not found.
 */

function get_data_by_id($board_id) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "SELECT * FROM $table_name WHERE id = $board_id";
    $board = $wpdb->get_row($sql);
    return $board;
}

/**
 * Retrieves all configurator boards from the database.
 *
 * This function retrieves all configurator boards from the database.
 * It constructs an SQL query to select all data from the 'configurator_data' table,
 * executes the query, and returns the results.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @return array An array containing all configurator boards.
 */

function get_all_boards() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $sql = "SELECT * FROM $table_name";
    $boards = $wpdb->get_results($sql);
    return $boards;
}

/**
 * Handles the upload of a logo image and saves data to the database.
 *
 * This function handles the upload of a logo image and saves relevant data to the database.
 * It first checks if both the logo image and board ID are set in the POST request.
 * If so, it proceeds to handle the file upload using WordPress's wp_handle_upload function.
 * Upon successful upload, it inserts an attachment into the media library and retrieves the attachment ID.
 * It then generates attachment metadata and updates the attachment metadata in the database.
 * Next, it saves the logo data (board ID, attachment ID, and URL) to the database using the save_logo_data_to_database function.
 * Finally, it sends a JSON-encoded response indicating success or failure of the upload process.
 *
 * Note: This function assumes the existence of the save_logo_data_to_database function and relies on WordPress's media handling functions.
 */

function handle_logo_upload() {
    if (isset($_FILES['logo_images'], $_POST['board_id'])) {
        $uploaded_logo = $_FILES['logo_images'];
        $board_id = intval($_POST['board_id']);
        if ($uploaded_logo['error'] == 0 && $board_id > 0) {
            $upload_overrides = array('test_form' => false);
            $movefile = wp_handle_upload($uploaded_logo, $upload_overrides);
            if ($movefile && empty($movefile['error'])) {
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
                save_logo_data_to_database($board_id, $attach_id, $movefile['url']);
                echo json_encode(array('success' => true, 'url' => $movefile['url']));
            } else {
                echo json_encode(array('error' => $movefile['error']));
            }
        } else {
            echo json_encode(array('error' => 'Invalid request.'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid request.'));
    }
    wp_die();
}
add_action('wp_ajax_handle_logo_upload', 'handle_logo_upload');
add_action('wp_ajax_nopriv_handle_logo_upload', 'handle_logo_upload');

/**
 * Saves logo data to the database.
 *
 * This function saves logo data (attachment ID and URL) to the database for a specific board.
 * It first checks if data for the given board ID already exists in the database.
 * If data exists, it updates the existing record with the new attachment ID, logo URL, and timestamp.
 * If data does not exist, it inserts a new record into the database with the board ID, attachment ID, logo URL, and timestamp.
 * It then sends a JSON-encoded response containing the logo URL and attachment ID.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param int $board_id The ID of the board.
 * @param int $attachment_id The ID of the logo attachment.
 * @param string $logo_url The URL of the logo image.
 */

function save_logo_data_to_database($board_id, $attachment_id, $logo_url) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $existing_data = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $board_id
    ));
    if ($existing_data) {
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
    wp_send_json(array('url' => $logo_url, 'attachment_id' => $attachment_id));
}

/**
 * Handles the upload of a background image and saves data to the database.
 *
 * This function handles the upload of a background image and saves relevant data to the database.
 * It first checks if both the background image and board ID are set in the POST request.
 * If so, it proceeds to handle the file upload using WordPress's wp_handle_upload function.
 * Upon successful upload, it inserts an attachment into the media library and retrieves the attachment ID.
 * It then generates attachment metadata and updates the attachment metadata in the database.
 * Next, it saves the background data (board ID, attachment ID, and URL) to the database using the save_background_data_to_database function.
 * Finally, it sends a JSON-encoded response indicating success or failure of the upload process.
 *
 * Note: This function assumes the existence of the save_background_data_to_database function and relies on WordPress's media handling functions.
 */

function handle_background_upload() {
    if (isset($_FILES['background_image_upload'], $_POST['board_id'])) {
        $uploaded_background = $_FILES['background_image_upload'];
        $board_id = intval($_POST['board_id']);
        if ($uploaded_background['error'] == 0 && $board_id > 0) {
            $upload_overrides = array('test_form' => false);
            $movefile = wp_handle_upload($uploaded_background, $upload_overrides);
            if ($movefile && empty($movefile['error'])) {
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
                save_background_data_to_database($board_id, $attach_id, $movefile['url']);
                echo json_encode(array('success' => true, 'url' => $movefile['url']));
            } else {
                echo json_encode(array('error' => $movefile['error']));
            }
        } else {
            echo json_encode(array('error' => 'Invalid request.'));
        }
    } else {
        echo json_encode(array('error' => 'Invalid request.'));
    }
    wp_die();
}
add_action('wp_ajax_handle_background_upload', 'handle_background_upload');
add_action('wp_ajax_nopriv_handle_background_upload', 'handle_background_upload');

/**
 * Saves background data to the database.
 *
 * This function saves background data (attachment ID and URL) to the database for a specific board.
 * It first checks if data for the given board ID already exists in the database.
 * If data exists, it updates the existing record with the new background URL and timestamp.
 * If data does not exist, it inserts a new record into the database with the board ID, background URL, and timestamp.
 * It then sends a JSON-encoded response containing the background URL and attachment ID.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 * @param int $board_id The ID of the board.
 * @param int $attachment_id The ID of the background attachment.
 * @param string $background_url The URL of the background image.
 */

function save_background_data_to_database($board_id, $attachment_id, $background_url) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'configurator_data';
    $existing_data = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $board_id
    ));
    if ($existing_data) {
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
    wp_send_json(array('url' => $background_url, 'attachment_id' => $attachment_id));
}

/**
 * Clears specific links from the database.
 *
 * This function clears specific links (logo URL or background URL) associated with a board from the database.
 * It first retrieves the board ID and the type of link to clear from the POST data.
 * If the value is 'logo_url', it updates the database to set both the attachment ID and logo URL to NULL for the given board ID.
 * If the value is 'background_url', it updates the database to set the background URL to NULL for the given board ID.
 * Additionally, it calls the delete_image_callback function to perform any necessary cleanup of the deleted image.
 *
 * Note: This function assumes the existence of the delete_image_callback function and relies on the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

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

/**
 * Deletes a board from the database.
 *
 * This function deletes a board and its associated data from the database.
 * It retrieves the board ID from the POST data and constructs a SQL query to delete the board from the database table.
 * The function then executes the query to perform the deletion.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

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

/**
 * Resets a board to its default state.
 *
 * This function resets a board to its default state by updating its data in the database.
 * It retrieves the board ID from the POST data and constructs an array with default values for the board's properties.
 * The function then updates the board's data in the database table using the WordPress database abstraction class.
 *
 * Note: This function assumes the existence of the 'configurator_data' table.
 *
 * @global wpdb $wpdb WordPress database access abstraction object.
 */

function reset_board() {
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
add_action('wp_ajax_reset_board', 'reset_board');
add_action('wp_ajax_nopriv_reset_board', 'reset_board');

/**
 * Deletes an image attachment from the media library.
 *
 * This function deletes an image attachment from the media library based on the provided image URL.
 * It first checks if the image URL is valid and retrieves the attachment ID using 'attachment_url_to_postid'.
 * If the attachment ID is found, it attempts to delete the attachment using 'wp_delete_attachment'.
 * The function then sends a JSON response indicating success or failure.
 *
 * @param string $image_url The URL of the image to be deleted.
 */

function delete_image_callback($image_url) {
    if ($image_url) {
        $attachment_id = attachment_url_to_postid($image_url);
        if ($attachment_id) {
            $deleted = wp_delete_attachment($attachment_id, true);
            if ($deleted) {
                wp_send_json_success('Image deleted successfully.');
            } else {
                wp_send_json_error('Error deleting image.');
            }
        } else {
            wp_send_json_error('Attachment ID not found for the provided image URL.');
        }
    } else {
        wp_send_json_error('Image URL is missing.');
    }
    wp_die();
}

/**
 * Adds board data to the WooCommerce cart.
 *
 * This function adds board data to the WooCommerce cart. It receives the board products and quantities
 * via a POST request. It iterates through each product and quantity, adding them to the cart using
 * the 'add_to_cart' method of the WooCommerce cart object.
 */

function addBoardDataToCart() {
    $products = $_POST['products'];
    $user_id = get_current_user_id();
    $cart = WC()->cart;
    foreach ($products as $product) {
        $product_id = $product['product_id'];
        $quantity = $product['quantity'];
        $cart->add_to_cart($product_id, $quantity, 0, [], ['tool-color' => $product['color'], 'user_id' => $user_id]);
    }
    wp_die();
}
add_action('wp_ajax_addBoardDataToCart', 'addBoardDataToCart');
add_action('wp_ajax_nopriv_addBoardDataToCart', 'addBoardDataToCart');

// Add color column after product name in cart table header
add_filter('woocommerce_get_item_data', 'display_color_in_cart_header', 10, 2);
function display_color_in_cart_header($item_data, $cart_item) {
    $product = WC()->cart->get_cart();
    $color = $product[$cart_item['key']]['tool-color'];

    $value = '<div style="width: 20px;height: 20px;position: relative;left: 140px;top: 10px;background-color: '. $color .';"></div>';

    if (!empty($color)) {
        $item_data[] = array(
            'key'   => esc_attr__('Tool Color', 'product-custom-color'),
            'value' => $value,
        );
    }

    return $item_data;
}

// also save the color in the order item meta
add_action('woocommerce_checkout_create_order_line_item', 'save_color_to_order_item_meta', 10, 4);
function save_color_to_order_item_meta($item, $cart_item_key, $values, $order) {
    $color = $values['tool-color'];
    // print_r($values);
    if (!empty($color)) {
        $item->update_meta_data('Tool Color', '<div style="width: 20px;height: 20px;position: relative;left: 140px;top: 10px;margin-left: 90px;background: '.$color.'"></div>');
    }
}



/**
 * Displays the Amerison configurator shortcode.
 *
 * This function checks if the user is logged in. If the user is logged in, it retrieves products, configurator data,
 * and product attributes. It then includes different template files based on the URL parameters.
 * If the URL contains '/custom-request', it includes the 'custom-tool.php' template file.
 * If the URL contains '/board', it includes the 'configurator.php' template file.
 * Otherwise, it includes the 'board-list.php' template file.
 * It also passes necessary data to JavaScript variables.
 *
 * If the user is not logged in, it includes the 'main.php' template file.
 */

function amerison_shortcode() {
    if (is_user_logged_in()) {
        $products = get_products();
        $configurator = get_configurator_data_from_db();
        $attributes = get_product_attributes();
        ob_start();
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
add_shortcode('amerison_configurator', 'amerison_shortcode');