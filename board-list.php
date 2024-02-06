<div class="float-end">
    <a name="shadow_box" id="create_shadow_box" class="btn btn-primary" href="<?php echo esc_url(get_permalink()); ?>?board=new" role="button">Create Shadow Board</a>
</div>

<div id="product-list">
    <h2>Board List</h2>
    <div class="border border-2 border-dark px-2 py-3 rounded rounded-3">
        <ol class="h3">
            <?php foreach ($configurator as $config) { ?>
                <li class="mx-3">
                <a class="product-item" href="<?php echo esc_url(get_permalink()); ?>?board=<?= $config['id']  ?>" data-product-id="<?php echo esc_attr($config['id']); ?>">
                    <h3><?= $config['board_title'] == '' ? "Shadow Box " . $config['id'] : $config['board_title'] ?></h3>
                </a>
                </li>
            <?php } ?>
        </ol>
    </div>
</div>



<script>
    var WP_PRODUCTS = <?= json_encode($products) ?>;
    var WP_ATTRIBUTES = <?= json_encode($attributes) ?>;
    var WP_CONFIGURATOR = <?= json_encode($configurator) ?>;
    var CONFIGURATOR_ENG = {};
</script>