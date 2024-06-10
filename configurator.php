<!-- Bootstrap Modal HTML -->
<div class="modal index" id="confirmationModal" tabindex="-1" role="dialog">
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
<div class="modal index" id="backgroundImageModel" tabindex="-1" role="dialog">
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


<div class="modal index" id="dimentionConfirmationModal" tabindex="-1" role="dialog">
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
      </div>
    </div>
  </div>
</div>

<div class="modal index" id="boardWithTool" tabindex="-1" role="dialog">
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

<div class="modal index" id="request_a_custom_tool" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header py-1">
        <h5 class="modal-title">Request a Custom Tool</h5>
        <button type="button" class="close request_custom_close py-0" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="badge bg-dark fw-bold w-100 text-center fs-6 mb-3">
            The cost per custom tool is $<span id="custom_price"></span>.
        </div>
        <div class="d-flex justify-content-end">
            <a href="https://5sshadowboard.com/wp-content/uploads/2024/05/11x17_Measuring-Board.pdf" target="_blank" class="text-primary fs-6" download><i class="fa fa-download" ></i> Download Measuring Sheet </a>
            <span class="mx-1" style="margin-top: -7px">|</span>

            <div class="btn-group">
            <div class="btn-sm bg-transparent lexend-font text-primary fw-light fs-6 p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa fa-caret-down fs-5" ></i> Instruction Guide</a>
            </div>
            <ul class="dropdown-menu">
                <li><a href="https://5sshadowboard.com/wp-content/uploads/2024/05/custom-tool-process.pdf" target="_blank" class="lexend-font text-primary fs-6 dropdown-item" download><i class="fa fa-download" ></i> Custom Tool Process</a></li>
                <li><a href="https://5sshadowboard.com/wp-content/uploads/2024/05/Tool-Measuring-Instructions_2021.pdf" target="_blank" class="lexend-font text-primary fs-6 dropdown-item" download><i class="fa fa-download" ></i> Tool Measuring Instructions</a></li>
            </ul>
            </div>
        </div>
        <form id="custom_tool_form" action="#" method="post" enctype="multipart/form-data">
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="custom_tool_image">Upload Custom Tool</label>
                <input
                    type="file"
                    class="form-control"
                    id="custom_tool_image"
                    name="custom_tool_image"
                    aria-describedby="bortTitleHelp"
                    placeholder="Upload Logo"
                />
            </div>
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="card_info">Card info</label>
                <div id="card-element">
                    <!-- A Stripe Element will be inserted here. -->
                </div>
            </div>
            

            <!-- Used to display form errors. -->
            <div id="card-errors" class="badge bg-danger" role="alert"></div>
            <div class="d-flex justify-content-end align-items-center">
                <button type="button" class="btn btn-primary mt-2" id="submit_custom_tool">Submit</button>
            </div>
        </form>
        <div class="d-flex justify-content-end mt-3">
            <div class="text-primary cursor-pointer fs-6" id="request_measuring_form">Request a larger Measuring sheet</div>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="modal index" id="measuring_a_custom_tool" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header py-1">
        <h5 class="modal-title">Request a larger Measuring sheet</h5>
        <button type="button" class="close measuring_close py-0" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="badge bg-danger w-100 fw-bold text-center fs-6 mb-3" style="text-wrap: wrap;">
            A $<span id="larger_price"></span> fee will be charged for the larger measuring sheet, the charge will be reimbursed upon placing an order for a shadow board.
        </div>
        <form id="measuring_form" method="post" enctype="multipart/form-data">
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="measuring_tool_name">Name</label>
                <input type="text" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="measuring_tool_name" name="measuring_tool_name" aria-describedby="toolName" placeholder="Enter name" />
            </div>
            <!-- Postal Address -->
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="measuring_postal_address">Address</label>
                <textarea class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="measuring_postal_address" name="measuring_postal_address" rows="1" aria-describedby="toolPostalAddress" placeholder="Write down the address" required></textarea>
            </div>
            <!-- Quantity -->
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="measuring_tool_quantity">Quantity</label>
                <input type="number" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="measuring_tool_quantity" name="measuring_tool_quantity" aria-describedby="toolQuantity" placeholder="Enter quantity">
            </div>
            <!-- Comments -->
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="measuring_tool_features">Comments</label>
                <textarea class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="measuring_tool_features" name="measuring_tool_features" rows="3" aria-describedby="toolFeatures" placeholder="Write down the comments descriptively" required></textarea>
            </div>
            <!-- TotalCost -->
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="measuring_tool_company">Total cost</label>
                <input type="number" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark" id="measuring_tool_company" name="measuring_tool_company" aria-describedby="toolCompany" placeholder="Enter total cost">
            </div>
            <div class="form-group mt-2">
                <label class="fs-6 lexend-font" for="card_info_measuring">Card info</label>
                <div id="card-element-measuring"></div>
            </div>
            <div class="d-flex justify-content-end align-items-center">
                <button type="button" class="btn btn-primary mt-2" id="submit_measuring_tool">Submit</button>
            </div>

        </form>

      </div>
    </div>
  </div>
</div>

<div id="preloader" class="preloader"></div>

<div class="d-flex justify-content-between">
    <div class="d-flex justify-content-center align-items-center drawing-tools bg-white px-2 border border-2 rounded rounded-2" style="">
        <div class="d-flex justify-content-center my-1 align-items-center">
            <button id="drawing_select" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Select" data-bs-content="Select and manipulate objects."><i class="text-black fa fa-mouse-pointer"></i></button>
            <button id="drawing_pencil" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Pen" data-bs-content="Freehand drawing tool."><i class="text-black fa fa-pencil"></i></button>
            <div class="dropdown cursor-pointer" id="line_stroke" style="display: none" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Pen Size" data-bs-content="Adjust the thickness of the pen." >
                <button id="line_dropdown" class="bg-white border-0 py-0 px-2 dropdown-toggle d-flex hide-after" data-bs-toggle="dropdown">
                    <span class="bg-black d-block" style="width: 15px; height: 2px"></span>
                </button>
                <ul class="dropdown-menu p-1 w-auto" id="drawing_brush_width" style="min-width: auto; z-index: 99999">
                    <li><button id="drawing_line_1" class="bg-white border-0 py-0 px-2"><span class="bg-black d-block drawing_line" data-width="2" style="width: 30px; height: 2px"></span></button></li>
                    <li><button id="drawing_line_2" class="bg-white border-0 py-0 px-2"><span class="bg-black d-block drawing_line" data-width="4" style="width: 30px; height: 4px"></span></i></button></li>
                    <li><button id="drawing_line_3" class="bg-white border-0 py-0 px-2"><span class="bg-black d-block drawing_line" data-width="6" style="width: 30px; height: 6px"></span></i></button></li>
                    <li><button id="drawing_line_4" class="bg-white border-0 py-0 px-2"><span class="bg-black d-block drawing_line" data-width="8" style="width: 30px; height: 8px"></span></i></button></li>
                </ul>
            </div>
            <!-- <button id="drawing_eraser" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Why me?" data-bs-content="And heres some amazing content."><i class="text-black bi bi-x-square-fill"></i></button> -->
            <button id="drawing_undo" disabled class="bg-white border-0 py-0 px-2 cursor-pointer" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Undo" data-bs-content="Undo the last action."><i class="text-black fa fa-undo"></i></button>
            <button id="drawing_redo" disabled class="bg-white border-0 py-0 px-2 cursor-pointer" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Redo" data-bs-content="Redo the last action."><i class="text-black fa fa-rotate-right"></i></button>
            <button id="drawing_eraser" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Delete" data-bs-content="Delete the selected item."><i class="text-black fa fa-trash"></i></button>
            <!-- <button id="crop-button" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Why me?" data-bs-content="And heres some amazing content."><i class="text-black fa fa-crop"></i></button> -->
            <button id="drawing_text" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Text" data-bs-content="Click to add the text."><i class="text-black fa fa-font"></i></button>
            <div class="dropdown" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Shape" data-bs-content="Draw predefined shapes.">
                <button id="shape_dropdown" class="bg-white border-0 py-0 px-2 dropdown-toggle hide-after" data-bs-toggle="dropdown">
                    <i class="text-black fa fa-square"></i>
                </button>
                <ul id="shapes_select" class="dropdown-menu p-1 w-auto" style="min-width: auto">
                    <li><button id="drawing_rectangle" data-shape="square" class="dropdown-item p-1 shape-items"><i class="text-black fa fa-square" ></i></button></li>
                    <li><button id="drawing_circle" data-shape="circle" class="dropdown-item p-1 shape-items"><i class="text-black fa fa-circle"></i></button></li>
                </ul>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center my-1">
            <div class="d-flex align-items-center">
                <div class="position-relative d-flex ms-1" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Shape Filler" data-bs-content="Fill shape with color.">
                    <!-- <img id="color-picker" class="position-absolute" width="22" height="22" src="https://img.icons8.com/metro/26/fill-color.png" alt="fill-color"/> -->
                    <input class="tab-pane fade show active p-0 border-0 ms-1 cursor-pointer" style="width: 17px; height: 17px; opacity: 1" type="color" name="colorInput" value="#000000" id="drawing_fill">
                </div>
                <div class="position-relative d-flex ms-2 justify-content-center align-items-center">
                    <!-- <img id="colorPickerToggle" class="position-absolute ms-1" width="22" height="22" src="https://img.icons8.com/windows/32/paint-palette.png" alt="paint-palette"/> -->
                    <input class="tab-pane fade show active p-0 border-0 cursor-pointer" style="width: 17px; height: 17px; opacity: 1" type="color" name="colorInput" value="#000000" id="drawing_stroke">
                    <span id="colorPickerToggle" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Shape Outline" data-bs-content="Fill the outline of shape with color." class="bg-white position-absolute cursor-pointer" style="height: 17px; width: 17px; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 5px solid black"></span>
                </div>
            </div>
            <div class="d-flex align-items-center ms-1">
                <div class="dropdown" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Text Editor" data-bs-content="Change color, size, and style text." >
                    <button id="drawing_line" class="bg-white border-0 py-0 px-2 dropdown-toggle hide-after" data-bs-toggle="dropdown">
                        <i class="text-black fa fa-text-height"></i>
                    </button>
                    <ul class="dropdown-menu p-1">
                        <li class="border border-dark rounded rounded-2 m-2 p-2">
                            <div class="d-flex flex-column gap-2 justify-content-start">
                                <div class="position-relative d-flex gap-2">
                                    <input class="tab-pane fade show active p-0 border-0 cursor-pointer" style="width: 17px; height: 17px; opacity: 1" type="color" name="colorInput" value="#000000" id="fill_color_text">
                                    <label for="textStroke">Text Color</label>
                                </div>
                                <div class="position-relative d-flex gap-2">
                                    <input class="tab-pane fade show active p-0 border-0 cursor-pointer" style="width: 17px; height: 17px; opacity: 1" type="color" name="colorInput" value="#000000" id="stroke_color_text">
                                    <label for="textStroke">Text Stroke</label>
                                </div>
                            </div>
                        </li>
                        <li class= "border border-dark rounded rounded-2 m-2">
                            <select id="text_font" class="form-select border-0 bg-white text-dark p-1">
                                <option value="Arial">Arial</option>
                                <option value="Courier New">Courier New</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </select>
                        </li>
                        <li class= "border border-dark rounded rounded-2 m-2">
                            <input type="number" id="text_size" class="form-control border-0 bg-white text-dark p-1" min="1" value="12">
                        </li>
                    </ul>
                </div>
                <button id="drawing_clear" class="fs-6 btn btn-danger border-0 py-0 px-2">Clear All</button>
            </div>
        </div>
    </div>


    <!-- add to cart button -->
    <div class="d-flex justify-content-end align-items-center my-1">
        <button id="add_to_cart" class="btn btn-primary border-0 py-1 px-2" style="display: none">Add to Cart</button>
    </div>
</div>


<div class="dot_alert" id="dot_alert"></div>
<section class="w-auto">
    <div class="row m-0 custom_height">
        <div class="col-md-8 px-0" id="left_section">
            <canvas style="position: absolute;" id="canvas" width="400" height="400"></canvas>
            <div class="left-box-custom-border section ui-droppable-active ui-droppable-hover" id="section1">
                <div class="w-100 color-box-customization" style="height: 50px" id="title_background_color">
                    <div class="h5 set_board_title" id="set_board_title"></div>
                </div>
                <div id="image-container" class="" style="display: none;">
                    <img src="" alt="" id="section1_logo" data-logo="" class="">
                </div>
            </div>
        </div>
        <div class="col-md-4  p-0">
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
                                <div class="d-flex gap-3">
                                    <div class="form-group board-title">
                                        <label class="fs-6 lexend-font" for="bortTitle">Board Title</label>
                                        <input type="text" class="form-control rounded rounded-2 px-2 py-1 bg-white" id="board_title" aria-describedby="bortTitleHelp" placeholder="Enter Board Title">
                                    </div>
                                    <div class="title_bg_color form-group">
                                        <label class="fs-6 lexend-font" for="title_header_color">Title Color</label>
                                        <div class="form-group">
                                            <input
                                                class="tab-pane fade show active p-0"
                                                style="width: 25px; height: 25px;"
                                                type="color"
                                                name="colorInput"
                                                value="#000000"
                                                id="title_header_color"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex gap-3">
                                    <div class="board-dimensions form-group">
                                        <label class="fs-6 lexend-font"> Title Positions </label>

                                        <select class="form-control px-2 py-1" id="title_position">
                                            <option value="null">Select Option</option>
                                            <option value="left" selected>Top Left</option>
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
                                        class="nav-link active border-bottom show_ToughSteel_model lexend-font"
                                        id="tab1"
                                        data-bs-toggle="tab"
                                        href="#solidcolor"
                                        >Solid Color</a
                                        >
                                    </li>
                                    <li class="nav-item w-50 tabs-font">
                                        <a
                                        class="nav-link border-bottom show_ToughSteel_model lexend-font"
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
                                        <option selected value="ToughGuard">ToughGuard</option>
                                        <option value="ToughLite">ToughLite</option>
                                        <option value="ToughClear">ToughClear</option>
                                        <option value="ToughGuard+">ToughGuard+</option>
                                        <option value="ToughSteel">ToughSteel</option>
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

                                <!-- Quantity of Board(s) -->
                                <div class="quantity-of-Board form-group">
                                    <label class="fs-6 lexend-font"> Quantity of Board(s) </label>
                                    <input type="number" class="form-control rounded rounded-2 px-2 py-1 bg-white text-dark text-start" id="quantity_of_boards" aria-describedby="bortTitleHelp" placeholder="Enter Quantity of Board(s)">
                                </div>
                            </div>
                            </div>
                            <div class="tab-pane fade" id="content2">
                                <!-- Tool config start -->
                                <div class="tab-pane" id="justified-tabpanel-1" role="tabpanel" aria-labelledby="justified-tab-1">
                                    <!-- Tool / Hardware Bank  -->
                                    <div class="form-group mb-2">
                                        <label class="fs-6 lexend-font" for="select_tools">Select tool type</label>
                                        <select class="form-control px-2 py-1" id="attributes">
                                        <option selected value="null">Select type</option>
                                        </select>
                                    </div>

                                    <div class="form-group mb-2">
                                        <input type="text" class="form-control rounded rounded-1 px-2 py-1 bg-white text-dark border-primary" id="searchInput" aria-describedby="basic-addon1" placeholder="Search tool name...">
                                    </div>

                                    <div class="loader" id="loader" style="display: none;">Loading...</div>
                                    <label class="fs-6 lexend-font mt-2 badge bg-secondary w-100 rounded-0 border border-2 border-dark" for="sel1">Tools list</label>
                                    <div class="section gap-2 overflow-auto border border-2 border-dark border-top-0" id="section2" data-bs-toggle="popover" data-bs-placement="left" data-bs-trigger="hover focus" title="Tool Color" data-bs-content="Click or drag a tool to the shadow board. You can update the color of the tool in the Shadow Board."></div>

                                    <div id="request_custom_tool" class="btn btn-primary cursor-pointer fs-6 float-end py-1 my-2">Request a custom tool</div>

                                    <label class="fs-6 lexend-font badge bg-secondary w-100 rounded-0 border border-2 border-dark" for="sel1">Custom tools list</label>
                                    <div class="section gap-2 overflow-auto border border-2 border-dark border-top-0" id="custom_section"></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="d-flex justify-content-center border-top border-dark">
                        <button class="btn btn-danger my-2 border border-top-1" id="reset_board">Reset Board</button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</section>

