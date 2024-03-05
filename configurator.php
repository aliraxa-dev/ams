<!-- <div id="image1" class="d-none"><img src="https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-1.png" alt="Wall Mount" class="img-fluid" /></div> -->
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

<!-- Background Image -->
<div class="modal" id="backgroundImageModel" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Background Image</h5>
        <button type="button" class="close closeModel" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      The background cannot be changed as this is a stainless steel board.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary closeModel" data-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary" id="confirmReset">Yes</button> -->
      </div>
    </div>
  </div>
</div>


<div class="modal" id="dimentionConfirmationModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Confirmation</h5>
        <button type="button" class="close closeModel1" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      Can't exceed more than 120x120 dimension
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary closeModel1" data-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary" id="dimentionConfirm">Yes</button> -->
      </div>
    </div>
  </div>
</div>

<div class="modal" id="boardWithTool" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Tools on Board</h5>
        <button type="button" class="close boardWithToolClose" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      Quantity of tools on board can't exceed more than current board size.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary boardWithToolClose" data-dismiss="modal">Close</button>
        <!-- <button type="button" class="btn btn-primary" id="dimentionConfirm">Yes</button> -->
      </div>
    </div>
  </div>
</div>

<div id="preloader" class="preloader"></div>

<div class="dot_alert" id="dot_alert"></div>
<section class="w-auto">
    <div class="row m-0 custom_height">
        <div class="col-md-8" id="left_section">
            <div class="left-box-custom-border my-2 section ui-droppable-active ui-droppable-hover" id="section1">
                <div class="w-100 color-box-customization" style="height: 50px" id="title_background_color">
                    <div class="h5 set_board_title" id="set_board_title"></div>
                    <img src="" alt="" class="section1_logo" id="section1_logo">
                </div>
            </div>
        </div>
        <div class="col-md-4 box-border-custom p-0 border border-dark">
            <!-- select input type -->
            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button
                    class="accordion-button text-dark accordian-customization p-2"
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
                    class="accordion-collapse collapse show "
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                >
                    <div class="accordion-body pt-0">
                    <div class="tab-content" id="tab-content">
                        <div
                        class="tab-pane active"
                        id="justified-tabpanel-0"
                        role="tabpanel"
                        aria-labelledby="justified-tab-0"
                        >
                        <ul class="nav nav-tabs board-tabs m-0 position-sticky top-0 bg-white" id="myTabs">
                            <li class="nav-item w-50 tabs-font">
                            <a
                                class="nav-link active border-bottom lexend-font"
                                id="tab1"
                                data-bs-toggle="tab"
                                href="#content1"
                                >Board Configuration</a
                            >
                            </li>
                            <li class="nav-item w-50 tabs-font">
                            <a
                                class="nav-link border-bottom lexend-font"
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
                                <div class="">
                                    <div class="form-group">
                                        <label class="fs-6 lexend-font" for="bortTitle">Board Title</label>
                                        <input type="text" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="board_title" aria-describedby="bortTitleHelp" placeholder="Enter Board Title">
                                    </div>
                                </div>

                                <div class="d-flex justify-content-between">
                                    <div class="board-dimensions form-group w-50">
                                        <label class="fs-6 lexend-font"> Title Positions </label>

                                        <select class="form-control px-2 py-1" id="title_position">
                                            <option selected>Select Option</option>
                                            <option value="left">Top Left</option>
                                            <option value="right">Top Right</option>
                                            <option value="center">Center</option>
                                        </select>
                                    </div>
                                    <div class="title_bg_color form-group">
                                        <label class="fs-6 lexend-font" for="title_bg_color">Header Color</label>
                                        <div class="form-group">
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
                                </div>

                                <!-- board Dimensions -->
                                <div class="board-dimensions form-group">
                                <label class="fs-6 lexend-font"> Board Dimensions </label>

                                <select class="form-control px-2 py-1" id="board_dimensions">
                                    <option selected value="24x72">24x72</option>
                                    <option value="36x72">36x72</option>
                                    <option value="48x72">48x72</option>
                                    <option value="custom">custom</option>
                                </select>
                                </div>

                                <!-- Custom board Dimensions -->
                                <div class="custom_board_dimensions flex-column" id="custom_board_dimensions">
                                <label class="fs-6 lexend-font pt-3 pb-1"> Custom Board Dimensions </label>
                                <div class="d-flex gap-4">
                                <input type="text" class="form-control bg-white text-dark custom_values rounded rounded-2 px-2 py-1" id="custom_width" aria-describedby="bortTitleHelp" placeholder="width">
                                <span class="pt-2 fw-bolder" >X</span>
                                <input type="text" class="form-control bg-white text-dark custom_values rounded rounded-2 px-2 py-1" id="custom_height" aria-describedby="bortTitleHelp" placeholder="height">
                                </div>
                                </div>

                                <!-- Background color -->
                                <div class="background-color form-group mt-3 py-2 border rounded rounded-2">
                                <label class="fs-6 lexend-font"> Background color / image </label>

                                <div
                                    class="btn-group w-100"
                                    role="group"
                                    aria-label="Basic example"
                                >
                                    <ul class="nav nav-tabs w-100 m-0 bg-white" id="myTabs1">
                                    <li class="nav-item w-50 tabs-font">
                                        <a
                                        class="nav-link active border-bottom show_storlaze_model lexend-font"
                                        id="tab1"
                                        data-bs-toggle="tab"
                                        href="#solidcolor"
                                        >Solid Color</a
                                        >
                                    </li>
                                    <li class="nav-item w-50 tabs-font">
                                        <a
                                        class="nav-link border-bottom show_storlaze_model lexend-font"
                                        id="tab2"
                                        data-bs-toggle="tab"
                                        href="#uploadbackground"
                                        >Upload Background</a
                                        >
                                    </li>
                                    </ul>
                                </div>
                                <div class="pb-3 px-2">
                                    <div class="tab-content" id="myTabContent">
                                    <div
                                        class="tab-pane fade show active"
                                        id="solidcolor"
                                        role="tabpanel"
                                        aria-labelledby="home-tab"
                                    >
                                        <div class="d-flex flex-column color_box_custom">
                                            <label class="fs-6 lexend-font" for="background_color">Select background color</label>
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
                                    <div class="form-group">
                                    <label class="fs-6 lexend-font" for="background_image_upload">Select background image</label>
                                        <div class="d-flex gap-2 background-box-custom flex-row">
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
                                            <div class="d-flex justify-content-end">
                                                <button class="btn btn-danger clear-button-custom lexend-font fs-6 px-2 py-1" id="clear-background-image">Clear</button>
                                            </div>
                                        </div>
                                        <h6 class="pt-2" style="font-size: 12px" id="background_name"></h6>
                                        <!-- Clear button to remove background image -->
                                    </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <!-- board style -->
                                <div class="board-style form-group">
                                <div class='d-flex align-items-center'>
                                    <label class="fs-6 lexend-font"> Board style </label>
                                    <div>
                                        <div class="tooltip-container px-2">
                                            <span class="tooltip-trigger">
                                                <i class="fa fa-info-circle fs-5"></i>
                                                <div class="custom-tooltip">
                                                <h6 class="fs-6 lexend-font">Please click the 'View' button to fully visualize the selected board style.</h6>
                                                <button id="board_style_config" class="fs-6 rounded rounded-3 text-white border-0 w-50">View</button>
                                            </div>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <select class="form-control px-2 py-1" id="board_style">
                                    <option selected value="Wall Mount">Wall Mount</option>
                                    <option value="Mobile">Mobile</option>
                                    <option value="Magnet Mounted">Magnet Mounted</option>
                                </select>
                                </div>

                                <!-- board Material -->
                                <div class="board-Material form-group">
                                    <label class="fs-6 lexend-font"> Board Material </label>
                                    <select class="form-control px-2 py-1" id="board_material">
                                        <option selected value="StorShield">StorShield</option>
                                        <option value="StorLam">StorLam</option>
                                        <option value="StorClear">StorClear</option>
                                        <option value="StorShield+">StorShield+</option>
                                        <option value="StorLaze">StorLaze</option>
                                    </select>
                                </div>

                                <div class="form-group logo_box">
                                <label class="fs-6 lexend-font" for="logo_images">Logo</label>
                                    <div class="d-flex gap-2 image_upload_btn flex-row">
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
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-danger clear-button-custom lexend-font fs-6 px-2 py-1" id="clear_logo_image">Clear</button>
                                        </div>
                                    </div>
                                    <h6 class="pt-2 mb-0" style="font-size: 12px" id="logo_name"></h6>
                                </div>

                                <!-- Custom Logo -->
                                <div class="custom-Logo form-group">
                                    <label class="fs-6 lexend-font" class="mb-1"> Logo Placement </label>
                                    <select class="form-control px-2 py-1" id="custom_logo">
                                        <option value="null">Select Option</option>
                                        <option selected value="left">Top Left</option>
                                        <option value="right">Top Right</option>
                                        <option value="center">Center</option>
                                    </select>
                                </div>

                                <!-- Quantity of Board(s) -->
                                <div class="quantity-of-Board form-group">
                                    <label class="fs-6 lexend-font"> Quantity of Board(s) </label>
                                    <input type="number" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark text-start" id="quantity_of_boards" aria-describedby="bortTitleHelp" placeholder="Enter Quantity of Board(s)">
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

                                <!-- tool shadow color -->
                                <div class="form-group tool_shadow_box">
                                    <label class="fs-6 lexend-font"> Tool shadow color </label>

                                    <select class="form-control px-2 py-1">
                                        <option selected>Select Option</option>
                                        <option value="1">Black</option>
                                        <option value="2">White</option>
                                    </select>
                                </div>

                                <!-- Tool / Hardware Bank  -->
                                <div class="form-group mb-2">
                                    <label class="fs-6 lexend-font" for="sel1">Select Tool</label>
                                    <select class="form-control px-2 py-1" id="attributes">
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
                    <div class="d-flex justify-content-center border-top border-dark">
                        <button type="button" class="btn btn-danger my-2 border border-top-1 " id="reset_board">Reset Board</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</section>

