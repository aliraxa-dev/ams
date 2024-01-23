<section class="w-auto border border-2 border-dark">
    <div class="row m-0">
        <div class="col-md-8">
            <div class="h5 pt-4" id="set_board_title"></div>
            <div class="border border-2 border-dark my-2 section" id="section1"></div>
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
                                <div class="form-group">
                                    <label for="bortTitle">Board Title</label>
                                    <input type="text" class="form-control" id="board_title" aria-describedby="bortTitleHelp" placeholder="Enter Board Title">
                                </div>

                                <!-- board Dimensions -->
                                <div class="board-Dimensions d-flex flex-column py-3">
                                <label> Board Dimensions </label>

                                <select class="form-select" id="board_dimensions">
                                    <option selected>Select Option</option>
                                    <option value="24x72">24x72</option>
                                    <option value="36x72">36x72</option>
                                    <option value="48x72">48x72</option>
                                    <option value="custom">Custom</option>
                                </select>
                                </div>

                                <!-- Background color -->
                                <div class="background-color d-flex flex-column py-3">
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
                                        <label> Background color </label>

                                        <input
                                            class="tab-pane fade show active p-0"
                                            style="width: 25px; height: 25px;"
                                            type="color"
                                            name="colorInput"
                                            value="rgb(255, 255, 255)"
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
                                        <label> Upload Background </label>

                                            <input
                                                type="file"
                                                class="form-control"
                                                id="upload_background"
                                                aria-describedby="bortTitleHelp"
                                                placeholder="Enter Board Title"
                                            />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                <!-- board style -->
                                <div class="board-style d-flex flex-column py-3">
                                <label> Board style </label>

                                <select class="form-select" id="board_style">
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
                                    <option selected>Select Option</option>
                                    <option value="1">Top Left</option>
                                    <option value="2">Top Right</option>
                                    <option value="3">Center</option>
                                </select>
                                </div>

                                <!-- Quantity of Board(s) -->
                                <div class="quantity-of-Board d-flex flex-column py-3">
                                    <label> Quantity of Board(s) </label>
                                    <input type="number" class="form-control" id="quantity_of_boards" aria-describedby="bortTitleHelp" placeholder="Enter Quantity of Board(s)">
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
                        <option value="0">Select Product</option>
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

