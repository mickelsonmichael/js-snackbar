
function SnackBar(userOptions) {
    var snackbar = this;
    var _Interval;
    var _Message;
    var _Element;
    var _Container;
    
    
    var _OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 5000,
        status: ""
    }
    var _Options = _OptionDefaults;

    function _Create() {
        _Container = document.getElementsByClassName("js-snackbar-container")[0];

        if (!_Container) {
            // need to create a new container for notifications
            _Container = document.createElement("div");
            _Container.classList.add("js-snackbar-container");

            document.body.appendChild(_Container);
        }
        _Element = document.createElement("div");
        _Element.classList.add("js-snackbar__wrapper");

        let innerSnack = document.createElement("div");
        innerSnack.classList.add("js-snackbar", "js-snackbar--show");
    
        if (_Options.status) {
            _Options.status = _Options.status.toLowerCase().trim();

            let status = document.createElement("span");
            status.classList.add("js-snackbar__status");


            if (_Options.status === "success" || _Options.status === "green") {
                status.classList.add("js-snackbar--success");
            }
            else if (_Options.status === "warning" || _Options.status === "alert" || _Options.status === "orange") {
                status.classList.add("js-snackbar--warning");
            }
            else if (_Options.status === "danger" || _Options.status === "error" || _Options.status === "red") {
                status.classList.add("js-snackbar--danger");
            }
            else {
                status.classList.add("js-snackbar--info");
            }

            innerSnack.appendChild(status);
        }
        
        _Message = document.createElement("span");
        _Message.classList.add("js-snackbar__message");
        _Message.textContent = _Options.message;

        innerSnack.appendChild(_Message);

        if (_Options.dismissible) {
            let closeBtn = document.createElement("span");
            closeBtn.classList.add("js-snackbar__close");
            closeBtn.innerText = "\u00D7";

            closeBtn.onclick = Close;

            innerSnack.appendChild(closeBtn);
        }

        _Element.style.height = "0px";
        _Element.style.opacity = "0";
        _Element.style.marginTop = "0px";
        _Element.style.marginBottom = "0px";

        _Element.appendChild(innerSnack);
        _Container.appendChild(_Element);

        if (_Options.timeout !== false) {
            _Interval = setTimeout(Close, _Options.timeout);
        }
    }

    var _ConfigureDefaults = function() {
        // if no options given, revert to default
        if (userOptions === undefined) {
            return;
        }

        if (userOptions.message !== undefined) {
            _Options.message = userOptions.message;
        }

        if (userOptions.dismissible !== undefined) {
            if (typeof (userOptions.dismissible) === "string") {
                _Options.dismissible = (userOptions.dismissible === "true");
            }
            else if (typeof (userOptions.dismissible) === "boolean") {
                _Options.dismissible = userOptions.dismissible;
            }
            else {
                console.debug("Invalid option provided for 'dismissable' [" + userOptions.dismissible + "] is of type " + (typeof userOptions.dismissible));
            }
        }


        if (userOptions.timeout !== undefined) {
            if (typeof (userOptions.timeout) === "boolean" && userOptions.timeout === false) {
                _Options.timeout = false;
            }
            else if (typeof (userOptions.timeout) === "string") {
                _Options.timeout = parseInt(userOptions.timeout);
            }


            if (typeof (userOptions.timeout) === "number") {
                if (userOptions.timeout === Infinity) {
                    _Options.timeout = false;
                }
                else if (userOptions.timeout >= 0) {
                    _Options.timeout = userOptions.timeout;
                }
                else {
                    console.debug("Invalid timeout entered. Must be greater than or equal to 0.");
                }

                _Options.timeout = userOptions.timeout;
            }

            
        }

        if (userOptions.status !== undefined) {
            _Options.status = userOptions.status;
        }
    }

    this.Open = function() {
        let contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

        _Element.style.height = contentHeight + "px";
        _Element.style.opacity = 1;
        _Element.style.marginTop = "5px";
        _Element.style.marginBottom = "5px";

        _Element.addEventListener("transitioned", function() {
            _Element.removeEventListener("transitioned", arguments.callee);
            _Element.style.height = null;
        })
    }

    this.Close = function () {
        if (_Interval)
            clearInterval(_Interval);

        let snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        let snackbarTransitions = _Element.style.transition;
        _Element.style.transition = "";

        requestAnimationFrame(function() {
            _Element.style.height = snackbarHeight + "px"; // set the auto height to the px height
            _Element.style.opacity = 1;
            _Element.style.marginTop = "0px";
            _Element.style.marginBottom = "0px";
            _Element.style.transition = snackbarTransitions

            requestAnimationFrame(function() {
                _Element.style.height = "0px";
                _Element.style.opacity = 0;
            })
        });

        setTimeout(function() {
            _Container.removeChild(_Element);
        }, 1000);
    };

    _ConfigureDefaults();
    _Create();
    Open();
}