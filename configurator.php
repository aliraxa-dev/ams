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

<!-- Prompt for Staneless steel -->
<div class="modal index" id="stanelessSteelPrompt" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Notice</h5>
        <button type="button" class="close closeModel" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      For stainless steel boards, please reach out to us for pricing.
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
            <button id="drawing_select" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Select" data-bs-content="Select and manipulate objects.">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="22px" width="22px" version="1.1" id="Layer_1" viewBox="0 0 512 512" xml:space="preserve">
                <g transform="translate(0 -1)">
                    <g>
                        <g>
                            <path d="M74.29,41.167l11.034-11.034v30.601c0,4.719,3.814,8.533,8.533,8.533c4.719,0,8.533-3.814,8.533-8.533V30.134     l11.034,11.034c1.664,1.664,3.849,2.5,6.033,2.5s4.369-0.836,6.033-2.5c3.336-3.337,3.336-8.73,0-12.066L99.899,3.51     c-0.785-0.794-1.732-1.417-2.782-1.852c-2.091-0.862-4.437-0.862-6.519,0c-1.05,0.435-1.997,1.058-2.782,1.852L62.224,29.101     c-3.336,3.337-3.336,8.73,0,12.066C65.56,44.504,70.953,44.504,74.29,41.167z"></path>
                            <path d="M113.424,148.567l-11.034,11.034V129c0-4.719-3.814-8.533-8.533-8.533c-4.719,0-8.533,3.814-8.533,8.533v30.601     L74.29,148.567c-3.337-3.337-8.73-3.337-12.066,0c-3.336,3.336-3.336,8.73,0,12.066l25.591,25.591     c0.785,0.794,1.732,1.417,2.782,1.852c1.041,0.435,2.15,0.657,3.26,0.657c1.109,0,2.219-0.222,3.26-0.657     c1.05-0.435,1.997-1.058,2.782-1.852l25.591-25.591c3.336-3.337,3.336-8.73,0-12.066     C122.153,145.23,116.76,145.23,113.424,148.567z"></path>
                            <path d="M187.067,98.126c0.862-2.082,0.862-4.429,0-6.519c-0.435-1.05-1.067-1.997-1.852-2.782l-25.591-25.591     c-3.337-3.328-8.738-3.328-12.066,0c-3.337,3.337-3.337,8.738,0,12.066l11.034,11.034h-30.601c-4.719,0-8.533,3.814-8.533,8.533     s3.814,8.533,8.533,8.533h30.601l-11.034,11.034c-3.337,3.337-3.337,8.738,0,12.066c1.664,1.672,3.849,2.5,6.033,2.5     c2.185,0,4.369-0.828,6.033-2.5l25.591-25.591C186.001,100.122,186.632,99.175,187.067,98.126z"></path>
                            <path d="M29.124,103.4h30.601c4.719,0,8.533-3.814,8.533-8.533s-3.814-8.533-8.533-8.533H29.124L40.158,75.3     c3.337-3.337,3.337-8.73,0-12.066c-3.336-3.337-8.73-3.337-12.066,0L2.5,88.825c-0.794,0.785-1.417,1.732-1.852,2.782     c-0.862,2.082-0.862,4.437,0,6.519c0.435,1.05,1.058,1.997,1.852,2.782L28.091,126.5c1.664,1.664,3.849,2.5,6.033,2.5     c2.185,0,4.369-0.836,6.033-2.5c3.337-3.337,3.337-8.73,0-12.066L29.124,103.4z"></path>
                            <path d="M511.982,342.154l-0.026-119.287c0-20.139-16.435-42.667-38.417-42.667c-8.073,0-15.309,2.927-21.257,7.612l0.009-7.612     c0-20.19-16.435-42.769-38.417-42.769c-8.055,0-15.369,3.038-21.393,7.868c-0.41-19.942-16.7-41.899-38.409-41.899     c-8.021,0-15.309,3.012-21.316,7.799V43.667C332.756,23.528,316.321,1,294.339,1c-21.965,0-38.383,22.528-38.383,42.667v180.702     c-7.706-15.846-17.476-31.027-28.117-41.668c-13.85-13.833-41.105-14.788-56.09-2.022c-4.881,4.156-19.268,19.84,0.478,47.181     c18.304,25.378,32.512,82.372,32.512,114.475c0,68.181,44.382,98.978,59.785,107.605v54.528c0,4.719,3.814,8.533,8.533,8.533     h204.8c4.71,0,8.525-3.814,8.533-8.525l0.06-57.02C512.118,413.083,512.11,409.038,511.982,342.154z M358.39,419.133h25.6     c4.719,0,8.533,3.814,8.533,8.533c0,4.719-3.814,8.533-8.533,8.533h-25.6c-4.719,0-8.533-3.814-8.533-8.533     C349.857,422.948,353.671,419.133,358.39,419.133z M392.524,470.333h-42.667c-4.719,0-8.533-3.814-8.533-8.533     s3.814-8.533,8.533-8.533h42.667c4.719,0,8.533,3.814,8.533,8.533S397.243,470.333,392.524,470.333z"></path>
                        </g>
                    </g>
                </g>
                </svg>
            </button>
            <button id="drawing_pencil" class="bg-white border-0 py-0 px-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Pen" data-bs-content="Freehand drawing tool."><i class="text-black fa fa-pencil"></i></button>
            <div class="dropdown cursor-pointer" id="line_stroke" style="display: none" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Pen Size" data-bs-content="Adjust the thickness of the pen." >
                <button id="line_dropdown" class="bg-white border-0 py-0 px-2 dropdown-toggle d-flex hide-after" data-bs-toggle="dropdown">
                    <span class="bg-black d-block" style="width: 15px; height: 2px; margin: 10px 0;"></span>
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
                <button id="drawing_clear" class="btn btn-danger border-0 py-1 px-2" style="font-size: 13px">Clear All</button>
            </div>
        </div>
    </div>

    <!-- add to cart button -->
    <div class="d-flex justify-content-end align-items-center my-1 gap-3">
        <div class="align-items-center bg-danger text-white gap-3 px-3 py-2  border border-2 border-dark rounded rounded-2" id="total_price_container" style="display: none">
            <span id="total_price_text" class="mb-0 fw-bold lexend-font fs-6 text-white">Board Price: </h4>
            <span class="fs-6 fw-bold lexend-font" id="total_price"></span>
        </div>
        <button id="add_to_cart" class="btn btn-primary border-0 fs-6 px-3 py-2 fw-bold" style="display: none">Add to Cart</button>
    </div>
</div>


<div class="dot_alert" id="dot_alert"></div>
<section class="w-auto">
    <div class="row m-0 custom_height">
        <div class="col-md-8 px-0 bg-transparent" id="left_section">
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
                    class="accordion-button text-dark accordian-customization p-2 marker-font"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne1"
                    aria-expanded="true"
                    aria-controls="collapseOne1"
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
                                    <div class="input-filed form-group">
                                        <label class="fs-6 lexend-font"> Title Positions </label>

                                        <select class="form-control px-2 py-1" id="title_position">
                                            <option value="null">Select Option</option>
                                            <option value="left" selected>Top Left</option>
                                            <option value="center">Center</option>
                                            <option value="right">Top Right</option>
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

                                <!-- Background color -->
                                <div class="background-color form-group mt-1 py-1 rounded rounded-2">
                                <label class="fs-6 lexend-font pb-2"> Background color / image </label>

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
                                                <button class="btn btn-danger clear-button-custom fs-6 px-2 py-1" id="clear-background-image">Clear</button>
                                            </div>
                                        </div>
                                        <h6 class="pt-2" style="font-size: 12px" id="background_name"></h6>
                                        <!-- Clear button to remove background image -->
                                    </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <!-- board Dimensions -->
                                <div class="board-dimensions form-group">
                                    <label class="fs-6 lexend-font"> Board Dimensions </label><i class="fa fa-info-circle fs-5 px-2 pt-2" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Note" data-bs-content='If there are area restrictions, and you require a size not displayed, please reach out to us for assistance and pricing.'></i>
                                    <select class="form-control px-2 py-1" id="board_dimensions" data-bs-toggle="popover" data-bs-placement="top" data-bs-trigger="hover focus" title="Note" data-bs-content='If a larger board is required, please reach to us for assistance and pricing.'></select>
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
                                        <option selected value="ToughLite">TOUGHLIGHT</option>
                                        <option value="ToughLam">TOUGHLAM</option>
                                        <option value="ToughGuard">TOUGHGUARD</option>
                                        <option value="ToughGuard+">TOUGHGUARD+</option>
                                        <option value="ToughClear">TOUGHCLEAR</option>
                                        <option value="ToughSteel">TOUGHSTEEL</option>
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
                                            <button class="btn btn-danger clear-button-custom fs-6 px-2 py-1" id="clear_logo_image">Clear</button>
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

