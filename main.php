<div class="float-end">
    <a name="shadow_box" id="create_shadow_box" class="btn btn-primary" href="/cubx/wp-login.php" role="button">Create Shadow Box</a>
</div>

<p>
You need to <a href="/cubx/wp-login.php">Login</a> before you can add any items to it.
</p>








<!-- <table class="table table-striped">
        <thead>
            <tr>
                <th scope="col">Shadow Box</th>
                <th scope="col">Created</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>
            <php foreach ($shadow_boxes as $shadow_box) : ?>
                <tr>
                    <td><php echo $shadow_box->name; ?></td>
                    <td><php echo $shadow_box->created; ?></td>
                    <td><php echo $shadow_box->updated; ?></td>
                    <td>
                        <a href="<php echo esc_url(get_permalink()); ?>?board=<php echo $shadow_box->id; ?>" class="btn btn-primary">View</a>
                        <a href="<php echo esc_url(get_permalink()); ?>?board=<php echo $shadow_box->id; ?>&edit=true" class="btn btn-primary">Edit</a>
                        <a href="<php echo esc_url(get_permalink()); ?>?board=<php echo $shadow_box->id; ?>&delete=true" class="btn btn-primary">Delete</a>
                    </td>
                </tr>
            <php endforeach; ?>
        </tbody>
    </table> -->