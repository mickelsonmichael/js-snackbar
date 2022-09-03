const SnackBar = require("../src/js-snackbar");

require("@testing-library/jest-dom");

describe("container", () => {
  it("accepts a class name", () => {
    document.body.innerHTML = `
            <div class="target"></div>
        `;

    SnackBar({
      message: "Hello World",
      timeout: false,
      container: ".target",
    });

    expect(document.querySelector(".js-snackbar-container")).toBeVisible();
  });

  it("accepts an id", () => {
    document.body.innerHTML = `
            <div id="target"></div>
        `;

    SnackBar({
      message: "Hello World",
      timeout: false,
      container: "#target",
    });

    expect(document.querySelector(".js-snackbar-container")).toBeVisible();
  });
});
