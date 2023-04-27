const username = "TraditionalTouch";
const repository = "TraditionalTouch.github.io";
const folder = "Jewellery";
const catalogue = document.getElementById("catalogue");

function loadImage(img) {
	const src = img.getAttribute("data-src");
	const name = img.getAttribute("data-name");
	if (src) {
		img.src = src;
		img.removeAttribute("data-src");
		img.classList.add("visible");
		img.classList.remove("hidden");
	}
	const caption = document.createElement("figcaption");
	caption.innerHTML = name;
	img.parentNode.appendChild(caption);
}

function handleIntersection(entries, observer) {
	entries.forEach(function (entry) {
		if (entry.isIntersecting) {
			const img = entry.target;
			loadImage(img);
			observer.unobserve(img);
		}
	});
}

fetch(`https://api.github.com/repos/${username}/${repository}/contents/${folder}`)
	.then((response) => response.json())
	.then((contents) => {
		const images = contents
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
			const figure = document.createElement("figure");
			const img = document.createElement("img");
			img.setAttribute("data-src", image.url);
			img.setAttribute("data-name", image.name);
			img.src = "placeholder.png";
			img.loading = "lazy";
			img.classList.add("hidden");
			figure.appendChild(img);
			catalogue.appendChild(figure);
			const observer = new IntersectionObserver(handleIntersection, {
				rootMargin: "50px",
			});
			observer.observe(img);
			img.addEventListener("click", function () {
				const dialog = document.createElement("dialog");
				dialog.classList.add("dialog");
				const closeButton = document.createElement("img");
				closeButton.src = "Assets/close.svg";
				closeButton.alt = "Close";
				closeButton.classList.add("close-button");
				closeButton.addEventListener("click", function () {
					dialog.close();
					dialog.remove();
				});
				const imgCopy = img.cloneNode(true);
				imgCopy.classList.remove("hidden");
				imgCopy.classList.add("dialog-image");
				const copyButton = document.createElement("button");
				copyButton.innerText = "Copy URL";
				copyButton.classList.add("copy-button");
				copyButton.style.backgroundColor = "#FF6CA8";
				copyButton.style.position = "absolute";
				copyButton.style.bottom = "10px";
				copyButton.style.left = "50%";
				copyButton.style.transform = "translateX(-50%)";
				copyButton.addEventListener("click", function () {
					const url = image.url;
					navigator.clipboard.writeText(url);
				});
				dialog.appendChild(closeButton);
				dialog.appendChild(imgCopy);
				dialog.appendChild(copyButton);
				document.body.appendChild(dialog);
				dialog.showModal();
				dialog.addEventListener("click", function (event) {
					if (event.target === dialog) {
						dialog.close();
						dialog.remove();
					}
				});
			});
		});
	})
	.catch((error) => console.error(error));