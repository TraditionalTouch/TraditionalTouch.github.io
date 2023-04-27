var username = "TraditionalTouch";
var repository = "TraditionalTouch.github.io";
var folder = "Jewellery";

var catalogue = document.getElementById("catalogue");

function loadImage(img) {
  var src = img.getAttribute("data-src");
  if (src) {
    img.src = src;
    img.removeAttribute("data-src");
    img.classList.add("visible");
    img.classList.remove("hidden");
  }
}

function handleIntersection(entries, observer) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      var img = entry.target;
      loadImage(img);
      observer.unobserve(img);
    }
  });
}

fetch(`https://api.github.com/repos/${username}/${repository}/contents/${folder}`)
  .then(response => response.json())
  .then(contents => {
    var images = contents.filter(content => content.type === "file" && content.name.match(/\.(jpg|jpeg|png|gif)$/i))
                        .map(content => content.download_url);

    images.forEach(function(image) {
      var img = document.createElement("img");
      img.setAttribute("data-src", image);
      img.src = "placeholder.png";
      img.loading = "lazy";
      img.classList.add("hidden");
      catalogue.appendChild(img);

      var observer = new IntersectionObserver(handleIntersection, { rootMargin: "50px" });
      observer.observe(img);

      var imageName = document.createElement("p");
      imageName.innerHTML = image.substring(image.lastIndexOf("/") + 1, image.lastIndexOf("."));
      imageName.classList.add("image-name");
      catalogue.appendChild(imageName);

      var imageLink = document.createElement("a");
      imageLink.href = image;
      imageLink.target = "_blank";
      imageLink.innerHTML = "Open in new tab";
      imageLink.classList.add("image-link");
      catalogue.appendChild(imageLink);
    });
  })
  .catch(error => console.error(error));
