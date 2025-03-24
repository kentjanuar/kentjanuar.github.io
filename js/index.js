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
            <div class="post-id">Post ID: ${post.id}</div>

          `;
          postsContainer.appendChild(postElement);
        });
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  });