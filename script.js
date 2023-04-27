const username = "TraditionalTouch";
const repository = "TraditionalTouch.github.io";
const folder = "Jewellery";

const catalogue = document.getElementById("catalogue");

function loadImage(img) {
  if (img.src) {
    img.classList.add("visible");
    img.classList.remove("hidden");
  }
}

function handleIntersection(entries, observer) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const img = entry.target;
      loadImage(img);
      observer.unobserve(img);
    }
  });
}

fetch(`https://api.github.com/repos/${username}/${repository}/contents/${folder}`)
  .then(response => response.json())
  .then(contents => {
    const images = contents.filter(content => content.type === "file" && content.name.match(/\.(jpg|jpeg|png|gif)$/i))
                        .map(content => content.download_url);

    images.forEach(function(image) {
      const img = document.createElement("img");
      img.src = image;
      img.loading = "lazy";
      img.classList.add("hidden");
      catalogue.appendChild(img);

      const observer = new IntersectionObserver(handleIntersection, { rootMargin: "50px" });
      observer.observe(img);
    });
  })
  .catch(error => console.error(error));
