
var snackBar_Interval;

function SnackBar(target) {

    if (target === undefined) {
        this._Create();
    }
    else {
        this._Element = document.querySelector(target);
    }

    this._Interval = null;
}

SnackBar.prototype.Info = function (message, timeout, dismissible) {
    /// <summary>Shows a snackbar notification with no color indicator</summary>  
    /// <param name="message" type="String">The message to display</param>  
    /// <param name="timeout" type="Number">Optional: The number of milliseconds before the message disappears</param>
    /// <param name="dismissible" type="Boolean">Optional: Whether or not the alert should be dismissible</param>

    let options = {
        status: "info",
        timeout: timeout,
        dismissible: dismissible,
        message: message
    }

    this._Show(options);
};

SnackBar.prototype.Success = function (message, timeout, dismissible) {
    let options = {
        status: "success",
        timeout: timeout,
        dismissible: dismissible,
        message: message
    };
    
    this._Show(options);
};

SnackBar.prototype.Error = function (message, timeout, dismissible) {
    let options = {
        status: "danger",
        message: message,
        timeout: timeout,
        dismissible: dismissible
    };
    
    this._Show(options);
};

SnackBar.prototype.Warning = function (message, timeout, dismissible) {
    let options = {
        status: "warning",
        message: message,
        timeout: timeout,
        dismissible: dismissible
    };
    
    this._Show(options);
};

SnackBar.prototype.Default = function(message, timeout, dismissible) {
    let options = {
        message: message,
        timeout: timeout,
        dismissible: dismissible,
        status: ""
    };
    
    this._Show(options);
}

SnackBar.prototype._Show = function (userOptions) {
    let snackbar = this;
    snackbar._Initialize(userOptions);

    // load the newly initialzied options
    let options = snackbar.Options
    

    if (this._Element) {
        let waitTime = 0;

        if (snackbar._Interval) {
            snackbar.Close();
            waitTime = 500;
        }

        setTimeout(function () {
            snackbar.Reset();

            var snackBar__message = snackbar._Element.querySelector(".tsmi-snackbar__message");

            if (options.message) {
                snackBar__message.textContent = options.message;
            }
            else {
                return false;
            }


            // Ensure all old classes are removed
            snackbar._Element.classList.remove("tsmi-snackbar--success");
            snackbar._Element.classList.remove("tsmi-snackbar--warning");
            snackbar._Element.classList.remove("tsmi-snackbar--danger");
            snackbar._Element.classList.remove("tsmi-snackbar--info");

            if (options.status) {
                status = status.toLowerCase().trim();

                if (options.status === "success") {
                    snackbar._Element.classList.add("tsmi-snackbar--success");
                }
                else if (options.status === "warning") {
                    snackbar._Element.classList.add("tsmi-snackbar--warning");
                }
                else if (options.status === "danger") {
                    snackbar._Element.classList.add("tsmi-snackbar--danger");
                }
                else if (options.status === "info") {
                    snackbar._Element.classList.add("tsmi-snackbar--info");
                }
            }

            if (options.dismissible) {
                snackbar._Element.classList.add("tsmi-snackbar--dismissible");
            }
            else {
                snackbar._Element.classList.remove("tsmi-snackbar--dismissible");
            }

            snackbar._Element.classList.add("tsmi-snackbar--show");

            // automatically dismiss after 3 seconds
            if (options.timeout) {
                snackbar._Interval = setTimeout(function () {
                    snackbar.Close();
                }, options.timeout);
            }
        }, waitTime); // wait for any previous animations to finish if necessary
    }
};

SnackBar.prototype.Close = function () {
    if (this._Interval)
        clearInterval(this._Interval);

    this._Element.classList.remove("tsmi-snackbar--show");
};

SnackBar.prototype.Reset = function () {
    this._Element.classList.remove("tsmi-snackbar--success");
    this._Element.classList.remove("tsmi-snackbar--warning");
    this._Element.classList.remove("tsmi-snackbar--danger");
    this._Element.classList.remove("tsmi-snackbar--dismissible");
};

SnackBar.prototype._Create = function() {
    let snackbar = this;
    let body = document.querySelector("body");

    snackbar._Element = document.createElement("div");
    snackbar._Element.classList.add("tsmi-snackbar");

    let status = document.createElement("span");
    status.classList.add("tsmi-snackbar__status");

    snackbar._Element.appendChild(status);

    let message = document.createElement("span");
    message.classList.add("tsmi-snackbar__message");
    

    snackbar._Element.appendChild(message);

    let closeBtn = document.createElement("span");
    closeBtn.classList.add("tsmi-snackbar__close");
    closeBtn.innerText = "\u00D7";

    closeBtn.onclick = function() {
        snackbar.Close();
    }

    snackbar._Element.appendChild(closeBtn);

    body.appendChild(snackbar._Element);
}

SnackBar.prototype._Initialize = function(userOptions) {
    this._OptionDefaults = {
        message: "Operation performed successfully.",
        dismissible: true,
        timeout: 5000,
        status: ""
    };

    this.Options = this._OptionDefaults;

    // if no options given, revert to default
    if (userOptions === undefined) {
        return;
    }

    if (userOptions.message !== undefined) {
        this.Options.message = userOptions.message;
    }

    if (userOptions.dismissible !== undefined) {
        if (typeof (userOptions.dismissible) === "string") {
            this.Options.dismissible = (userOptions.dismissible === "true");
        }
        else if (typeof (userOptions.dismissible) === "boolean") {
            this.Options.dismissible = userOptions.dismissible;
        }
        else {
            console.error("Invalid option provided for 'dismissable' [" + userOptions.dismissible + "] is of type " + (typeof userOptions.dismissible));
        }
    }


    if (userOptions.timeout !== undefined) {
        let inputType = typeof (userOptions.timeout);
        let timeout = this._OptionDefaults.timeout;

        if (inputType === "string") {
            timeout = parseInt(userOptions.timeout);
        }
        else if  (inputType === "number") {
            timeout = userOptions.timeout;
        }
        else {
            console.error("Invalid option provided for 'time'");
        }

        if (timeout >= 0 || timeout === Infinity) {
            this.Options.timeout = timeout;
        }
        else {
            console.error("Invalid timeout entered. Must be greater than or equal to 0.");
        }
        
    }

    if (userOptions.status !== undefined) {
        this.Options.status = userOptions.status;
    }
}
