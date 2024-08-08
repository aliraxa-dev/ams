(function ($) {
  var console_disabled = false;

  // Global Variables Initializations
  var _setting_penal_properties = {
    workspace_title: "",
    workspace_title_position: "",
    workspace_title_bg_color: "",
    workspace_title_header_color: "",
    workspace_dimensions: "",
    workspace_background_color: "",
    workspace_background_image: "",
    workspace_style: "",
    workspace_material: "",
    workspace_logo: { top: "", left: "", width: "", height: "" },
    workspace_quantity: "",
  };
  var _admin_ajax = amerisan_client.ajax_request;
  var _board_title_color = "#000000";
  var _board_height_inches = 12;
  var _board_width_inches = 12;
  let _previous_workspace = window.location.search !== "?board=new";

  const _variation_dropdown = $("#attributes");
  const _settings_panel = $("#settings_panel");
  const _workspace_area = $("#workspace_area");
  const _user_requested_tools = $("#user_requested_tools");
  const _workspace_dimentions = $("#board_dimensions");
  const _main_workspace_area = $("#main_workspace_area");
  const _workspace_material = $("#board_material");
  const _workspace_logo_container = $("#image-container");
  const _workspace_title = $("#board_title");
  const _workspace_title_position = $("#title_position");
  const _workspace_background_color = $("#background_color");
  const _workspace_style = $("#board_style");
  const _workspace_quantity = $("#quantity_of_boards");
  const _workspace_header_title_color = $("#title_header_color");
  const _workspace_tital_bg_color = $("#title_bg_color");

  var _set_workspace_title = $("#set_board_title");
  var _set_title_bg_color = $("#title_background_color");
  var _set_workspace_logo = $("#workspace_area_logo");
  var _set_panel_logo_name = $("#logo_name");
  var _set_background_image_name = $("#background_name ");



  const _palet_colors_list = [
    "#aa182c",
    "#a87bc9",
    "#ff5100",
    "#ffd600",
    "#9ea1a2",
    "#6d3628",
    "#005cb9",
    "#0db14b",
    "#ee4d9a",
    "#231f20",
    "#ffffff",
  ];
  const _tough_steel_color =
    "linear-gradient(90deg, rgba(108,110,112,1) 0%, rgba(172,174,177,1) 6%, rgba(171,171,172,1) 17%, rgba(217,218,220,1) 50%, rgba(138,140,143,1) 80%, rgba(88,89,91,1) 100%)";

  const _null_function = function () { };
  console = new Proxy(console, {
    get(target, prop, receiver) {
      if ((prop === "log" && console_disabled)) {
        return _null_function;
      }
      return Reflect.get(...arguments);
    },
  });

  // if the page url is /configurator
  var url = window.location.href;
  if (url.includes("configurator")) {
    if (WP_ATTRIBUTES !== undefined && WP_ATTRIBUTES.pa_color !== undefined) {
      WP_ATTRIBUTES.pa_color.values.forEach((color) => {
        if (color !== "Custom") {
          _variation_dropdown.append(
            '<option value="' + color.toLowerCase() + '">' + color + "</option>"
          );
        }
      });
    }
  }

  function _touch_handler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
      {
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup",
      }[event.type],
      true,
      true,
      window,
      1,
      touch.screenX,
      touch.screenY,
      touch.clientX,
      touch.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    touch.target.dispatchEvent(simulatedEvent);
  }

  function _initilaze_touch_handlers() {
    document.addEventListener("touchstart", _touch_handler, true);
    document.addEventListener("touchmove", _touch_handler, true);
    document.addEventListener("touchend", _touch_handler, true);
    document.addEventListener("touchcancel", _touch_handler, true);
  }

  $(".draggable").on(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  // Example usage:
  // const user = {
  //     username: 'john_doe',
  //     email: 'john.doe@example.com',
  //     age: 30
  // };

  // const validations = {
  //     username: { required: true, type: 'string' },
  //     email: { required: true, type: 'string' },
  //     age: { required: true, type: 'number', min: 18 },
  //     customField: { customValidator: value => value.startsWith('custom') }
  // };

  function _validate_object(_object, _validations) {
    if (!_validations || typeof _validations !== "object") {
      console.error("Validation rules must be provided as an object.");
      return false;
    }

    for (let key in _validations) {
      if (_validations.hasOwnProperty(key)) {
        let value = _object[key];
        let rules = _validations[key];

        if (
          rules.required &&
          (value === undefined || value === null || value === "")
        ) {
          displayNotification(`Error:: ${key} is required.`);
          return false;
        }

        if (rules.type && typeof value !== rules.type) {
          displayNotification(
            `Error:: ${key} should be of type ${rules.type}.`
          );
          return false;
        }

        if (rules.min && value < rules.min) {
          displayNotification(
            `Error:: ${key} should be greater than or equal to ${rules.min}.`
          );
          return false;
        }

        if (
          rules.customValidator &&
          typeof rules.customValidator === "function"
        ) {
          const isValid = rules.customValidator(value);
          if (!isValid) {
            displayNotification(`Error:: ${key} failed custom validation.`);
            return false;
          }
        }
      }
    }

    return true;
  }

  function displayNotification(message) {
    toastr.error(message);
  }

  function _get_tools_in_pixel(
    _baord_in_inches,
    _board_in_pixels,
    _tool_in_inches
  ) {
    var _inches_to_pixel_ratio = _board_in_pixels / _baord_in_inches;
    var _tool_in_pixels = _inches_to_pixel_ratio * _tool_in_inches;
    return _tool_in_pixels;
  }

  function _generate_random_string(length = 8) {
    const _characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const _characters_length = _characters.length;
    let _result = "";

    for (let i = 0; i < length; i++) {
      _result += _characters.charAt(
        Math.floor(Math.random() * _characters_length)
      );
    }

    return _result;
  }

  function _adjust_size_of_tools(_tool_width, _tool_height) {
    var _dimentions_value = _workspace_dimentions.val();

    if (_dimentions_value === undefined || _dimentions_value === null) {
      _dimentions_value = localStorage.getItem("previous_board_dimensions");
    }

    if (_dimentions_value !== "" || _dimentions_value !== undefined || _dimentions_value !== null) {
      _dimentions_value = _dimentions_value == null ? "" : _dimentions_value.split("x");
      _board_height_inches = _dimentions_value[1];
      _board_width_inches = _dimentions_value[0];
    } else {
      _board_height_inches = _board_height_inches;
      _board_width_inches = _board_width_inches;
    }
    let _board_height_pixels = _workspace_area.height();
    let _board_width_pixels = _workspace_area.width();

    var pixelsForToolHeight = _get_tools_in_pixel(_board_height_inches, _board_height_pixels, _tool_height);
    var pixelsForToolWidth = _get_tools_in_pixel(_board_width_inches, _board_width_pixels, _tool_width);
    // const header_height = _set_title_bg_color.height();
    const header_height = 0;

    // console.log('====================================');
    // console.log(pixelsForToolWidth, 'pixelsForToolWidth');
    // console.log(pixelsForToolHeight, 'pixelsForToolHeight');
    // console.log('====================================');

    return {
      width: pixelsForToolWidth,
      height: pixelsForToolHeight - header_height,
    };
  }

  function _adjust_workspace_area_size(_workspace_width, _workspace_height) {
    var _view_port_width = _main_workspace_area.width();
    var _view_port_height = _main_workspace_area.height();

    var _aspect_ratio = _workspace_width / _workspace_height;

    var _width = _view_port_width;
    var _height = _view_port_width / _aspect_ratio;

    if (_height > _view_port_height) {
      _height = _view_port_height;
      _width = _height * _aspect_ratio;
    }
    canvas.setWidth(_width);
    canvas.setHeight(_height);
    return { width: _width, height: _height };
  }

  function _generate_color_palette(_tools, _colors, _top, _left, _id = 0, _random_string) {
    const _color_palette = $(
      '<div class="custom-color-picker" id=""><div class="color-input cursor-pointer" style="background-color: black" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to change the tool color."><div class="color-options" data-id="' +
      _random_string +
      '"></div></div>'
    );
    _tools.append(_color_palette);
    const stainlessSteel = _workspace_material.val();
    if (stainlessSteel !== "ToughSteel") {
      $(".custom-color-picker").addClass("hide-important");
    }

    const _color_options = _color_palette.find(".color-options");

    _colors.forEach((color) => {
      const colorOption = $(
        '<div class="custom-color" style="background-color: ' +
        color +
        '"></div>'
      );
      _color_options.append(colorOption);
    });

    _color_palette.css({
      top: _top + 30 + "px",
      left: _left + 4 <= 40 ? _left + 50 + "px" : _left + 4 + "px",
      position: "absolute",
      display: "none",
    });

    _color_palette.find(".color-input").click(function () {
      $(this).find(".color-options").toggle();
    });

    _left + 4 <= 10
      ? $(".color-options").css("left", "25%")
      : $(".color-options").css("left", "-150%");

    _color_palette.find(".custom-color").click(function () {
      var _selected_color = $(this).css("background-color");
      var _selected_option_id = $(this).parents(".color-options").data("id");
      console.log(_selected_option_id, 'selected option id');
      $(this).closest(".color-input").css("background-color", _selected_color);
      $(this).closest(".color-options").hide();
      $(this).closest(".custom-color-picker").find(".color-options").toggle();

      const _tool_src = $("#tool_img_" + _selected_option_id).attr("src");
      const _tool_alt = $("#tool_img_" + _selected_option_id).attr("alt");
      const _tool_height = $("#tool_img_" + _selected_option_id).data("height");
      const _tool_width = $("#tool_img_" + _selected_option_id).data("width");
      $("#tool_img_" + _selected_option_id).data("color", _selected_color);

      _chnage_color_of_svg(_tool_src, _selected_color, _selected_option_id, _tool_alt, _tool_height, _tool_width);
    });
  }

  $(".settings_panel_tools").draggable({
    revert: "invalid",
    helper: "clone",
    start: function (event, ui) {
      $(this).data("originalPosition", ui.helper.offset());
    },
    drag: function (event, ui) {
      var _containment_left = _workspace_area.offset().left;
      var _containment_top = _workspace_area.offset().top;
      var _containment_right = _containment_left + _workspace_area.width() - $(this).width();
      var _containment_bottom = _containment_top + _workspace_area.height() - $(this).height();

      ui.position.left = Math.min(
        Math.max(ui.position.left, _containment_left),
        _containment_right
      );
      ui.position.top = Math.min(
        Math.max(ui.position.top, _containment_top),
        _containment_bottom
      );
      _workspace_area.droppable("destroy");
      _allow_drop_in_workspace();
      _update_workspace_data_in_database();
      _update_data_in_localstorage();
    },
  });

  function _allow_drop_in_workspace() {
    _workspace_area.droppable({
      accept: ".draggable",
      drop: function (event, ui) {
        var _setting_panel_section = ui.draggable.closest(".section").attr("id");
        var _workspace_section = event.target.id;
        var _left_position = ui.position.left;
        var _top_position = ui.position.top;

        const _tool_clone = ui.helper.clone();

        const _draged_tool_element = $(
          '<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>'
        );

        $(this).append(_draged_tool_element);

        if (_workspace_section === "workspace_area" && _setting_panel_section !== "workspace_area") {
          const _random_string = _generate_random_string(8);
          var _tool_width = _tool_clone.data("width");
          var _tool_height = _tool_clone.data("height");
          var _tool_id = _tool_clone.data("id");
          var _tool_image = _tool_clone.data("image");

          const _append_close_button = $(
            '<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_' +
            _random_string +
            '">X</span>'
          );

          _tool_clone.data("height", _tool_height);
          _tool_clone.data("width", _tool_width);
          _tool_clone.data("id", _tool_id);
          _tool_clone.data("image", _tool_image);


          _tool_clone.css({
            top: _top_position + "px",
            left: _left_position + "px",
            position: "absolute",
            width: "auto",
            height: _tool_height + "px",
            "max-height": _tool_height + "px",
          });
          _draged_tool_element.append(_tool_clone);
          _tool_clone.attr("class", "item draggable");
          _tool_clone.attr("id", "tool_img_" + _random_string);
          _draged_tool_element.append(_append_close_button);

          _append_close_button.css({
            top: _top_position + "px",
            left: _left_position + 4 <= 40 ? _left_position + 50 + "px" : _left_position + 4 + "px",
            position: "absolute",
          });

          _generate_color_palette(_draged_tool_element, _palet_colors_list, _top_position, _left_position, _tool_id, _random_string);
          if (_workspace_material.val() === "ToughSteel") {
            _chnage_color_of_svg(_tool_image, "black", _random_string, "outline", _tool_height, _tool_width);
          } else {
            _chnage_color_of_svg(_tool_image, "black", _random_string, _tool_clone[0].alt, _tool_height, _tool_width);
          }

          $(".close-button").on("click", function () {
            $(this).closest(".draggable-container").remove();
            _update_workspace_data_in_database();
            _update_data_in_localstorage();
          });


        } else if (_workspace_section === "workspace_area" && _setting_panel_section === "workspace_area") {
          const _get_existing_container = ui.draggable.closest(".draggable-container");
          _draged_tool_element.append(ui.draggable);
          _draged_tool_element.css({
            zIndex: 9999,
          });
          var _tool_id = ui.draggable.data("id");
          var _random_string = _generate_random_string(8);

          ui.draggable.attr("id", "tool_img_" + _random_string);

          const _get_close_button = _get_existing_container.find(".close-button");
          _get_close_button.attr("id", "delete_" + _random_string);
          _get_close_button.attr("data-bs-toggle", "tooltip");
          _get_close_button.attr("data-bs-placement", "top");
          _get_close_button.attr("data-bs-trigger", "hover focus");
          _get_close_button.attr("title", "Click here to remove the tool.");

          _draged_tool_element.append(_get_close_button);

          _get_close_button.css({
            top: _top_position + "px",
            left: _left_position + 4 <= 40 ? _left_position + 50 + "px" : _left_position + 4 + "px",
            position: "absolute",
          });

          const colorPalette = _get_existing_container.find(".custom-color-picker");
          const color = colorPalette
            .find(".color-input")
            .css("background-color");
          colorPalette.remove();

          _generate_color_palette(_draged_tool_element, _palet_colors_list, _top_position, _left_position, _tool_id, _random_string);

          _get_close_button.on("click", function () {
            _draged_tool_element.remove();
            _update_data_in_localstorage();
            _update_workspace_data_in_database();
          });

          ui.draggable
            .siblings(".custom-color-picker")
            .find(".color-input")
            .css("background-color", color);

          ui.draggable.attr("class", "item draggable");
        }
        _drag_workspace_elements();
        _update_data_in_localstorage();
        _update_workspace_data_in_database();
      },
      start: function () {
        _board_title_color = $(
          "#workspace_area .color-box-customization .set_board_title"
        ).css("color");
      },
      stop: function () {
        $("#workspace_area .color-box-customization .set_board_title").css(
          "color",
          _board_title_color
        );
      },
    });
  }

  $("#settings_panel, #user_requested_tools").on("click", ".settings_panel_tools", function () {
    const _tool_clone = $(this).clone();
    var _workspace_left_position = _workspace_area.offset().left;
    var _workspace_top_position = _workspace_area.offset().top;
    var _random_string = _generate_random_string(8);
    var _tool_width = _tool_clone.data("width");
    var _tool_height = _tool_clone.data("height");
    var _tool_id = _tool_clone.data("id");
    var _tool_image = _tool_clone.data("image");

    const _draged_tool_element = $(
      '<div class="draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>'
    );
    const _append_close_button = $(
      '<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool." id="delete_' +
      _random_string +
      '">X</span>'
    );

    _workspace_area.append(_draged_tool_element);
    _draged_tool_element.append(_tool_clone);

    _tool_clone.data("height", _tool_height);
    _tool_clone.data("width", _tool_width);
    _tool_clone.data("id", _tool_id);
    _tool_clone.data("image", _tool_image);

    _tool_clone.css({
      top: 0 + "px",
      left: 0 + "px",
      position: "absolute",
      width: "auto",
      height: _tool_height + "px",
      "max-height": _tool_height + "px",
    });
    _tool_clone.attr("class", "item draggable");
    _tool_clone.attr("id", "tool_img_" + _random_string);
    _draged_tool_element.append(_append_close_button);

    _append_close_button.css({
      top: 0 + "px",
      left: _workspace_left_position + 4 <= 40 ? _workspace_left_position + 50 + "px" : _workspace_left_position + 4 + "px",
      position: "absolute",
    });

    _generate_color_palette(_draged_tool_element, _palet_colors_list, 0, _workspace_left_position, _tool_id, _random_string);
    _drag_workspace_elements();
    _update_data_in_localstorage();
  }
  );

  function _drag_workspace_elements() {
    $("#workspace_area .item").draggable({
      revert: "invalid",
      helper: "original",
      start: function (event, ui) {
        $(this).data("originalPosition", ui.helper.offset());
      },
      drag: function (event, ui) {
        _workspace_area.droppable("destroy");
        _allow_drop_in_workspace();
        if ($(this).hasClass("resizable")) {
          ui.position.top =
            ui.originalPosition.top +
            (ui.position.top - ui.originalPosition.top) /
            $(this)
              .data("ui-draggable")
              ._mouseDrag({ target: $(".ui-resizable-handle") }).ratio;
        }
      },
    });
    const _tool_container = $(".draggable-container");
    for (var i = 0; i < _tool_container.length; i++) {
      if (_tool_container.eq(i).children().length === 0) {
        _tool_container.eq(i).remove();
      }
    }
  }

  _variation_dropdown.change(function () {
    const _selected_color = $(this).val();
    getVariationImage(_selected_color);
    _update_workspace_data_in_database();
  });

  function _update_data_in_localstorage() {
    const _tools_in_workspace = [];

    $("#workspace_area .draggable").each(function () {
      var _tool_position = $(this).position();
      var _tool_id = $(this).attr("id");
      var _tool_data_image = $(this).data("image");
      var _tool_data_id = $(this).data("id");
      var _tool_data_height = $(this).data("height");
      var _tool_data_width = $(this).data("width");
      var _tool_data_h1 = $(this).data("h1");
      var _tool_data_w1 = $(this).data("w1");
      var _tool_alt = $(this).attr("alt");

      $(this).data("h1", _tool_data_h1);
      $(this).data("w1", _tool_data_w1);
      $(this).data("height", _tool_data_height);
      $(this).data("width", _tool_data_width);
      $(this).data("id", _tool_data_id);

      var _selected_color = $(this)
        .siblings(".custom-color-picker")
        .find(".color-input")
        .css("background-color");

      _tools_in_workspace.push({
        id: _tool_id,
        top: _tool_position.top,
        left: _tool_position.left,
        image: _tool_data_image,
        height: _tool_data_height,
        width: _tool_data_width,
        h1: _tool_data_h1,
        w1: _tool_data_w1,
        id: _tool_data_id,
        color: _selected_color,
        zIndex: 9999,
        alt: _tool_alt,
      });
    });

    var _logo_position = _workspace_logo_container.position();
    var _logo_size = _workspace_logo_container.width();
    var _logo_height = _workspace_logo_container.height();

    const _workspace_bg_image_in_local = localStorage.getItem("workspace_background_image");

    const _workspace_material_value = _workspace_material.val();
    const _workspace_title_bg = _workspace_tital_bg_color.val();
    const _workspace_title_header_color = _workspace_header_title_color.val();

    const _workspace_logo_image = localStorage.getItem("logo_url");
    const _workspace_logo = localStorage.getItem("logo_image");

    var _color_according_material = _get_workspace_material_background();



    if (_logo_position !== undefined) {
      var _workspace_logo_data = {
        top: _logo_position.top,
        left: _logo_position.left,
        width: _logo_size,
        height: _logo_height,
      };
    }


    _setting_penal_properties.workspace_title = _workspace_title.val();
    _setting_penal_properties.workspace_title_position = _workspace_title_position.val();
    _setting_penal_properties.workspace_dimensions = _workspace_dimentions.val();
    _setting_penal_properties.workspace_background_color = _workspace_background_color.val();
    _setting_penal_properties.workspace_style = _workspace_style.val();
    _setting_penal_properties.workspace_material = _workspace_material.val();
    _setting_penal_properties.workspace_logo = _workspace_logo_data;
    _setting_penal_properties.workspace_quantity = _workspace_quantity.val();
    _setting_penal_properties.workspace_background_image = _workspace_bg_image_in_local;


    if (_setting_penal_properties.workspace_dimensions != undefined) {
      const _splited_dimentions = _setting_penal_properties.workspace_dimensions.split("x");
      const _dimentions_width = _splited_dimentions[0];
      const _dimentions_height = _splited_dimentions[1];
      var _workspace = _adjust_workspace_area_size(_dimentions_width, _dimentions_height);
      _workspace_area.css("width", _workspace.width + "px");
      _workspace_area.css("height", _workspace.height + "px");
    }

    _set_workspace_title.text(_setting_penal_properties.workspace_title);
    // _workspace_area.css("background", _color_according_material);
    _set_title_bg_color.css("background-color", _workspace_title_bg);
    _set_workspace_title.css("color", _workspace_title_header_color);



    if (_workspace_logo_image) {
      _set_workspace_logo.attr("src", _workspace_logo_image);
      _set_workspace_logo.attr("data-logo", _workspace_logo);
      var __workspace_logo = _set_workspace_logo.data("logo");
      const _splited_link = __workspace_logo.split("/");
      const _logo_name = _splited_link[_splited_link.length - 1];
      _set_panel_logo_name.text(_logo_name);
      _workspace_logo_container.css({
        display: "block",
      });
    }

    // var board_material = $('#board_material').val();
    if (_workspace_bg_image_in_local && _workspace_material_value !== "ToughSteel") {
      _workspace_area.css("background", "url(" + _workspace_bg_image_in_local + ")");
      _workspace_area.css("background-size", "cover");
      _workspace_area.css("background-repeat", "no-repeat");
      const _splited_link = _workspace_bg_image_in_local.split("/");
      const _background_image_name = _splited_link[_splited_link.length - 1];
      _set_background_image_name.text(_background_image_name);
    } else {
      _workspace_area.css("background", _color_according_material);
    }

    _update_workspace_title_position();
    getCustomImages();

    const _selected_variation = _variation_dropdown.val();
    localStorage.setItem("workspace_selected_variation", _selected_variation);
    localStorage.setItem("workspace_information", JSON.stringify(_tools_in_workspace)
    );
    localStorage.setItem("setting_penal_information", JSON.stringify(_setting_penal_properties));
    localStorage.setItem("custom_logo", JSON.stringify(_workspace_logo_data));
    localStorage.setItem("title_bg_color", _workspace_title_bg);
    localStorage.setItem("title_header_color", _workspace_title_header_color);
  }

  setInterval(function () {
    if (window.location.search !== "?board=new") {
      _workspace_background_properties_chnage();
      _update_board_dimentions();
    }
    _cart_button_toggle();
  }, 500);

  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  var _staneless_steel_prompt = false;
  function _workspace_background_properties_chnage() {
    const title_bg_color = _workspace_tital_bg_color.val();
    _set_title_bg_color.css("background-color", title_bg_color);
    localStorage.setItem("title_bg_color", title_bg_color);

    const title_header_color = _workspace_header_title_color.val();
    _set_workspace_title.css("color", title_header_color);
    localStorage.setItem("title_header_color", title_header_color);

    const board_material = _workspace_material.val();

    if (board_material === "ToughSteel") {
      // get section 1 style attributes
      _workspace_area.css("background-color", "");
      _workspace_area.css("background", _tough_steel_color);
      // $('#workspace_area').css('background-color', ToughSteelColor);
      localStorage.setItem("background_color", _tough_steel_color);
      if (!_staneless_steel_prompt) {
        $("#stanelessSteelPrompt").modal("show");
      }
      $('#attributes option[value="solid"]').remove();
      // $('#attributes').val($('#attributes option:eq(1)').val());
      $(".custom-color-picker").addClass("hide-important");
    } else {
      var background_color = _get_workspace_material_background();
      const background_url = localStorage.getItem("workspace_background_image");
      if (board_material !== "ToughClear" && !background_url) {
        _workspace_area.css("background", background_color);
      } else if (background_url && background_url !== null) {
        _workspace_area.css("background", "url(" + background_url + ")");
        _workspace_area.css("background-size", "cover");
        _workspace_area.css("background-repeat", "no-repeat");
      } else if (!background_url && background_url === null) {
        _workspace_area.css("background", background_color);
      }
      localStorage.setItem("background_color", background_color);
      _staneless_steel_prompt = false;
      // add solid option if it doesn't exist
      if ($('#attributes option[value="solid"]').length === 0) {
        $("#attributes").append('<option value="solid">Solid</option>');
      }
      $(".custom-color-picker").removeClass("hide-important");
    }

    const board_title = _workspace_title.val();
    _set_workspace_title.text(board_title);

    if (canvas.getActiveObject()) {
      const text = canvas.getActiveObject().type === "textbox" ? true : false;
      const path = canvas.getActiveObject().type === "path" ? true : false;

      if (!text) {
        const stroke = $("#drawing_stroke").val();
        const fill = $("#drawing_fill").val();
        if (!path) {
          if (
            fill != "#000000" &&
            stroke != "black" &&
            canvas.getActiveObject().type === "rect"
          ) {
            canvas.getActiveObject().set("fill", fill);
            canvas.getActiveObject().set("stroke", stroke);
          } else if (
            fill != "#000000" &&
            stroke != "black" &&
            canvas.getActiveObject().type === "circle"
          ) {
            canvas.getActiveObject().set("fill", fill);
            canvas.getActiveObject().set("stroke", stroke);
          } else if (
            canvas.getActiveObject().fill !== "black" ||
            canvas.getActiveObject().stroke !== "black"
          ) {
            if (
              canvas.getActiveObject().fill !== fill ||
              canvas.getActiveObject().stroke !== stroke
            ) {
              $("#drawing_fill").val(canvas.getActiveObject().fill);
              $("#drawing_stroke").val(canvas.getActiveObject().stroke);
              canvas.on("selection:updated", function () {
                canvas.discardActiveObject();
              });
            }
          }
        } else {
          canvas.getActiveObject().set("fill", "transparent");
          canvas.getActiveObject().set("stroke", "black");
        }
        canvas.renderAll();
        $("#colorPickerToggle").css("border-color", stroke);
      } else if (text) {
        const stroke = $("#stroke_color_text").val();
        const fill = $("#fill_color_text").val();
        canvas.getActiveObject().set("stroke", stroke);
        canvas.getActiveObject().set("fill", fill);
        canvas.renderAll();

        localStorage.setItem("text_filler", fill);
        localStorage.setItem("text_stroke", stroke);
      }
    }
  }

  async function _fetch_workspace_info_from_database() {
    var url = window.location.href;
    var _workspace_id = window.location.search.split("=")[1];
    const _workspace_url = url.split("/").pop();
    const board = _workspace_url.split("=")[0];

    if (url.includes("configurator") && _workspace_url && board == "?board" && _previous_workspace) {
      const _object = {
        workspace_id: _workspace_id
      }
      const _validation = {
        workspace_id: { required: true, type: 'string' }
      }
      let velidated = _validate_object(_object, _validation);
      if (_object.workspace_id !== "new" && velidated) {
        const data = {
          action: "get_configurator_data",
          board_id: _object.workspace_id,
        };
        $.ajax({
          url: _admin_ajax,
          type: "POST",
          data: data,
          success: function (response) {
            const data = response[0];
            if (data != undefined && data != null && data.config_data != null) {
              const workspace_information = JSON.parse(
                data.config_data.replace(/\\/g, "")
              );
              const _selected_variation = data.options;

              _workspace_title.val(data.board_title);
              _set_workspace_title.text(data.board_title);
              _workspace_title_position.val(data.title_position);
              _workspace_background_color.val(data.background_color);
              _workspace_style.val(data.board_style);
              _workspace_material.val(data.board_material);
              _workspace_quantity.val(data.quantity_of_boards);

              if (
                data.canvasState !== undefined &&
                data.canvasState !== null &&
                data.canvasState !== ""
              ) {
                const canvasState = JSON.parse(
                  data.canvasState.replace(/\\/g, "")
                );
                canvas.loadFromJSON(canvasState, function () {
                  canvas.renderAll();
                });
              }

              const board_dimensions = data.board_dimensions.split("x");
              const board_width = board_dimensions[0];
              const board_height = board_dimensions[1];
              var dimensions = _adjust_workspace_area_size(board_width, board_height);

              _workspace_area.css("width", dimensions.width + "px");
              _workspace_area.css("height", dimensions.height + "px");
              for (const item of workspace_information) {
                if (item.image !== undefined) {
                  var randomId = _generate_random_string(8);
                  const newItem = $(
                    '<div class="item draggable draggable-container ui-draggable ui-draggable-handle" style="position: relative; z-index: 9999;"></div>'
                  );
                  const newImage = $(
                    '<img src="' +
                    item.image +
                    '" data-image="' +
                    item.image +
                    '" alt="' +
                    item.alt +
                    '" data-id="' +
                    item.id +
                    '" data-h1="' +
                    item.h1 +
                    '" data-w1="' +
                    item.w1 +
                    '" data-height="' +
                    item.height +
                    '" data-width="' +
                    item.width +
                    '" id="tool_img_' +
                    randomId +
                    '" class="item draggable" />'
                  );
                  const closeButton = $(
                    '<span class="close-button" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="hover focus" title="Click here to remove the tool.">X</span>'
                  );

                  newItem.append(newImage, closeButton);

                  newImage.css({
                    top: item.top + "px",
                    left: item.left + "px",
                    position: "absolute",
                    width: "auto",
                    height: item.height + "px",
                    "max-height": item.height + "px",
                  });

                  $(".canvas-container").css({
                    position: "absolute",
                    zIndex: 99,
                  });

                  closeButton.css({
                    top: item.top + "px",
                    left:
                      item.left + 4 <= 40
                        ? item.left + 50 + "px"
                        : item.left + 4 + "px",
                    position: "absolute",
                  });
                  _generate_color_palette(newItem, _palet_colors_list, item.top, item.left, item.id, randomId);

                  newItem
                    .find(".color-input")
                    .css("background-color", item.color);

                  _chnage_color_of_svg(item.image, item.color, randomId, item.alt, item.height, item.width);

                  _workspace_area.append(newItem);

                  closeButton.click(function () {
                    newItem.remove();
                  });
                }
              }

              $("#attributes").val(_selected_variation);

              if (_selected_variation) {
                getVariationImage(_selected_variation);
              }
              _get_workspace_material_background();

              const logo_url = data.logo_url;
              if (logo_url) {
                _set_workspace_logo.attr("src", logo_url);
                const parts = logo_url.split("/");
                const imageName = parts[parts.length - 1];
                _set_panel_logo_name.text(imageName);
                var custom_logo = JSON.parse(data.custom_logo.replace(/\\/g, ""));
                _workspace_logo_container.css({
                  display: "flex",
                  top: custom_logo.top + "px",
                  left: custom_logo.left + "px",
                  with: custom_logo.width + "px",
                });
                _set_workspace_logo.css({
                  width: custom_logo.width + "px",
                });
              }

              const background_url = data.background_url;
              if (background_url && data.board_material !== "ToughSteel") {
                _workspace_area.css("background", "url(" + background_url + ")");
                _workspace_area.css("background-size", "cover");
                _workspace_area.css("background-repeat", "no-repeat");
                const parts = background_url.split("/");
                const imageName = parts[parts.length - 1];
                _set_background_image_name.text(imageName);
              } else {
                _workspace_area.css("background", "none");
              }
              if (
                data.board_dimensions !== undefined &&
                data.board_dimensions !== null &&
                data.board_dimensions !== ""
              ) {
                const pbd = localStorage.getItem("previous_board_dimensions");
                _workspace_dimentions.val(pbd);
              } else {
                _workspace_dimentions.val(data.board_dimensions);
              }

              localStorage.setItem(
                "custom_board_dimensions",
                data.board_dimensions
              );

              const title_bg_color = data.title_bg_color;
              _workspace_tital_bg_color.val(title_bg_color);

              const title_header_color = data.title_header_color;
              _workspace_header_title_color.val(title_header_color);
              _update_data_in_localstorage();
              _drag_workspace_elements();
              _update_workspace_title_position();
              if (_previous_workspace) {
                _variation_dropdown.trigger("change");
              }
            }
          },
          error: function (error) {
            console.error("Error retrieving data:");
            _hide_loader();
          },
        });
      }
    }
  }

  function getVariationImage(color) {
    _settings_panel.empty();
    if (url.includes("configurator")) {
      for (const product of WP_PRODUCTS) {
        for (const variation of product.variations) {
          const imageSrc = variation.image;
          var width = variation.width;
          var height = variation.height;
          var dimensions = _adjust_size_of_tools(width, height);

          if (color === variation.attributes.attribute_pa_color) {
            _settings_panel.append(
              '<div class="flex-column" style="display: flex;" id="nameList_' +
              variation.id +
              '"><img src="' +
              imageSrc +
              '" alt="' +
              color +
              '" data-image="' +
              imageSrc +
              '" class="draggable settings_panel_tools" data-id="' +
              variation.id +
              '" data-width="' +
              dimensions.width +
              '" data-h1="' +
              height +
              '" data-w1="' +
              width +
              '" data-height="' +
              dimensions.height +
              '" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">' +
              variation.title +
              "</span></div>"
            );
          } else if (color === "null") {
            _settings_panel.append(
              '<div class="alert alert-danger no-custom-tools fs-6 h-auto d-flex justify-content-center rounded-0 mb-0">You haven\'t select tool type yet.</div>'
            );
            return;
          }
        }
      }
    }

    $(".draggable").draggable({
      revert: "invalid",
      helper: "clone",
      start: function (event, ui) {
        $(this).data("top", ui.position.top);
        $(this).data("left", ui.position.left);
      },
    });
  }

  function getCustomImages() {
    _user_requested_tools.empty();
    var anyConditionTrue = false;

    if (url.includes("configurator")) {
      for (const product of WP_PRODUCTS) {
        for (const variation of product.variations) {
          const imageSrc = variation.image;
          var width = variation.width;
          var height = variation.height;
          var dimensions = _adjust_size_of_tools(width, height);

          const current_user_id = amerisan_client.user_id;

          const type = variation.toolType
            .replace(/<p>/g, "")
            .replace(/<\/p>\n/g, "");

          if (
            variation.attributes.attribute_pa_color === "110" &&
            current_user_id === variation.user_id &&
            type
          ) {
            anyConditionTrue = true;
            _user_requested_tools.append(
              '<div class="flex-column" style="display: flex;" id="nameList_' +
              variation.id +
              '"><img src="' +
              imageSrc +
              '" alt="' +
              type +
              '" data-image="' +
              imageSrc +
              '" class="draggable settings_panel_tools outline-draggable" data-id="' +
              variation.id +
              '" data-width="' +
              dimensions.width +
              '" data-h1="' +
              height +
              '" data-w1="' +
              width +
              '" data-height="' +
              dimensions.height +
              '" style="height: 160px; width: auto;" /><span class="tool-name text-center" style="width: 150px">' +
              variation.title +
              "</span></div>"
            );
          }
        }
      }

      if (!anyConditionTrue) {
        _user_requested_tools.append(
          '<div class="alert alert-danger no-custom-tools fs-6 h-auto d-flex justify-content-center rounded-0 mb-0">You haven\'t requested a custom tool yet.</div>'
        );
      }
    }

    $(".outline-draggable").draggable({
      revert: "invalid",
      helper: "clone",
      start: function (event, ui) {
        $(this).data("top", ui.position.top);
        $(this).data("left", ui.position.left);
      },
    });
  }

  function _get_workspace_material_background() {
    const _board_material_val = _workspace_material.val();
    const _bg_color_val = _workspace_background_color.val();
    var _bg_image = localStorage.getItem("workspace_background_image");
    // console.log(board_material, bg_color, section_color, section_background_image);


    const _default = "rgb(255, 255, 255)";
    var _s1_bg_color;

    if (_board_material_val === "ToughSteel") {
      _s1_bg_color = _tough_steel_color;
      _workspace_area.css("border", "none");
      _workspace_area.css("background", _tough_steel_color);
    } else {
      if (
        _bg_color_val === "rgb(255, 255, 255)" || _bg_color_val === "#ffffff") {
        switch (_board_material_val) {
          case "ToughGuard":
          case "ToughGuard+":
          case "ToughLite":
          case "ToughLam":
            _s1_bg_color = _default;
            _workspace_area.css("border", "none");
            _workspace_area.css("background", _s1_bg_color);
            break;
          case "ToughClear":
            _s1_bg_color = "transparent";
            _workspace_area.css("background", "transparent");
            _workspace_area.css("border", "1px solid #000");
            break;
          default:
            _s1_bg_color = _bg_color_val;
            break;
        }

        if (_bg_image) {
          _workspace_area.css("background", "url(" + _bg_image + ")");
          _s1_bg_color = "url(" + _bg_image + ")";
        }
      } else {
        _s1_bg_color = _bg_color_val;
        _workspace_area.css("background", _s1_bg_color);
      }
    }
    return _s1_bg_color;
  }

  function _update_workspace_data_in_database() {
    const workspace_information = localStorage.getItem("workspace_information");
    const color = localStorage.getItem("workspace_selected_variation");
    _setting_penal_properties.workspace_title = _workspace_title.val();
    _setting_penal_properties.workspace_title_position = _workspace_title_position.val();
    _setting_penal_properties.workspace_title_bg_color = _workspace_tital_bg_color.val();
    _setting_penal_properties.workspace_title_header_color = _workspace_header_title_color.val();
    _setting_penal_properties.workspace_dimensions = _workspace_dimentions.val();
    _setting_penal_properties.workspace_background_color = _workspace_background_color.val();
    _setting_penal_properties.workspace_style = _workspace_style.val();
    _setting_penal_properties.workspace_material = _workspace_material.val();
    _setting_penal_properties.workspace_logo = localStorage.getItem("custom_logo");
    _setting_penal_properties.workspace_quantity = _workspace_quantity.val();
    const id = window.location.search.split("=")[1];
    const data = {
      action: "update_configurator_data",
      workspace_information: workspace_information,
      color: color,
      data: _setting_penal_properties,
      canvasState: localStorage.getItem("workspace_canvas_information"),
      id: id,
    };
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: data,
      success: function (response) {
        if (window.location.search === "?board=new") {
          window.history.replaceState({}, "", "?board=" + response);
        }
        $("#dot_alert").css("display", "block");
        setTimeout(function () {
          $("#dot_alert").css("display", "none");
        }, 1000);
      },
      error: function (error) {
        $("#dot_alert").css("display", "block");
        $("#dot_alert").css("background-color", "red");
        setTimeout(function () {
          $("#dot_alert").css("display", "none");
        }, 1000);
      },
    });
  }

  $("#logo_images").on("change", function () {
    var fileInput = this;
    var file = fileInput.files[0];
    _show_loader();

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var formData = new FormData();
        formData.append("action", "handle_logo_upload");
        formData.append("logo_images", file);
        formData.append("board_id", window.location.search.split("=")[1]);

        $.ajax({
          type: "POST",
          url: _admin_ajax,
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            localStorage.setItem("logo_url", response.url);
            localStorage.setItem("logo_image", response.url);
            _set_workspace_logo.attr("src", response.url);
            const parts = response.url.split("/");
            const imageName = parts[parts.length - 1];
            _set_panel_logo_name.text(imageName);
            _workspace_logo_container.css({
              display: "flex",
            });
            _workspace_logo_container.draggable({
              drag: function (event, ui) {
                if ($(this).hasClass("resizable")) {
                  ui.position.top =
                    ui.originalPosition.top +
                    (ui.position.top - ui.originalPosition.top) /
                    $(this)
                      .data("ui-draggable")
                      ._mouseDrag({ target: $(".ui-resizable-handle") })
                      .ratio;
                }
              },
            });
            _workspace_logo_container.resizable({
              containment: "#workspace_area",
            });
            _hide_loader();
          },
          error: function (error) {
            console.error(error);
            _hide_loader();
          },
        });
      };

      reader.readAsBinaryString(file);
    } else {
      _hide_loader();
    }
  });

  $("#background_image_upload").on("change", function () {
    var fileInput = this;
    var file = fileInput.files[0];
    _show_loader();

    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var formData = new FormData();
        formData.append("action", "handle_background_upload");
        formData.append("background_image_upload", file);
        formData.append("board_id", window.location.search.split("=")[1]);

        $.ajax({
          type: "POST",
          url: _admin_ajax,
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
            const board_material = _workspace_material.val();
            if (board_material !== "ToughSteel" && response.url) {
              localStorage.setItem("workspace_background_image", response.url);
              _workspace_area.css("background", "url(" + response.url + ")");
              const parts = response.url.split("/");
              const imageName = parts[parts.length - 1];
              _set_background_image_name.text(imageName);
            }
            _hide_loader();
          },
          error: function (error) {
            console.error(error);
            _hide_loader();
          },
        });
      };

      reader.readAsBinaryString(file);
    } else {
      _hide_loader();
    }
  });

  $(".show_ToughSteel_model").on("click", function () {
    const board_material = _workspace_material.val();
    if (board_material === "ToughSteel") {
      $("#backgroundImageModel").modal("show");
    }
  });
  $('[data-toggle="tooltip"]').tooltip();

  const collapseOne = $("#collapseOne");
  if (collapseOne.length) {
    var accordion = new bootstrap.Collapse(collapseOne, { toggle: false });
  }

  $("#collapseTwo").on("hidden.bs.collapse", function () {
    if (!accordion._isTransitioning) {
      accordion.show();
    }
  });

  $(window).on("beforeunload", function () {
    _update_data_in_localstorage();
  });

  $(
    "#board_title, #title_bg_color, #title_header_color, #background_color, #board_style, #board_material, #quantity_of_boards"
  ).on("change", function () {
    _update_workspace_data_in_database();
    _update_data_in_localstorage();
    _update_workspace_title_position();
  });

  _workspace_title_position.on("change", function () {
    _update_workspace_title_position();
  });

  $("#board_dimensions, #custom_height").on("change", function () {
    _update_board_dimentions();
    _update_workspace_data_in_database();
    _update_data_in_localstorage();
  });

  function _update_board_dimentions() {
    var s2_data = $("#settings_panel img");
    var custom_data = $("#user_requested_tools img");
    var s1_data = $("#workspace_area .draggable-container img");

    for (var i = 0; i < s2_data.length; i++) {
      var height = s2_data[i].dataset.h1;
      var width = s2_data[i].dataset.w1;
      var custom = _adjust_size_of_tools(width, height);
      var id = s2_data[i].dataset.id;
      for (var j = 0; j < s1_data.length; j++) {
        if (id === s1_data[j].dataset.id) {
          s1_data.eq(j).css("height", "" + custom.height + "px");
        }
      }
    }

    for (var i = 0; i < custom_data.length; i++) {
      var height = custom_data[i].dataset.h1;
      var width = custom_data[i].dataset.w1;
      var custom = _adjust_size_of_tools(width, height);
      var id = custom_data[i].dataset.id;
      for (var j = 0; j < s1_data.length; j++) {
        if (id === s1_data[j].dataset.id) {
          s1_data.eq(j).css("height", "" + custom.height + "px");
        }
      }
    }
  }

  function _update_workspace_title_position() {
    const dimentions = _workspace_dimentions.val();
    if (dimentions != undefined) {
      var color = localStorage.getItem("title_header_color");

      var logoPosition = _workspace_title_position.val();
      if (logoPosition === "right") {
        _set_workspace_title.removeAttr("style");
        _set_workspace_title.css("position", "absolute");
        _set_workspace_title.css("width", "100%");
        _set_workspace_title.css("text-align", "right");
        _set_workspace_title.css("top", "50%");
        _set_workspace_title.css("transform", "translate(0%, -50%)");
      } else if (logoPosition === "left") {
        _set_workspace_title.removeAttr("style");
        _set_workspace_title.css("position", "absolute");
        _set_workspace_title.css("width", "100%");
        _set_workspace_title.css("text-align", "left");
        _set_workspace_title.css("top", "50%");
        _set_workspace_title.css("transform", "translate(0%, -50%)");
      } else if (logoPosition === "center") {
        _set_workspace_title.removeAttr("style");
        _set_workspace_title.css("position", "absolute");
        _set_workspace_title.css("width", "100%");
        _set_workspace_title.css("text-align", "center");
        _set_workspace_title.css("top", "50%");
        _set_workspace_title.css("transform", "translate(0%, -50%)");
      }
      _set_workspace_title.css("color", color);
    }
  }

  $("#clear-background-image").on("click", function () {
    const image_url = localStorage.getItem("workspace_background_image");
    localStorage.removeItem("workspace_background_image");
    _workspace_area.css("background", "none");
    $("#background_image_upload").val("");
    _set_background_image_name.text("");
    _delete_images_from_wp_media("background_url", image_url);
  });
  $("#clear_logo_image").on("click", function () {
    const logo = localStorage.getItem("logo_image");
    localStorage.removeItem("logo_url");
    _set_workspace_logo.attr("src", "");
    $("#logo_images").val("");
    _set_panel_logo_name.text("");
    _workspace_logo_container.css("display", "none");
    _delete_images_from_wp_media("logo_url", logo);
    localStorage.removeItem("custom_logo");
    _set_workspace_logo.removeAttr("style");
    _update_data_in_localstorage();
    _update_workspace_data_in_database();
  });

  $("#reset_board").on("click", function () {
    $("#confirmationModal").modal("show");
  });

  $("#confirmReset").on("click", function () {
    $("#confirmationModal").modal("hide");
    _workspace_area.empty();
    const workspace_areaData = `<div class="w-100" style="height: 50px" id="title_background_color"><div class="h5 pt-3 set_board_title" id="set_board_title"></div></div><img src="" alt="" class="workspace_area_logo position-absolute" id="workspace_area_logo">`;
    _workspace_area.append(workspace_areaData);
    _reset_localstorage_info();
    _reset_workspace_information();
  });

  $(".closeModel").on("click", function () {
    $("#confirmationModal").modal("hide");
    $("#confirmDeleteModal").modal("hide");
    $("#backgroundImageModel").modal("hide");
    $("#stanelessSteelPrompt").modal("hide");
    _staneless_steel_prompt = true;
  });

  $(".boardWithToolClose").on("click", function () {
    $("#boardWithTool").modal("hide");
  });

  $(".closeModel1").on("click", function () {
    $("#dimentionConfirmationModal").modal("hide");
    $("#custom_board_dimensions").css("display", "none");

    var board_dimensions_values = _workspace_dimentions.val();
    if (board_dimensions_values === "custom") {
      _workspace_dimentions.val("120x120");
      _update_data_in_localstorage();
    }
  });

  function _reset_localstorage_info() {
    _workspace_title.val("");
    _set_workspace_title.text("");
    _workspace_tital_bg_color.val("#f5f5f5");
    _workspace_header_title_color.val("#000000");
    _workspace_title_position.val("center");
    _set_workspace_title.removeAttr("style");
    _workspace_dimentions.val("12x12");
    _workspace_background_color.val("#ffffff");
    _workspace_style.val("Wall Mount");
    _workspace_material.val("ToughLite");
    $("#custom_logo").val({ top: 0, left: 0, width: 0, height: 0 });
    _workspace_quantity.val(0);
    _workspace_area.css("background", "none");
    _set_workspace_logo.attr("src", "");
    _workspace_area.css("background-color", "#ffffff");
    $("#attributes").val("null");
    canvas.clear();

    localStorage.removeItem("workspace_information");
    localStorage.removeItem("workspace_selected_variation");
    localStorage.removeItem("workspace_background_image");
    localStorage.removeItem("logo_url");
    localStorage.removeItem("setting_penal_information");
    localStorage.removeItem("custom_board_dimensions");
    localStorage.removeItem("title_bg_color");
    localStorage.removeItem("title_header_color");
    localStorage.removeItem("custom_logo");
    localStorage.removeItem("workspace_canvas_information");
    localStorage.removeItem("shape_filler");
    localStorage.removeItem("shape_stroke");
    localStorage.removeItem("text_filler");
    localStorage.removeItem("text_stroke");
    _update_data_in_localstorage();
  }

  function _reset_workspace_information() {
    const board_id = window.location.search.split("=")[1];
    // console.log(board_id);
    const data = {
      action: "reset_board",
      board_id: board_id,
    };
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: data,
      success: function (response) {
        _workspace_title_position.val("center");
        _update_workspace_data_in_database();
        if (_previous_workspace) {
          location.reload();
        }
      },
      error: function (error) {
        console.error("Error retrieving data:");
      },
    });
  }

  function _delete_images_from_wp_media(value, imageUrl) {
    const board_id = window.location.search.split("=")[1];
    const data = {
      action: "clearLinksFromDb",
      value: value,
      board_id: board_id,
      image_url: imageUrl,
    };
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: data,
      success: function (response) { },
      error: function (error) {
        console.error("Error retrieving data:");
      },
    });
  }

  $("#board_dimensions, #custom_width, #custom_height").on(
    "change",
    function () {
      const board_dimensions = _workspace_dimentions.val();
      if (board_dimensions != "custom") {
        localStorage.setItem("previous_board_dimensions", board_dimensions);
      }

      const board_width = $("#custom_width").val();
      const board_height = $("#custom_height").val();

      var previous_board_dimensions = localStorage.getItem(
        "previous_board_dimensions"
      );

      if (board_width > 120 || board_height > 120) {
        _workspace_dimentions.val(previous_board_dimensions);
        $("#dimentionConfirmationModal").modal("show");
        $("#custom_width").val("");
        $("#custom_height").val("");
      } else if (board_dimensions === "custom") {
        $("#custom_board_dimensions").css("display", "flex");
      } else {
        $("#custom_board_dimensions").css("display", "none");
      }
    }
  );

  $("#dimentionConfirm").on("click", function () {
    $("#dimentionConfirmationModal").modal("hide");
  });

  $(".close-button").click(function () {
    console.log("clicked");
    $(this).parent().remove();
    _update_workspace_data_in_database();
  });

  $(".custom_values").on("change", function () {
    _set_custom_workspace_dimentions();
    _update_data_in_localstorage();
  });

  function _is_valid_dimention(dimension) {
    return dimension && dimension <= 120;
  }

  function _set_custom_workspace_dimentions() {
    const board_width = $("#custom_width").val();
    const board_height = $("#custom_height").val();
    var previous_board_dimensions = localStorage.getItem(
      "previous_board_dimensions"
    );
    if (_is_valid_dimention(board_width) && _is_valid_dimention(board_height)) {
      var dimensions = _adjust_workspace_area_size(board_width, board_height);
      _workspace_area.css("width", dimensions.width + "px");
      _workspace_area.css("height", dimensions.height + "px");
      canvas.setWidth(dimensions.width);
      canvas.setHeight(dimensions.height);
      _workspace_dimentions.append(
        '<option value="' +
        board_width +
        "x" +
        board_height +
        '">' +
        board_width +
        "x" +
        board_height +
        "</option>"
      );
      _workspace_dimentions.val(board_width + "x" + board_height);
      localStorage.setItem(
        "custom_board_dimensions",
        board_width + "x" + board_height
      );
      localStorage.setItem(
        "previous_board_dimensions",
        board_width + "x" + board_height
      );
      // updateDatabase();
    } else if (board_width > 120) {
      $("#custom_width").val(120);
      _workspace_dimentions.val(previous_board_dimensions);
      $("#dimentionConfirmationModal").modal("show");
      $("#custom_board_dimensions").css("display", "flex");
    } else if (board_height > 120) {
      $("#custom_height").val(120);
      _workspace_dimentions.val(previous_board_dimensions);
      $("#dimentionConfirmationModal").modal("show");
      $("#custom_board_dimensions").css("display", "flex");
    }
  }

  function _show_loader() {
    const preloader = $("#preloader");
    preloader.append('<div class="spinner"></div>');
    preloader.css("display", "flex");
  }

  function _hide_loader() {
    const preloader = $("#preloader");
    preloader.empty();
    preloader.css("display", "none");
  }

  $(".delete-board").on("click", function () {
    var deleteBoard = $(this)[0];
    var id = deleteBoard.dataset.boardId;
    var title = deleteBoard.dataset.boardTitle;
    $("#confirmDeleteModal").modal("show");
    $("#delete_board").text(title);
    $("#confirmDeleteModal").find("#delete_board_id").val(id);
  });

  $("#confirmDeleteBtn").on("click", function () {
    var id = $("#confirmDeleteModal").find("#delete_board_id").val();
    var data = {
      action: "deleteBoard",
      board_id: id,
    };
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: data,
      success: function (response) {
        window.location.reload();
      },
      error: function (error) {
        console.error("Error deleting board");
      },
    });
  });

  function _create_new_workspace() {
    _workspace_area.removeAttr("style");
    _workspace_title_position.val("left");
    _workspace_dimentions.val("12x12");
    _workspace_background_color.val("#ffffff");
    _workspace_style.val("Wall Mount");
    _workspace_material.val("ToughGuard");
    $("#custom_logo").val({ top: 0, left: 0, width: 0, height: 0 });
    _workspace_quantity.val(0);
    _workspace_area.css("background-color", "#ffffff");
    $("#attributes").val("null");
    const dimensions = _adjust_workspace_area_size(12, 12);
    _workspace_area.css("width", dimensions.width + "px");
    _workspace_area.css("height", dimensions.height + "px");
  }

  $("#board_style_config").on("click", function () {
    var board_style = _workspace_style.val();
    var image = $("#image1");
    var viewerOptions = {
      toolbar: false,
      navbar: false,
      movable: false,
      hidden: function () {
        viewer.destroy();
      },
    };

    if (board_style === "Wall Mount") {
      image.attr(
        "src",
        "https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png"
      );
      image[0].dataset.original =
        "https://5sshadowboard.com/wp-content/uploads/2024/02/wall-mount-1.png";
    } else if (board_style === "Mobile") {
      image.attr(
        "src",
        "https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png"
      );
      image[0].dataset.original =
        "https://5sshadowboard.com/wp-content/uploads/2024/02/mobile-2.png";
    } else {
      image.attr(
        "src",
        "https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png"
      );
      image[0].dataset.original =
        "https://5sshadowboard.com/wp-content/uploads/2024/02/magnet.png";
    }
    var viewer = new Viewer(document.getElementById("image1"), viewerOptions);
    viewer.show();
  });

  const Image = `<img src="" data-original="" alt="Board Style Wall Mount" id="image1" class="img-fluid d-none" />`;
  $("body").append(Image);

  function _chnage_color_of_svg(svgImageUrl, color, selectedId, alt, newHeight, newWidth) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", svgImageUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser = new DOMParser();
        var svgDoc = parser.parseFromString(xhr.responseText, "image/svg+xml");

        svgDoc = svgDoc.documentElement;

        svgDoc.setAttribute("height", newHeight);
        svgDoc.setAttribute("width", newWidth);

        var paths = svgDoc.querySelectorAll("path");
        paths.forEach(function (path) {
          if (alt === "solid") {
            if (color === "rgba(0, 0, 0, 0)") {
              path.style.fill = "#000000";
            } else {
              path.style.fill = color;
            }
          } else if (alt === "outline") {
            if (color === "rgba(0, 0, 0, 0)") {
              if (path.classList.contains("cls-2")) {
                path.style.fill = "#000000";
              } else if (
                path.classList.contains("cls-3") ||
                path.classList.contains("cls-1")
              ) {
                path.style.fill = "transparent";
              } else {
                path.style.fill = "#000000";
              }
            } else {
              if (path.classList.contains("cls-2")) {
                path.style.fill = color;
              } else if (
                path.classList.contains("cls-3") ||
                path.classList.contains("cls-1")
              ) {
                path.style.fill = "transparent";
              } else {
                path.style.fill = color;
              }
            }
          } else {
            path.style.fill = "#000000";
          }
        });

        var svgString = new XMLSerializer().serializeToString(svgDoc);
        var blob = new Blob([svgString], { type: "image/svg+xml" });
        var url = URL.createObjectURL(blob);

        var imgElement = $("#tool_img_" + selectedId)[0];
        imgElement.src = url;
        imgElement.dataset.color = color;
        _update_data_in_localstorage();
        _update_workspace_data_in_database();
      }
    };
    if (xhr.status !== 404) {
      xhr.send();
    }
  }

  $("#searchInput").on("input", function () {
    $(".loader").show();
    const searchTerm = $(this).val().toLowerCase().trim();
    $("#settings_panel .flex-column").each(function () {
      const productName = $(this).find("span").text().toLowerCase().trim();
      const id = $(this).find("img").data("id");
      if (productName.includes(searchTerm)) {
        $("#nameList_" + id).show();
      } else {
        $("#nameList_" + id).hide();
      }
    });
    $(".loader").hide();
  });

  var canvas;
  var state;
  var undo = [];
  var redo = [];

  canvas = new fabric.Canvas("canvas");
  var drawingMode = "pencil";
  var isTextAdded = false;
  var isRectAdded = false;
  var isCircleAdded = false;
  $(".canvas-container").css({
    zIndex: 999,
    position: "absolute",
  });

  function _set_drawing_mode(mode) {
    drawingMode = mode;
    if (mode === "pencil") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = "black";
    } else {
      canvas.isDrawingMode = false;
    }
    canvas.renderAll();
    _save_current_canvas_info();
  }
  var rectCount = 0;
  function _add_rectangle() {
    if (!isRectAdded) {
      isRectAdded = true;
      canvas.selection = true;
      canvas.rectCount = rectCount;
      canvas.isDrawingMode = false;
      canvas.add(
        new fabric.Rect({
          rectCount: rectCount,
          left: 100,
          top: 100,
          width: 100,
          height: 50,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          selectable: true,
          evented: true,
        })
      );
      rectCount++;
      canvas.renderAll();
      _save_current_canvas_info();
    }
  }
  var circleCount = 0;
  function _add_circle() {
    if (!isCircleAdded) {
      isCircleAdded = true;
      canvas.selection = true;
      canvas.circleCount = circleCount;
      canvas.isDrawingMode = false;
      canvas.add(
        new fabric.Circle({
          circleCount: circleCount,
          left: 100,
          top: 100,
          radius: 50,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
          selectable: true,
          evented: true,
        })
      );
      circleCount++;
      canvas.renderAll();
      _save_current_canvas_info();
    }
  }

  function _add_text() {
    if (!isTextAdded) {
      isTextAdded = true;
      canvas.selection = true;
      canvas.isDrawingMode = false;
      var text = new fabric.Textbox("Type here", {
        left: 100,
        top: 200,
        width: 150,
        fontSize: 12,
        fontFamily: "Arial",
        fill: "black",
        editable: true,
        selectable: true,
        evented: true,
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      text.enterEditing();
      text.hiddenTextarea.focus();
      canvas.renderAll();
      _save_current_canvas_info();
    }
  }

  function _save_current_canvas_info() {
    redo = [];
    $("#drawing_redo").prop("disabled", true);
    if (state) {
      undo.push(state);
      $("#drawing_undo").prop("disabled", false);
    }
    state = JSON.stringify(canvas.toJSON());
    localStorage.setItem("workspace_canvas_information", state);
    _update_data_in_localstorage();
    _update_workspace_data_in_database();
  }

  function replay(playStack, saveStack, onButton, offButton) {
    saveStack.push(state);
    state = playStack.pop();
    var on = $(onButton);
    var off = $(offButton);
    on.prop("disabled", true);
    off.prop("disabled", true);
    canvas.clear();
    canvas.loadFromJSON(state, function () {
      canvas.renderAll();
      on.prop("disabled", false);
      if (playStack.length) {
        off.prop("disabled", false);
      }
    });
  }

  canvas.on("object:modified", function () {
    _save_current_canvas_info();
  });

  function _hide_line_stroke_option() {
    $("#line_stroke").css("display", "none");
    $("#line_dropdown span").css("height", "2px", "px", "width", "15px");
  }

  $("#drawing_undo").click(function () {
    _hide_line_stroke_option();

    replay(undo, redo, "#drawing_redo", this);
  });

  $("#drawing_redo").click(function () {
    _hide_line_stroke_option();

    replay(redo, undo, "#drawing_undo", this);
  });

  $("#drawing_select").on("click", function () {
    canvas.selection = true;
    canvas.isDrawingMode = false;
    isRectAdded = false;
    isCircleAdded = false;
    isTextAdded = false;

    _save_current_canvas_info();
  });

  $("#drawing_pencil").click(function () {
    drawingMode = "pencil";
    $("#line_stroke").css("display", "block");
    _set_drawing_mode(drawingMode);
  });

  $("#drawing_rectangle").click(function () {
    _hide_line_stroke_option();
    _add_rectangle();
  });

  $("#drawing_circle").click(function () {
    _hide_line_stroke_option();
    _add_circle();
  });

  $("#drawing_text").click(function () {
    _hide_line_stroke_option();
    _add_text();
  });

  $("#drawing_eraser").click(function () {
    _hide_line_stroke_option();
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
    _save_current_canvas_info();
  });

  $("#drawing_clear").click(function () {
    _hide_line_stroke_option();
    canvas.clear();
    _save_current_canvas_info();
  });

  canvas.on("mouse:down", function (options) {
    if (drawingMode === "pencil") {
      canvas.selection = false;
    } else {
      canvas.selection = true;
    }
  });

  canvas.on("selection:cleared", function (options) {
    isTextAdded = false;
    isRectAdded = false;
    $("#drawing_fill").val("transparent");
    $("#drawing_stroke").val("black");
  });

  canvas.on("selection:changed", function () {
    // unselect all objects
    canvas.discardActiveObject();
  });

  $(".shape-items").click(function () {
    var shape = $(this)[0].dataset.shape;
    $("#shape_dropdown").html(
      '<i class="text-black fa fa-' + shape + '"></i> '
    );
  });

  $(".drawing_line").on("click", function () {
    var height = $(this)[0].dataset.width;
    canvas.freeDrawingBrush.width = height;
    $("#line_dropdown span").css("height", height, "px", "width", "15px");
  });

  $("#text_size").on("change", function () {
    _hide_line_stroke_option();
    var size = $(this).val();
    if (canvas.getActiveObject()) {
      canvas.getActiveObject().set("fontSize", size);
      canvas.renderAll();
      _save_current_canvas_info();
    }
  });

  canvas.on("path:created", function () {
    _save_current_canvas_info();
  });

  $("#drawing_fill").on("change", function () {
    _hide_line_stroke_option();

    var color = $(this).val();
    if (canvas.getActiveObject()) {
      const text = canvas.getActiveObject().type === "textbox" ? true : false;
      const path = canvas.getActiveObject().type === "path" ? true : false;
      // console.log(text, path, 'text, path');

      if (!text) {
        if (path) {
          canvas.getActiveObject().set("fill", "transparent");
        } else {
          canvas.getActiveObject().set("fill", color);
          canvas.renderAll();
        }
        _save_current_canvas_info();
      }
    }
  });

  $("#drawing_stroke").on("change", function () {
    _hide_line_stroke_option();

    var color = $(this).val();
    if (canvas.getActiveObject()) {
      const text = canvas.getActiveObject().type === "textbox" ? true : false;
      const path = canvas.getActiveObject().type === "path" ? true : false;
      if (!text) {
        if (path) {
          canvas.getActiveObject().set("stroke", "black");
        } else {
          canvas.getActiveObject().set("stroke", color);
        }
        canvas.renderAll();
        _save_current_canvas_info();
      }
    }
  });

  $("#colorPickerToggle").on("click", function () {
    _hide_line_stroke_option();
    $("#drawing_stroke").click();
  });

  $("#fill_color_text").on("change", function () {
    _hide_line_stroke_option();

    var color = $(this).val();
    if (canvas.getActiveObject()) {
      const text =
        canvas.getActiveObject() === null
          ? false
          : canvas.getActiveObject().type === "textbox"
            ? true
            : false;
      if (text) {
        canvas.getActiveObject().set("fill", color);
        canvas.renderAll();
        _save_current_canvas_info();
      }
    }
  });

  $("#stroke_color_text").on("change", function () {
    _hide_line_stroke_option();

    var color = $(this).val();
    if (canvas.getActiveObject()) {
      const text =
        canvas.getActiveObject() === null
          ? false
          : canvas.getActiveObject().type === "textbox"
            ? true
            : false;
      if (text) {
        canvas.getActiveObject().set("stroke", color);
        canvas.getActiveObject().set("strokeWidth", 0.5);
        canvas.renderAll();
        _save_current_canvas_info();
      }
    }
  });

  $("#stroke_color_toggle").on("click", function (e) {
    e.preventDefault();
    _hide_line_stroke_option();
    $("#stroke_color_text").trigger("click");
  });

  $("#stroke_color_text").on("change", function () {
    $("#stroke_color_toggle").css("border-color", $(this).val());
  });

  $("#drawing_stroke").on("change", function () {
    $("#colorPickerToggle").css("border-color", $(this).val());
  });

  canvas.on("selection:created", function () {
    $("#drawing_eraser").css("display", "block");
  });

  canvas.on("selection:cleared", function () {
    $("#drawing_eraser").css("display", "none");
  });

  $("#text_font").on("change", function () {
    _hide_line_stroke_option();

    var font = $(this).val();
    canvas.getActiveObject().set("fontFamily", font);
    canvas.renderAll();
  });

  setTimeout(function () {
    _update_board_dimentions();
  }, 500);

  _workspace_logo_container.draggable({
    scroll: false,
    drag: function (event, ui) {
      if ($(this).hasClass("resizable")) {
        ui.position.top =
          ui.originalPosition.top +
          (ui.position.top - ui.originalPosition.top) /
          $(this)
            .data("ui-draggable")
            ._mouseDrag({ target: $(".ui-resizable-handle") }).ratio;
      }
      _update_workspace_data_in_database();
      _update_data_in_localstorage();
    },
  });

  _workspace_logo_container.resizable({
    containment: "#workspace_area",
    aspectRatio: true,
    handles: "ne, se, sw, nw",
    resize: function (event, ui) {
      var originalWidth = _set_workspace_logo.prop("naturalWidth");
      var originalHeight = _set_workspace_logo.prop("naturalHeight");
      var newWidth = ui.size.width;
      var newHeight = (originalHeight / originalWidth) * newWidth;
      _set_workspace_logo.css("width", newWidth);
      _set_workspace_logo.css("height", newHeight);
    },
    stop: function (event, ui) {
      _update_workspace_data_in_database();
      _update_data_in_localstorage();
    },
  });

  stripe = Stripe(amerisan_client.stripe);
  var _stripe_elements = stripe.elements();
  var _stripe_card_info = _stripe_elements.create("card");

  $("#request_custom_tool").on("click", function () {
    _stripe_card_info.mount("#card-element");
    $("#request_a_custom_tool").modal("show");
  });

  $(".request_custom_close").on("click", function () {
    $("#request_a_custom_tool").modal("hide");
  });

  $(".measuring_close").on("click", function () {
    _stripe_card_info.unmount();
    $("#measuring_a_custom_tool").modal("hide");
  });

  $("#request_measuring_form").on("click", function () {
    _stripe_card_info.unmount();
    _stripe_card_info.mount("#card-element-measuring");
    $("#measuring_a_custom_tool").modal("show");
    $("#request_a_custom_tool").modal("hide");
  });

  $("#larger_price").append(amerisan_client.large_measuring);
  $("#custom_price").append(amerisan_client.custom_price);

  /*
   * Handle custom tool submission
   */
  $("#submit_custom_tool").on("click", function () {
    var file = $("#custom_tool_image").prop("files")[0];
    var board_id = window.location.search.split("=")[1];

    if (file && board_id) {
      var cardElement = _stripe_elements.getElement("card");
      stripe.createToken(cardElement).then(function (result) {
        if (result.error) {
          var errorElement = document.getElementById("card-errors");
          errorElement.textContent = result.error.message;
          toastr.error(result.error.message);
        } else {
          var token = result.token;
          _initiate_stripe_payment(file, board_id, token);
        }
      });
    } else {
      toastr.error("Please upload a file.");
    }
  });

  /*
   * Initiate payment for custom tool request
   */
  function _initiate_stripe_payment(file, board_id, token) {
    _show_loader();

    var amount = amerisan_client.custom_price * 100 ?? 0;
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: {
        action: "initiate_stripe_payment",
        token: token,
        amount: amount,
      },
      success: function (response) {
        toastr.success("Payment processed successfully");
        _submit_stripe_form(file, board_id);
      },
      error: function (error) {
        console.error("Error processing payment:", error);
        _hide_loader();
      },
    });
  }

  /*
   * Submit custom tool request
   */
  function _submit_stripe_form(file, board_id) {
    if (file) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var formData = new FormData();
        formData.append("action", "process_custom_tool_request");
        formData.append("board_id", board_id);
        formData.append("file", file);

        $.ajax({
          url: _admin_ajax,
          type: "POST",
          data: formData,
          contentType: false,
          processData: false,
          success: function (response) {
            $("#custom_tool_image").val("");
            $("#request_a_custom_tool").modal("hide");
            _hide_loader();
            toastr.success("Custom tool request sent successfully");
          },
          error: function (error) {
            console.error("Error sending custom tool request");
          },
        });
      };
      reader.readAsDataURL(file);
    } else {
      toastr.error("File not found");
    }
  }

  /*
   * Handle larger measuring sheet submission
   */
  $("#submit_measuring_tool").on("click", function () {
    _show_loader();
    const name = $("#measuring_tool_name").val();
    const address = $("#measuring_postal_address").val();
    const quantity = $("#measuring_tool_quantity").val();
    const comments = $("#measuring_tool_features").val();
    const totalCost = $("#measuring_tool_company").val();
    var board_id = window.location.search.split("=")[1];

    // name, address, quantity, comments, totalCost validation
    if (
      name === "" ||
      address === "" ||
      quantity === "" ||
      comments === "" ||
      totalCost === ""
    ) {
      _hide_loader();
      toastr.error("Please fill all the fields");
      return;
    }

    var cardElement = _stripe_elements.getElement("card");
    stripe.createToken(cardElement).then(function (result) {
      if (result.error) {
        _hide_loader();
        toastr.error(result.error.message);
      } else {
        var token = result.token;
        _initiate_measuring_payment(
          board_id,
          token,
          name,
          address,
          quantity,
          comments,
          totalCost
        );
      }
    });
  });

  /*
   * Initiate payment for measuring sheet request
   */
  function _initiate_measuring_payment(
    board_id,
    token,
    name,
    address,
    quantity,
    comments,
    totalCost
  ) {
    var amount = amerisan_client.large_measuring * 100 ?? 0;

    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: {
        action: "initiate_stripe_payment",
        token: token,
        amount: amount,
      },
      success: function (response) {
        toastr.success("Payment processed successfully");
        _submit_measuring_info(
          board_id,
          name,
          address,
          quantity,
          comments,
          totalCost,
          response.data
        );
      },
      error: function (error) {
        console.error("Error processing payment:", error);
      },
    });
  }

  /*
   * Submit measuring sheet request
   * ALTER TABLE `wp_mak2m40npq_measure_request` ADD COLUMN `payment_intent` varchar(255) NULL;
   */
  function _submit_measuring_info(
    board_id,
    name,
    address,
    quantity,
    comments,
    totalCost,
    payment_intent
  ) {
    var formData = new FormData();
    formData.append("action", "process_measuring_tool_request");
    formData.append("board_id", board_id);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("quantity", quantity);
    formData.append("comments", comments);
    formData.append("totalCost", totalCost);
    formData.append("payment_intent", payment_intent);

    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        $("#measuring_a_custom_tool").modal("hide");
        _hide_loader();
        toastr.success("Measuring tool request sent successfully");
      },
      error: function (error) {
        console.error("Error sending measuring tool request");
      },
    });
  }

  $("#color-picker").on("click", function () {
    $("#drawing_fill").click();
  });

  if (window.location.search === "?board=new") {
    _create_new_workspace();
    _reset_localstorage_info();
  } else {
    _fetch_workspace_info_from_database();
    _update_data_in_localstorage();
  }
  _allow_drop_in_workspace();
  _get_size_base_pricing();

  /*
   * Add to cart functionality for the board items
   */

  function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
      return rgb;
    } else {
      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
      }
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
  }

  $("#add_to_cart").on("click", function () {
    // _show_loader();

    var boardData = $("#workspace_area .draggable-container img");
    var boardDataArray = [];
    boardData.each(function () {
      var product_id = $(this).data("id");
      var color = $(this).data("color");
      // rgb to hex conversion
      if (color && color.includes("rgb")) {
        color = rgb2hex(color);
      } else {
        color = "#000000";
      }
      boardDataArray.push({
        product_id: product_id,
        quantity: 1,
        color: color,
      });
    });

    var data = {
      action: "addBoardDataToCart",
      products: boardDataArray,
    };
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: data,
      success: function (response) {
        // toastr.success("Tools are added to cart successfully");
        _generate_workspace_image();

      },
      error: function (error) {
        console.error("Error adding board to cart");
        _hide_loader();
      },
    });
  });

  function _cart_button_toggle() {
    const tools = $("#workspace_area .draggable-container img");

    if (tools.length == 0) {
      $("#add_to_cart").css({
        display: "none",
      });
    } else {
      $("#add_to_cart").css({
        display: "block",
      });
    }
  }

  $("form.checkout").on("checkout_place_order", function () {
    $("form.checkout").append('<div id="preloader" class="preloader"></div>');
    if ($("form.checkout").find(".woocommerce-error").length === 0) {
      _show_loader();
    }
  });

  $(".bdt-gallery-thumbnail img").click(function () {
    // Find the closest parent portfolio item element
    var portfolioItem = $(this).closest(".bdt-portfolio-inner");

    // Find the title link within the portfolio item
    var titleLink = portfolioItem.find(".bdt-portfolio-desc a");

    // Get the product page URL from the title link's href attribute
    var productPageURL = titleLink.attr("href");

    // Navigate to the product page URL
    window.location.href = productPageURL;
  });

  // ajax to get the size from pricing table
  async function _get_size_base_pricing() {
    const nonce = amerisan_client.nonce;
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: {
        action: "get_amerisan_pricing_size",
        nonce: nonce,
      },
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const sizes = response.data;
          _workspace_dimentions.empty();
          sizes.forEach(function (size) {
            _workspace_dimentions.append(
              '<option value="' + size.size + '">' + size.size + "</option>"
            );
          });

          const preBoardDim = localStorage.getItem("previous_board_dimensions");
          // console.log(preBoardDim);
          if (preBoardDim) {
            _workspace_dimentions.val(preBoardDim);
            _workspace_dimentions.trigger("change");
          }
        } else {
          console.error("Error retrieving data:", response.data.message);
        }
      },
      error: function (error) {
        console.error("Error in AJAX request:", error);
      },
    });
  }

  // html2canvas to download the image

  function _generate_workspace_image() {
    const element = _main_workspace_area[0];
    html2canvas(element, {
      useCORS: true,
    })
      .then(function (canvas) {
        const base64Image = canvas.toDataURL("image/png");
        const imageName = _workspace_title.val();
        const mimeType = "image/png";

        _upload_workspace_info_to_create_product(base64Image, imageName, mimeType);
      })
      .catch(function (error) {
        console.error("html2canvas failed: ", error);
      });
  }



  async function _upload_workspace_info_to_create_product(base64Image, imageName, mimeType) {

    var total_price = $("#total_price").text();
    total_price = total_price.replace("$", "");
    total_price = parseFloat(total_price);

    var board_quantity = _workspace_quantity.val();
    board_quantity = parseInt(board_quantity);

    if (!board_quantity || board_quantity < 1 || isNaN(board_quantity)) {
      toastr.error("Please enter a valid quantity");
      return;
    }

    var board_material = _workspace_material.val();
    var board_style = _workspace_style.val();
    var board_dimensions = _workspace_dimentions.val();

    const _object = {
      image_name: imageName,
      total_price: total_price,
      board_material: board_material,
      board_style: board_style,
      board_dimensions: board_dimensions,
      board_quantity: board_quantity
    }


    const _validation = {
      image_name: { required: true, type: 'string' },
      total_price: { required: true, type: 'number' },
      board_material: { required: true, type: 'string' },
      board_style: { required: true, type: 'string' },
      board_dimensions: { required: true, type: 'string' },
      board_quantity: { required: true, type: 'number', min: 1 },
    }
    let velidated = _validate_object(_object, _validation);
    if (velidated) {

      var formData = {
        action: "upload_image_amerisan",
        file: base64Image,
        name: imageName,
        price: total_price,
        board_material: board_material,
        board_style: board_style,
        board_dimensions: board_dimensions,
        board_quantity: board_quantity,
      };

      try {
        $.ajax({
          type: "POST",
          url: _admin_ajax,
          data: formData,
          success: function (response) {
            toastr.success("Workspace image and tools successfully added in the cart.");
            _hide_loader();
            if (window.location.href.includes("localhost")) {
              window.location.href = "/ams/index.php/cart";
            } else {
              window.location.href = "/cart";
            }
          },
          error: function (error) {
            console.error(error);
          },
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      toastr.error("Please fill all the information");
    }
  }
  // get the price for the selected size and material from pricing table
  $("#board_dimensions, #board_material").on("change", function () {
    const size = _workspace_dimentions.val();
    var material = _workspace_material.val().toLowerCase();
    // console.log(size, material, 'size, material');
    _get_selected_price(size, material);
  });

  function _get_selected_price(size, material) {
    const nonce = amerisan_client.nonce;
    if (material === "toughguard+") {
      material = "toughguardplus";
    }
    if (!size) {
      return;
    }
    var price = 0;
    $.ajax({
      url: _admin_ajax,
      type: "POST",
      data: {
        action: "get_amerisan_selected_pricing_price",
        size: size,
        material: material,
        nonce: nonce,
      },
      dataType: "json",
      success: function (response) {
        // console.log(response, 'response');
        if (response.success) {
          price = response.data;
          // get the price for the selected size and material from pricing array
          price = price[material];
          // price in float
          price = parseFloat(price);
          if (!price || isNaN(price)) {
            $("#total_price_container").css("display", "none");
            return;
          } else {
            localStorage.setItem("custom_board_dimensions", size);
            $("#total_price_container").css("display", "flex");
            $("#total_price").text("$" + price);
          }
          _update_workspace_data_in_database();
        } else {
          console.error("Error retrieving data:", response.data.message);
        }
      },
      error: function (error) {
        console.error("Error in AJAX request:", error);
      },
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cartItems = document.querySelectorAll('.woocommerce-cart-form .product-thumbnail a');
    cartItems.forEach(function (item) {
      var img = item.querySelector('img');
      if (img) {
        item.parentNode.replaceChild(img, item);
      }
    });
  });


  // Call functions on page load
  _initilaze_touch_handlers();
})(jQuery);
