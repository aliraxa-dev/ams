<?php
/*
Plugin Name: Amerison Configurator
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
    wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css');
    wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js', array('jquery'), null, true);

    // Enqueue Font Awesome CSS
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

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


    <section class="row mx-auto p-3 p-md-4">

<div class="configure-left-div col-12 col-md-8 p-2 p-md-3">
<h1 >Shadow Board Title</h1>

<div class=" configure-left-inner-div"> </div>
</div>



<div class="configure-right-div col-12 col-md-4 p-0 mt-3">






<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
  <div class="panel panel-default mb-3">
    <div class="panel-heading" role="tab" id="headingOne">
    <h4 class="panel-title border border-2 border-black p-2">

        <a role="button" class="d-flex justify-content-between" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
       <p class="para-Accordion"> Board / Tool configuration</p> <p class="rotate-down">&gt;</p>
        </a>
      </h4>
    </div>





    <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body">
       
<!-- Board/tool configuration  -->
    <div class="configure-right-first-div ">

<!-- Button -->
<div class="d-flex tab-button-div">
<button class="active-button" id="boardconfig">
    Board Configuration
</button>

<button id="toolconfig">
   Tool Configruration
</button>
</div>


<!-- Board Config section -->
<div class="px-1 px-md-3 " id="boardconfig-div">

<!-- board title -->
<div class="board-title d-flex flex-column py-3">
 <label>
    Board Title
 </label>

 <input placeholder="Enter board title" class="py-2" />
</div>


<!-- board Dimensions -->
<div class="board-Dimensions d-flex flex-column py-3">
<label>
   Board Dimensions
</label>


    <select class="form-select" >
        <option selected>Select Option</option>
        <option value="1">24x72</option>
        <option value="2">36x72</option>
        <option value="3">48x72</option>
        <option value="3">Custom</option>
      </select>
    
</div>


<!-- Background color -->
<div class="background-color d-flex flex-column py-3">


<div class="btn-group" role="group" aria-label="Basic example">
    <button id="colorbutton_config" type="button" class="btn border-1 border border-black active-button">Solid Color</button>
    <button id="filebutton_config" type="button" class="btn border-1 border border-black">Upload Background</button>
  </div>
<div class="py-3 d-flex justify-content-between">
<input type="color" id="colorInput_config" name="colorInput" value="#ff0000">

<input id="fileInput_config" class="d-none" type="file" />

</div>

   
    
</div>




<!-- board style -->
<div class="board-style d-flex flex-column py-3">
<label>
   Board style
</label>


    <select class="form-select" >
        <option value="1">Wal Mount</option>
        <option value="2">Mobile</option>
        <option value="3">Stationary Stand</option>
        <option value="3">Magnet Mounted</option>
      </select>
    
</div>



<!-- board Material -->
<div class="board-Material d-flex flex-column py-3">
<label>
   Board Material
</label>


    <select class="form-select" >
        <option selected>StorSheild</option>
        <option value="1">StorLam</option>
        <option value="2">StorClear</option>
        <option value="3">StorShield+</option>
        <option value="3">StorLaze</option>
    </select>
    
</div>



<!-- Custom Logo -->
<div class="custom-Logo d-flex flex-column py-3">
<label>
   Custom Logo
</label>


    <select class="form-select" >
        <option selected>Select Option</option>
        <option value="1">Top Left</option>
        <option value="2">Top Right</option>
        <option value="3">Center</option>
    </select>
    
</div>


<!-- Quantity of Board(s) -->
<div class="custom-Logo d-flex justify-content-between py-2">
<label>
    Quantity of Board(s)
</label>

<input type="number" class="w-25">
    
</div>






</div>
<!-- Tool Config Div -->
<div class="px-1 px-md-3 d-none" id="tool-config-div">

    <!-- Tool type -->
    <div class="board-title d-flex flex-column py-3">
         <label>
          Tool Type
         </label>
    
         <select class="form-select" >
            <option value="1">Outline Shadow</option>
            <option value="2">Solid Shadow of tools</option>
          </select>
        
    </div>
    
    


    <!-- tool shadow color -->
    <div class="board-Dimensions d-flex flex-column py-3">
        <label>
            Tool shadow color
        </label>
    
     
            <select class="form-select" >
                <option selected>Select Option</option>
                <option value="1">Black</option>
                <option value="2">White</option>
              </select>
            
    </div>
    
    
    <!-- Hooks/Holders -->
    <div class="Hooks/Holders d-flex flex-column py-3">
    
    
        
            <label>
                Hooks/Holders
            </label>
        
         
                <select class="form-select" >
                <option selected>Select Option</option>
                    <option value="1">Stainless steel push-thru hook system</option>
                    <option value="1">Stainless plastic screw-mounted hook system hook system</option>
                    <option value="1">Stainless screw-mounted hook system</option>
                  </select>

     
           
            
    </div>
    
    
    
    
    </div>

    </div>


      </div>
    </div>
  </div>






  <div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingTwo">
      <h4 class="panel-title border border-2 border-black p-2">
        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style="width:100%">
          Tool / Hardware
        </a>
      </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
      <div class="panel-body">
    
<!-- Tool Bank  -->

<!-- <h1 class="text-center py-3">Tool bank</h1> -->

<div class="configure-right-second-div">

      <!-- Button -->





      <div class="d-flex tab-button-div">
    <button class="active-button" id="toolbank-button">
        Tool
    </button>

    <button id="hardwarebank-button">
       Hardware
    </button>
</div>



<div class="" id="toolbank-div">
    <h1>This is tool div</h1>
</div>


<div class="d-none" id="hardwarebank-div">
    <h1>This is hardware div</h1>
</div>

</div>

</div>
    
    </div>
    </div>
  </div>
  
</div>





</section>







    <div class="form-group">



        <label for="sel1">Select list:</label>
        <select class="form-control" id="attributes">
            <option value="0">Select Product</option>
        </select>
    </div>
    <div class="configure-left-inner-div" id="section1">

    </div>
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

