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
    wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js');

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
                    'width' => $variation['dimensions']['width'],
                    'height' => $variation['dimensions']['height'],
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
        $id = $_POST['id'];


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
                array('id' => $id),
                array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'),
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


// Register shortcode
function drag_and_clone_shortcode() {
    if (is_user_logged_in()) {
        $products = get_products();
        $configurator = get_configurator_data_from_db();
        $attributes = get_product_attributes();
        ob_start();
        if( isset($_GET['board']) ) {
            $board_id = $_GET['board'];
            $board = get_data_by_id($board_id);
            include plugin_dir_path(__FILE__) . 'configurator.php';
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