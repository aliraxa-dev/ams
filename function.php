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

    wp_enqueue_style('amerison_style', plugin_dir_url(__FILE__) . 'css/style.css');
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js', array('jquery'), null, true);
    wp_enqueue_script('amerison_script', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery', 'jquery-ui'), null, true);
    // add bootstrap css and js
    wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js', array('jquery'), null, true);

    // Pass Ajax URL to script.js
    wp_localize_script(
        'amerison_script',
        'amerison_vars',
        array(
            'ajaxurl' => admin_url('admin-ajax.php'),
        )
    );
}

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
                    'id' => $variation['variation_id'],
                    'attributes' => $variation['attributes'],
                    'price' => $variation['display_price'],
                    'image' => wp_get_attachment_url($variation['image_id']),
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
        user_id mediumint(9) NOT NULL,
        board_title text NOT NULL,
        board_dimensions text NOT NULL,
        background_color text NOT NULL,
        board_style text NOT NULL,
        board_material text NOT NULL,
        custom_logo text NOT NULL,
        quantity_of_boards text NOT NULL,
        config_data text NOT NULL,
        options text NOT NULL,
        timestamp datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    $resp = dbDelta($sql);
    // echo '<pre>';

}

register_activation_hook(__FILE__, 'create_configurator_table');

add_action('wp_enqueue_scripts', 'enqueue_amerison_scripts');


function update_configurator_data() {
   if (isset($_POST['section1Items'])) {
        global $wpdb;
        $table_name = $wpdb->prefix . 'configurator_data';

        $user_id = get_current_user_id();
        $config_data = sanitize_text_field($_POST['section1Items']);
        $color = sanitize_text_field($_POST['color']);
        $data = $_POST['data'];

        // echo '<pre>';
        // print_r($data);
        // echo '</pre>';
        // exit;


        // Check if there's existing data for the user
        $existing_data = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE user_id = %d",
            $user_id
        ));

        if ($existing_data) {
            // If data exists, update it
            $wpdb->update(
                $table_name,
                array(
                    'board_title' => $data['board_title'],
                    'board_dimensions' => $data['board_dimensions'],
                    'background_color' => $data['background_color'],
                    'board_style' => $data['board_style'],
                    'board_material' => $data['board_material'],
                    'custom_logo' => $data['custom_logo'],
                    'quantity_of_boards' => $data['quantity_of_boards'],
                    'config_data' => $config_data,
                    'options' => $color,
                    'timestamp' => current_time('mysql')
                ),
                array('user_id' => $user_id),
                array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'),
                array('%d')
            );
        } else {
            // If no data exists, insert a new record
            $wpdb->insert(
                $table_name,
                array(
                    'user_id' => $user_id,
                    'board_title' => $data['board_title'],
                    'board_dimensions' => $data['board_dimensions'],
                    'background_color' => $data['background_color'],
                    'board_style' => $data['board_style'],
                    'board_material' => $data['board_material'],
                    'custom_logo' => $data['custom_logo'],
                    'quantity_of_boards' => $data['quantity_of_boards'],
                    'config_data' => $config_data,
                    'options' => $color,
                    'timestamp' => current_time('mysql')
                ),
                array('%d', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
            );
        }

        wp_send_json_success('Data updated successfully!');
    } else {
        wp_send_json_error('Invalid request!');
    }

}

add_action('wp_ajax_update_configurator_data', 'update_configurator_data');
add_action('wp_ajax_nopriv_update_configurator_data', 'update_configurator_data'); // Allow non-logged in users to use the AJAX endpoint

// Function to get configurator data
function get_configurator_data() {
    check_ajax_referer('amerison-nonce', 'security');

    if (is_user_logged_in()) {
        $user_id = get_current_user_id();
        $config_data = get_user_meta($user_id, 'configurator_data', true);
        $options = get_user_meta($user_id, 'configurator_options', true);

        wp_send_json_success(array(
            'config_data' => $config_data,
            'options' => $options
        ));
    } else {
        wp_send_json_error('User not logged in.');
    }
}

add_action('wp_ajax_get_configurator_data', 'get_configurator_data');
add_action('wp_ajax_nopriv_get_configurator_data', 'get_configurator_data');


// Register shortcode

function drag_and_clone_shortcode() {
    if (is_user_logged_in()) {
        $products = get_products();
        $attributes = get_product_attributes();
        ob_start();

        ?>

        <section class="w-auto border border-2 border-dark">
        <div class="row m-0">

        <div class="col-md-8">
            <div class="h5 pt-4">Title</div>
                <div class="border border-2 border-dark my-2 section" id="section1"></div>
        </div>
        <div class="col-md-4 border border-dark border-top-0 border-right-0 border-bottom-0 p-0">
            <!-- select input type -->
            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                    >
                    Board / Tool Configuration
                    </button>
                </h2>
                <div
                    id="collapseOne"
                    class="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                    <div class="tab-content" id="tab-content">
                        <div
                        class="tab-pane active"
                        id="justified-tabpanel-0"
                        role="tabpanel"
                        aria-labelledby="justified-tab-0"
                        >
                        <ul class="nav nav-tabs" id="myTabs">
                            <li class="nav-item w-50">
                            <a
                                class="nav-link active border-bottom"
                                id="tab1"
                                data-bs-toggle="tab"
                                href="#content1"
                                >Board Configuration</a
                            >
                            </li>
                            <li class="nav-item w-50">
                            <a
                                class="nav-link border-bottom"
                                id="tab2"
                                data-bs-toggle="tab"
                                href="#content2"
                                >Tool Configuration</a
                            >
                            </li>
                        </ul>

                        <!-- Tab panes -->
                        <div class="tab-content mt-2">
                            <div class="tab-pane fade show active" id="content1">
                            <!-- Board Config section -->
                            <div class="" id="boardconfig-div">
                                <!-- board title -->
                                <div class="form-group">
                                    <label for="bortTitle">Board Title</label>
                                    <input type="text" class="form-control" id="board_title" aria-describedby="bortTitleHelp" placeholder="Enter Board Title">
                                </div>

                                <!-- board Dimensions -->
                                <div class="board-Dimensions d-flex flex-column py-3">
                                <label> Board Dimensions </label>

                                <select class="form-select" id="board_dimensions">
                                    <option selected>Select Option</option>
                                    <option value="1">24x72</option>
                                    <option value="2">36x72</option>
                                    <option value="3">48x72</option>
                                    <option value="3">Custom</option>
                                </select>
                                </div>

                                <!-- Background color -->
                                <div class="background-color d-flex flex-column py-3">
                                <div
                                    class="btn-group"
                                    role="group"
                                    aria-label="Basic example"
                                >
                                    <ul class="nav nav-tabs w-100" id="myTabs">
                                    <li class="nav-item w-50">
                                        <a
                                        class="nav-link active border-bottom"
                                        id="tab1"
                                        data-bs-toggle="tab"
                                        href="#solidcolor"
                                        >Solid Color</a
                                        >
                                    </li>
                                    <li class="nav-item w-50">
                                        <a
                                        class="nav-link border-bottom"
                                        id="tab2"
                                        data-bs-toggle="tab"
                                        href="#uploadbackground"
                                        >Upload Background</a
                                        >
                                    </li>
                                    </ul>
                                </div>
                                <div class="py-3">
                                    <div class="tab-content" id="myTabContent">
                                    <div
                                        class="tab-pane fade show active"
                                        id="solidcolor"
                                        role="tabpanel"
                                        aria-labelledby="home-tab"
                                    >
                                        <div class="d-flex flex-column">
                                        <label> Background color </label>

                                        <input
                                            class="tab-pane fade show active p-0"
                                            style="width: 25px; height: 25px;"
                                            type="color"
                                            name="colorInput"
                                            value="#ffffff"
                                            id="background_color"
                                        />

                                        </div>
                                    </div>
                                    <div
                                        class="tab-pane fade"
                                        id="uploadbackground"
                                        role="tabpanel"
                                        aria-labelledby="profile-tab"
                                    >
                                        <div class="d-flex flex-column">
                                        <label> Upload Background </label>

                                            <input
                                                type="file"
                                                class="form-control"
                                                id="upload_background"
                                                aria-describedby="bortTitleHelp"
                                                placeholder="Enter Board Title"
                                            />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <!-- board style -->
                                <div class="board-style d-flex flex-column py-3">
                                <label> Board style </label>

                                <select class="form-select" id="board_style">
                                    <option value="1">Wal Mount</option>
                                    <option value="2">Mobile</option>
                                    <option value="3">Stationary Stand</option>
                                    <option value="3">Magnet Mounted</option>
                                </select>
                                </div>

                                <!-- board Material -->
                                <div class="board-Material d-flex flex-column py-3">
                                <label> Board Material </label>

                                <select class="form-select" id="board_material">
                                    <option selected>StorSheild</option>
                                    <option value="1">StorLam</option>
                                    <option value="2">StorClear</option>
                                    <option value="3">StorShield+</option>
                                    <option value="3">StorLaze</option>
                                </select>
                                </div>

                                <!-- Custom Logo -->
                                <div class="custom-Logo d-flex flex-column py-3">
                                <label> Custom Logo </label>

                                <select class="form-select" id="custom_logo">
                                    <option selected>Select Option</option>
                                    <option value="1">Top Left</option>
                                    <option value="2">Top Right</option>
                                    <option value="3">Center</option>
                                </select>
                                </div>

                                <!-- Quantity of Board(s) -->
                                <div class="quantity-of-Board d-flex flex-column py-3">
                                    <label> Quantity of Board(s) </label>
                                    <input type="number" class="form-control" id="quantity_of_boards" aria-describedby="bortTitleHelp" placeholder="Enter Quantity of Board(s)">
                                </div>
                            </div>
                            </div>
                            <div class="tab-pane fade" id="content2">
                            <!-- Tool config start -->
                            <div
                                class="tab-pane"
                                id="justified-tabpanel-1"
                                role="tabpanel"
                                aria-labelledby="justified-tab-1"
                            >
                                <div class="d-flex flex-column py-3">
                                <label> Tool Type </label>

                                <select class="form-select">
                                    <option value="1">Outline Shadow</option>
                                    <option value="2">Solid Shadow of tools</option>
                                </select>
                                </div>

                                <!-- tool shadow color -->
                                <div class="d-flex flex-column py-3">
                                <label> Tool shadow color </label>

                                <select class="form-select">
                                    <option selected>Select Option</option>
                                    <option value="1">Black</option>
                                    <option value="2">White</option>
                                </select>
                                </div>

                                <!-- Hooks/Holders -->
                                <div class="d-flex flex-column py-3">
                                <label> Hooks/Holders </label>

                                <select class="form-select">
                                    <option selected>Select Option</option>
                                    <option value="1">
                                    Stainless steel push-thru hook system
                                    </option>
                                    <option value="1">
                                    Stainless plastic screw-mounted hook system hook
                                    system
                                    </option>
                                    <option value="1">
                                    Stainless screw-mounted hook system
                                    </option>
                                </select>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button
                    class="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                    >
                    Tool / Hardware Bank
                    </button>
                </h2>
                <div
                    id="collapseTwo"
                    class="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body">
                    <div class="form-group">
                        <label for="sel1">Select list:</label>
                        <select class="form-control mb-2" id="attributes">
                        <option value="0">Select Product</option>
                        </select>
                    </div>

                    <div class="section" id="section2"></div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
        </section>



            <script>
        var WP_PRODUCTS = <?= json_encode($products) ?>;
            var WP_ATTRIBUTES = <?= json_encode($attributes) ?>;
        var CONFIGURATOR_ENG = {};
        </script>
        <?php
        return ob_get_clean();
    } else {
        return '<p>You need to <a href="' . wp_login_url() . '">log in</a> to use this feature.</p>';
    }}

add_shortcode('drag_and_clone', 'drag_and_clone_shortcode');

// Register script for the shortcode
function drag_and_clone_script()
{
    // Leave this empty since the script is now enqueued separately
}

add_action('wp_footer', 'drag_and_clone_script');