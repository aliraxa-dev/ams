<!-- Bootstrap Modal HTML -->
<div class="modal" id="confirmationModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmation</h5>
        <button type="button" class="close closeModel" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Are you sure you want to reset the board?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary closeModel" data-dismiss="modal">No</button>
        <button type="button" class="btn btn-primary" id="confirmReset">Yes</button>
      </div>
    </div>
  </div>
</div>


<div class="modal" id="dimentionConfirmationModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmation</h5>
        <button type="button" class="close closeModel" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        There should be additional charges for custom dimensions. Do you want to continue?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary closeModel" data-dismiss="modal">No</button>
        <button type="button" class="btn btn-primary" id="dimentionConfirm">Yes</button>
      </div>
    </div>
  </div>
</div>

<div id="preloader" class="preloader"></div>

<div class="dot_alert" id="dot_alert"></div>
<section class="w-auto border border-2 border-dark">
    <div class="row m-0">
        <div class="col-md-8">
            <div class="border border-2 border-dark my-2 section" id="section1">
                <div class="w-100" style="height: 50px" id="title_background_color">
                    <div class="h5 pt-3 set_board_title" id="set_board_title"></div>
                    <img src="" alt="" class="section1_logo" id="section1_logo">
                </div>
            </div>
            <div>
                <button type="button" class="btn btn-danger float-end my-3" id="reset_board">Reset Board</button>
            </div>
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
                                <div class="d-flex gap-3">
                                <div class="form-group col-md-10 px-0">
                                    <label for="bortTitle">Board Title</label>
                                    <input type="text" class="form-control set-radius-input" id="board_title" aria-describedby="bortTitleHelp" placeholder="Enter Board Title">
                                </div>

                                <div class="form-geoup pt-4">
                                <input
                                            class="tab-pane fade show active p-0"
                                            style="width: 25px; height: 25px;"
                                            type="color"
                                            name="colorInput"
                                            value="#f5f5f5"
                                            id="title_bg_color"
                                        />
                                </div>
                                </div>

                                <div class="board-Dimensions d-flex flex-column py-3">
                                    <label> Title Positions </label>

                                    <select class="form-select" id="title_position">
                                        <option selected>Select Option</option>
                                        <option value="left">Top Left</option>
                                        <option value="right">Top Right</option>
                                        <option value="center">Center</option>
                                    </select>
                                </div>

                                <!-- board Dimensions -->
                                <div class="board-Dimensions d-flex flex-column py-3">
                                <label> Board Dimensions </label>

                                <select class="form-select" id="board_dimensions">
                                    <option selected value="24x72">24x72</option>
                                    <option value="36x72">36x72</option>
                                    <option value="48x72">48x72</option>
                                    <option value="custom">custom</option>
                                </select>
                                </div>

                                <!-- Custom board Dimensions -->
                                <div class="custom_board_dimensions  flex-column py-3" id="custom_board_dimensions">
                                <label> Custom Board Dimensions </label>
                                <div class="d-flex gap-4">
                                <input type="text" class="form-control custom_values set-radius-input" id="custom_width" aria-describedby="bortTitleHelp" placeholder="width">
                                <span class="pt-2 fw-bolder" >X</span>
                                <input type="text" class="form-control custom_values set-radius-input" id="custom_height" aria-describedby="bortTitleHelp" placeholder="height">
                                </div>
                                </div>

                                <!-- Background color -->
                                <div class="background-color d-flex flex-column py-3">
                                <label> Background Color/Image </label>

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
                                            <input
                                                class="tab-pane fade show active p-0"
                                                style="width: 25px; height: 25px;"
                                                type="color"
                                                name="colorInput"
                                                value="#f5f5f5"
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
                                    <!-- <label for="background_image_upload">Background Image</label> -->
                                        <div class="d-flex gap-2">
                                            <form id="background-image_upload_form" action="#" method="post" enctype="multipart/form-data">
                                                <input
                                                    type="file"
                                                    class="form-control"
                                                    id="background_image_upload"
                                                    name="background_image_upload"
                                                    aria-describedby="bortTitleHelp"
                                                    placeholder="Upload Logo"
                                                />
                                            </form>
                                            <div class="">
                                                <button class="btn btn-danger" id="clear-background-image">Clear</button>
                                            </div>
                                        </div>
                                        <h6 class="" id="background_name"></h6>
                                        <!-- Clear button to remove background image -->
                                    </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <!-- board style -->
                                <div class="board-style d-flex flex-column py-3">
                                <label> Board style </label>

                                <select class="form-select" id="board_style">
                                    <option selected>Standard</option>
                                    <option value="Wal Mount">Wal Mount</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Stationary Stand">Stationary Stand</option>
                                    <option value="Magnet Mounted">Magnet Mounted</option>
                                </select>
                                </div>

                                <!-- board Material -->
                                <div class="board-Material d-flex flex-column py-3">
                                <label> Board Material </label>

                                <select class="form-select" id="board_material">
                                    <option selected>StorSheild</option>
                                    <option value="StorLam">StorLam</option>
                                    <option value="StorClear">StorClear</option>
                                    <option value="StorShield+">StorShield+</option>
                                    <option value="StorLaze">StorLaze</option>
                                </select>
                                </div>

                                <!-- Custom Logo -->
                                <div class="custom-Logo d-flex flex-column py-3">
                                <label> Custom Logo </label>

                                <select class="form-select" id="custom_logo">
                                    <option value="null">Select Option</option>
                                    <option selected value="left">Top Left</option>
                                    <option value="right">Top Right</option>
                                    <option value="center">Center</option>
                                </select>
                                </div>

                                <div class="d-flex flex-column">
                                <label for="logo_images">Logo</label>
                                    <div class="d-flex gap-2">
                                        <form id="image_upload_form" action="#" method="post" enctype="multipart/form-data">
                                            <input
                                                type="file"
                                                class="form-control"
                                                id="logo_images"
                                                name="logo_images"
                                                aria-describedby="bortTitleHelp"
                                                placeholder="Upload Logo"
                                            />
                                        </form>
                                        <div class="">
                                            <button class="btn btn-danger" id="clear_logo_image">Clear</button>
                                        </div>
                                    </div>
                                    <h6 class="" id="logo_name"></h6>
                                </div>

                                <!-- Quantity of Board(s) -->
                                <div class="quantity-of-Board d-flex flex-column py-3">
                                    <label> Quantity of Board(s) </label>
                                    <input type="number" class="form-control set-radius-input text-start px-3" id="quantity_of_boards" aria-describedby="bortTitleHelp" placeholder="Enter Quantity of Board(s)">
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
                        <option selected value="null">Select Product</option>
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

