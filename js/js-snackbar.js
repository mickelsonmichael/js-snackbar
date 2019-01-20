
function SnackBar(userOptions) {
    var snackbar = this;
    var _Interval;
    var _Message;
    var _Element;
    
    
    var _OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 5000,
        status: ""
    }
    var _Options = _OptionDefaults;

    function _Create() {
        let container = document.getElementsByClassName("js-snackbar-container")[0];

        if (!container) {
            // need to create a new container for notifications
            container = document.createElement("div");
            container.classList.add("js-snackbar-container");

            document.body.appendChild(container);
        }

        _Element = document.createElement("div");
        _Element.classList.add("js-snackbar", "js-snackbar--show");
    
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

            _Element.appendChild(status);
        }
        
        _Message = document.createElement("span");
        _Message.classList.add("js-snackbar__message");
        _Message.textContent = _Options.message;

        _Element.appendChild(_Message);

        if (_Options.dismissible) {
            let closeBtn = document.createElement("span");
            closeBtn.classList.add("js-snackbar__close");
            closeBtn.innerText = "\u00D7";

            closeBtn.onclick = Close;

            _Element.appendChild(closeBtn);
        }

        container.appendChild(_Element);

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

    this.Close = function () {
        if (_Interval)
            clearInterval(_Interval);
    
        _Element.classList.remove("js-snackbar--show");

        setTimeout(function() {
            _Element.remove();
        }, 1000);
    };

    _ConfigureDefaults();
    _Create();
}