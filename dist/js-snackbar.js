function SnackBar(userOptions) {
  var _This = this;

  var _Interval;

  var _Element;

  var _Container;

  function _create() {
    _applyUserOptions();

    _setContainer();

    _applyPositionClasses();

    _Element = _createMessage();

    _Container.appendChild(_Element);

    if (_Options.timeout !== false) {
      _Interval = setTimeout(_This.Close, _Options.timeout);
    }
  }

  function _applyUserOptions() {
    _Options = {
      message: userOptions?.message ?? "Operation performed successfully.",
      dismissible: userOptions?.dismissible ?? true,
      timeout: userOptions?.timeout ?? 5000,
      status: userOptions?.status !== undefined ? userOptions.status.toLowerCase().trim() : "",
      actions: userOptions?.actions ?? [],
      fixed: userOptions?.fixed ?? false,
      position: userOptions?.position ?? "br",
      container: userOptions?.container ?? document.body
    };
  }

  function _setContainer() {
    var target = typeof _Options.container === "object" ? _Options.container : document.getElementById(_Options.container);

    if (target === undefined) {
      console.error("SnackBar: Could not find target container " + _Options.container);
      target = document.body;
    }

    _Container = getOrAddContainerIn(target);

    function getOrAddContainerIn(target) {
      var node;

      var positionClass = _getPositionClass();

      for (var i = 0; i < target.children.length; i++) {
        node = target.children.item(i);

        if (node.nodeType === 1 && node.classList.length > 0 && node.classList.contains("js-snackbar-container") && node.classList.contains(positionClass)) {
          return node;
        }
      }

      return createNewContainer(target);
    }

    function createNewContainer(target) {
      container = document.createElement("div");
      container.classList.add("js-snackbar-container");

      if (_Options.fixed) {
        container.classList.add("js-snackbar-container--fixed");
      }

      target.appendChild(container);
      return container;
    }
  }

  function _applyPositionClasses() {
    _Container.classList.add(_getPositionClass());

    var fixedClassName = "js-snackbar-container--fixed";

    if (_Options.fixed) {
      _Container.classList.add(fixedClassName);
    } else {
      _Container.classList.remove(fixedClassName);
    }
  }

  function _createMessage() {
    var outerElement = document.createElement("div");
    outerElement.classList.add("js-snackbar__wrapper");
    outerElement.style.height = "0px";
    outerElement.style.opacity = "0";
    outerElement.style.marginTop = "0px";
    outerElement.style.marginBottom = "0px";
    var innerSnack = document.createElement("div");
    innerSnack.classList.add("js-snackbar", "js-snackbar--show");
    applyColorTo(innerSnack);
    insertMessageTo(innerSnack);
    addActionsTo(innerSnack);
    addDismissButtonTo(innerSnack);
    outerElement.appendChild(innerSnack);
    return outerElement;

    function applyColorTo(element) {
      if (!_Options.status) return;
      var status = document.createElement("span");
      status.classList.add("js-snackbar__status");

      switch (_Options.status) {
        case "success":
        case "green":
          status.classList.add("js-snackbar--success");
          break;

        case "warning":
        case "alert":
        case "orange":
          status.classList.add("js-snackbar--warning");
          break;

        case "danger":
        case "error":
        case "red":
          status.classList.add("js-snackbar--danger");
          break;

        default:
          status.classList.add("js-snackbar--info");
          break;
      }

      element.appendChild(status);
    }

    function insertMessageTo(element) {
      var message = document.createElement("span");
      message.classList.add("js-snackbar__message");
      message.textContent = _Options.message;
      element.appendChild(message);
    }

    function addActionsTo(element) {
      if (typeof _Options.actions !== "object") {
        return;
      }

      for (var i = 0; i < _Options.actions.length; i++) {
        addAction(element, _Options.actions[i]);
      }

      function addAction(element, action) {
        var button = document.createElement("span");
        button.classList.add("js-snackbar__action");
        button.textContent = action.text;

        if (typeof action.function === "function") {
          if (action.dismiss === true) {
            button.onclick = function () {
              action.function();

              _This.Close();
            };
          } else {
            button.onclick = action.function;
          }
        } else {
          button.onclick = _This.Close;
        }

        element.appendChild(button);
      }
    }

    function addDismissButtonTo(element) {
      if (!_Options.dismissible) {
        return;
      }

      var closeButton = document.createElement("span");
      closeButton.classList.add("js-snackbar__close");
      closeButton.innerText = "\u00D7";
      closeButton.onclick = _This.Close;
      element.appendChild(closeButton);
    }
  }

  function _getPositionClass() {
    switch (_Options.position) {
      case "bl":
        return "js-snackbar-container--bottom-left";

      case "tl":
        return "js-snackbar-container--top-left";

      case "tr":
        return "js-snackbar-container--top-right";

      default:
        return "js-snackbar-container--bottom-right";
    }
  }

  this.Open = function () {
    var contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

    _Element.style.height = contentHeight + "px";
    _Element.style.opacity = 1;
    _Element.style.marginTop = "5px";
    _Element.style.marginBottom = "5px";

    _Element.addEventListener("transitioned", function () {
      _Element.removeEventListener("transitioned", arguments.callee);

      _Element.style.height = null;
    });
  };

  this.Close = function () {
    if (_Interval) clearInterval(_Interval);
    var snackbarHeight = _Element.scrollHeight; // get the auto height as a px value

    var snackbarTransitions = _Element.style.transition;
    _Element.style.transition = "";
    requestAnimationFrame(function () {
      _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height

      _Element.style.opacity = 1;
      _Element.style.marginTop = "0px";
      _Element.style.marginBottom = "0px";
      _Element.style.transition = snackbarTransitions;
      requestAnimationFrame(function () {
        _Element.style.height = "0px";
        _Element.style.opacity = 0;
      });
    });
    setTimeout(function () {
      _Container.removeChild(_Element);
    }, 1000);
  };

  _create();

  _This.Open();
}