var username = "TraditionalTouch";
var repository = "TraditionalTouch.github.io";
var folder = "Jewellery";

var catalogue = document.getElementById("catalogue");

function loadImage(img) {
  var src = img.getAttribute("data-src");
  var name = img.getAttribute("data-name");
  if (src) {
    img.src = src;
    img.removeAttribute("data-src");
    img.classList.add("visible");
    img.classList.remove("hidden");
  }
  var caption = document.createElement("figcaption");
  caption.innerHTML = name;
  img.parentNode.appendChild(caption);
}

function handleIntersection(entries, observer) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var img = entry.target;
      loadImage(img);
      observer.unobserve(img);
    }
  });
}

fetch(`https://api.github.com/repos/${username}/${repository}/contents/${folder}`)
  .then((response) => response.json())
  .then((contents) => {
    var images = contents
      .filter(
        (content) =>
          content.type === "file" &&
          content.name.match(/\.(jpg|jpeg|png|gif)$/i)
      )
      .map((content) => ({
        name: content.name.replace(/\.[^/.]+$/, ""),
        url: content.download_url,
      }));

    images.forEach(function (image) {
      var figure = document.createElement("figure");
      var img = document.createElement("img");
      img.setAttribute("data-src", image.url);
      img.setAttribute("data-name", image.name);
      img.src = "placeholder.png";
      img.classList.add("hidden");
      figure.appendChild(img);
      catalogue.appendChild(figure);

      var observer = new IntersectionObserver(handleIntersection, {
        rootMargin: "50px",
      });
      observer.observe(img);

      img.addEventListener("click", function () {
        window.open(image.url);
        prompt("Copy URL", image.url);
      });
    });
  })
  .catch((error) => console.error(error));
