var deferredPrompt;
var installButton = document.querySelector('#install-button');

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(posts => {
      const postsContainer = document.getElementById('posts-container');
      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post-card');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.body}</p>
          <hr class="post-divider">
          <div class="post-id">Post ID: ${post.id}</div>
        `;
        postsContainer.appendChild(postElement);
      });
    })
    .catch(error => {
      console.error('Error fetching posts:', error);
    });
});

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  installButton.style.display = 'block'; // Show the install button
});

installButton.addEventListener('click', function() {
  installButton.style.display = 'none'; // Hide the install button
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(function(choiceResult) {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    deferredPrompt = null;
  });
});