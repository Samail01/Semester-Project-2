export function loadComponent(id, url, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
        if (callback) callback();
      } else {
        console.error(`Element with id "${id}" not found.`);
      }
    })
    .catch((error) => console.error("Error loading component:", error));
}
