<div class="float-end">
    <a name="shadow_box" id="create_shadow_box" class="btn btn-primary" href="<?php echo esc_url(get_permalink()); ?>?board=new" role="button">Create Shadow Board</a>
</div>

<div id="product-list">
    <h2>Board List</h2>
    <div class="border border-2 border-dark px-2 py-3 rounded rounded-3">
        <ol class="h3">
            <?php foreach ($configurator as $config) { ?>
                <li class="mx-3">
                    <div class="d-flex justify-content-between">
                        <a class="product-item" href="<?php echo esc_url(get_permalink()); ?>?board=<?= $config['id']  ?>" data-product-id="<?php echo esc_attr($config['id']); ?>">
                            <h3><?= $config['board_title'] == '' ? "Shadow Box " . $config['id'] : $config['board_title'] ?></h3>
                        </a>
                        <!-- delete icon -->
                        <a href="#" class="delete-board" data-board-id="<?= $config['id'] ?>" data-board-title="<?= $config['board_title'] == '' ? "Shadow Box " . $config['id'] : $config['board_title'] ?>" data-toggle="modal" data-target="#confirmDeleteModal">
                            <img src="<?= plugin_dir_url(__DIR__) . 'amerison_configurator/images/trash.svg' ?>" alt="delete" width="20" height="20">
                        </a>
                    </div>
                </li>
            <?php } ?>
        </ol>
    </div>
</div>


<!-- Delete board confirmation model -->
<div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="confirmDeleteModalLabel">Confirm Deletion</h5>
                <button type="button" class="close closeModel" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this record? This action cannot be undone. <span class="px-2 py-1 bg-danger text-white fw-bolder rounded" id="delete_board"></span> All the data related to this board will be deleted.
            </div>
            <input type="hidden" id="delete_board_id" value="">
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
</div>



<script>
    var WP_PRODUCTS = <?= json_encode($products) ?>;
    var WP_ATTRIBUTES = <?= json_encode($attributes) ?>;
    var WP_CONFIGURATOR = <?= json_encode($configurator) ?>;
    var CONFIGURATOR_ENG = {};
</script>