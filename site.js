
var nav = document.getElementById("nav");

// document.addEventListener('click', function (e) {
//     if (nav.classList.contains("nav--shown")) {
//         var insideNav = nav.contains(e.target);
//         if (!insideNav) {
//             nav.classList.remove("nav--shown");
//         }
//     }
// });


var toggleNav = function() {
    nav.classList.toggle("nav--shown");
}

var openers = document.querySelectorAll(".nav-opener");

for (let i = 0; i < openers.length; i++) {
    openers[i].addEventListener("click", toggleNav);
}


var navigate = function(event) {
    let sender = event.target;
    let anchor = sender.getAttribute("href");

    if (anchor.substr(0,1) === "#") {
        event.preventDefault();
        document.getElementById(anchor.substr(1)).scrollIntoView({
            behavior: "smooth"
        });

        // let otherlinks = document.querySelectorAll(".nav-a--active");

        // for (let i = 0; i < otherlinks.length; i++) {
        //     otherlinks[i].classList.remove("nav-a--active");
        // }

        //sender.classList.add("nav-a--active");

        nav.classList.remove("nav--shown");
    }
}

var links = document.querySelectorAll(".nav-a");
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", navigate);
}

var anchors = document.querySelectorAll(".section");
for (let i= 0; i < anchors.length; i++) {
    
}

