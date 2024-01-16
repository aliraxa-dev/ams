<?php
/*
Plugin Name: Drag and Clone
Description: Custom plugin for drag and clone functionality.
Version: 1.0
Author: Ali Raza
*/

// Enqueue the necessary scripts and styles
function enqueue_drag_and_clone_scripts() {
    wp_enqueue_style('drag-and-clone-styles', plugin_dir_url(__FILE__) . 'style.css');
    wp_enqueue_script('jquery');
    wp_enqueue_script('jquery-ui', 'https://code.jquery.com/ui/1.12.1/jquery-ui.js', array('jquery'), null, true);
    wp_enqueue_script('drag-and-clone-script', plugin_dir_url(__FILE__) . 'script.js', array('jquery', 'jquery-ui'), null, true);
    // add bootstrap css and js
    wp_enqueue_style('bootstrap-css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', array('jquery'), null, true);

    // Pass Ajax URL to script.js
    wp_localize_script('drag-and-clone-script', 'drag_and_clone_vars', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
    ));
}

// get woocommeres products 
function get_products() {
    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => -1,
        'orderby'        => 'title',
        'order'          => 'ASC',
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
                    'id'     => $variation['variation_id'],
                    'attributes' => $variation['attributes'],
                    'price'  => $variation['display_price'],
                    'image'  => wp_get_attachment_url($variation['image_id']),
                );
            }
        }

        $product_list[] = array(
            'id'      => $product_id,
            'title'   => $product_data->get_name(),
            'price'   => $product_data->get_regular_price(),
            'image'   => wp_get_attachment_url(get_post_thumbnail_id($product_id)),
            'link'    => get_permalink($product_id),
            'attributes' => $attributes,
            'variations' => $variations,
        );
    }

    wp_reset_postdata();
    return $product_list;
}

// woo-commerce product attributes function
function get_product_attributes() {
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


add_action('wp_enqueue_scripts', 'enqueue_drag_and_clone_scripts');

// Register shortcode
function drag_and_clone_shortcode() {
    $products = get_products();
    $attributes = get_product_attributes();
    ob_start();

    ?>
    <!-- select inpu type -->
    <div class="form-group">
        <label for="sel1">Select list:</label>
        <select class="form-control" id="attributes">
            <option value="0">Select Product</option>
        </select>
    </div>
    <div class="section" id="section1"></div>
    <div class="section" id="section2">
        <!-- <div class="draggable" style="height: 50px;">Item 1</div>
        <div class="draggable" style="height: 70px;">Item 2</div>
        <div class="draggable" style="height: 40px;">Item 3</div>
        <div class="draggable" style="height: 60px;">Item 4</div> -->
    </div>

    <script>
      var WP_PRODUCTS = <?= json_encode($products) ?>;
        var WP_ATTRIBUTES = <?= json_encode($attributes) ?>;
      var CONFIGURATOR_ENG = {};
    </script>
    <?php
    return ob_get_clean();
}

add_shortcode('drag_and_clone', 'drag_and_clone_shortcode');

// Register script for the shortcode
function drag_and_clone_script() {
    // Leave this empty since the script is now enqueued separately
}

add_action('wp_footer', 'drag_and_clone_script');
