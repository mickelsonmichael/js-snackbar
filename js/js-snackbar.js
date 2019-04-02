
function SnackBar(userOptions) {
    var _This = this;
    var _Interval;
    var _Message;
    var _Element;
    var _Container;
    var _Parent;
    
    
    var _OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 5000,
        status: "",
        actions: [],
        fixed: false
    }
    var _Options = _OptionDefaults;

    function _Create() {
        if (_Options.container === null || _Options.container === undefined) {
            _Parent = document.body;
        }
        else {
            if (typeof _Options.container === "object" && _Options.container instanceof Element) {
                _Container = _Options.container;
            }
            else {
                var targetParent = document.getElementById(_Options.container);

                if (targetParent === undefined) {
                    console.error("SnackBar: Could not find target container " + _Options.container);
                    targetParent = document.body;
                }

                _Parent = targetParent;
            }
        }

        _Container = searchChildren(_Parent);

        if (!_Container) {
            // need to create a new container for notifications
            _Container = document.createElement("div");
            _Container.classList.add("js-snackbar-container");

            if(_Options.fixed) {
                _Container.classList.add("js-snackbar-container--fixed");
            }

            _Parent.appendChild(_Container);
        }

        if (_Options.fixed) {
            _Container.classList.add("js-snackbar-container--fixed");
        }
        else {
            _Container.classList.remove("js-snackbar-container--fixed");
        }


        _Element = document.createElement("div");
        _Element.classList.add("js-snackbar__wrapper");

        var innerSnack = document.createElement("div");
        innerSnack.classList.add("js-snackbar", "js-snackbar--show");
    
        if (_Options.status) {
            _Options.status = _Options.status.toLowerCase().trim();

            var status = document.createElement("span");
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

        if (_Options.actions !== undefined && typeof _Options.actions === "object" && _Options.actions.length !== undefined) {
            for (var i = 0; i < _Options.actions.length; i++) {
                var thisAction = _Options.actions[i];

                if (thisAction !== undefined 
                    && thisAction.text !== undefined && typeof thisAction.text === "string") {

                        if (thisAction.function !== undefined && typeof thisAction.function === "function"
                            || thisAction.dissmiss !== undefined && typeof thisAction.dissmiss === "boolean" && thisAction.dissmiss === true) {

                                var newButton = document.createElement("span");
                                    newButton.classList.add("js-snackbar__action");

                                    if (thisAction !== undefined && typeof thisAction.function === "function") {
                                        if (thisAction.dissmiss !== undefined && typeof thisAction.dissmiss === "boolean" && thisAction.dissmiss === true) {
                                            newButton.onclick = function() {
                                                thisAction.function();
                                                _This.Close()
                                            };
                                        }
                                        else {
                                            newButton.onclick = thisAction.function;
                                        }
                                    }
                                    else {
                                        newButton.onclick = _This.Close;
                                    }

                                    newButton.textContent = thisAction.text;

                                    innerSnack.appendChild(newButton);


                            }
                        
                    }
            }


        }

        if (_Options.dismissible) {
            var closeBtn = document.createElement("span");
            closeBtn.classList.add("js-snackbar__close");
            closeBtn.innerText = "\u00D7";

            closeBtn.onclick = _This.Close;

            innerSnack.appendChild(closeBtn);
        }

        _Element.style.height = "0px";
        _Element.style.opacity = "0";
        _Element.style.marginTop = "0px";
        _Element.style.marginBottom = "0px";

        _Element.appendChild(innerSnack);
        _Container.appendChild(_Element);

        if (_Options.timeout !== false) {
            _Interval = setTimeout(_This.Close, _Options.timeout);
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

        if (userOptions.actions !== undefined) {
            _Options.actions = userOptions.actions;
        }

        if (userOptions.container !== undefined && (typeof userOptions.container === "string" || typeof userOptions.container === "object")) {
            _Options.container = userOptions.container;
        }

        if (userOptions.fixed !== undefined) {
            _Options.fixed = userOptions.fixed;
        }
    }



    var searchChildren = function(target) {
        var htmlCollection = target.children;
        var node = null;
        var i = 0;

        for (i = 0; i < htmlCollection.length; i++) {
            node = htmlCollection.item(i);

            if (node.nodeType === 1 && node.classList.length > 0 && node.classList.contains("js-snackbar-container")) {
                return node;
            }
        }

        return null;
    }

    this.Open = function() {
        var contentHeight = _Element.firstElementChild.scrollHeight; // get the height of the content

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

        var snackbarHeight = _Element.scrollHeight; // get the auto height as a px value
        var snackbarTransitions = _Element.style.transition;
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
    _This.Open();
}