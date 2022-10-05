const posts = document.getElementById("posts");
const postContent = document.getElementById("post-content");
const postTitle = document.getElementById("post-title");
const submitPost = document.getElementById("submit-post");
const yourUsername = document.getElementById("your-username");

const API_BASE_URL = "https://nf-api.onrender.com";

const getAllPostsURL = `${API_BASE_URL}/api/v1/social/posts?_author=true&_comments=true&_reactions=true`;
const postPostURL = `${API_BASE_URL}/api/v1/social/posts`;

const allPosts = [];

yourUsername.innerHTML = localStorage.getItem("username");

const writePosts = () => {
  posts.innerHTML = "";
  for (let content of allPosts) {
    posts.innerHTML += `
            <div class="bg-white rounded-3 p-3 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="profile.html">
                        <p class="font-weight-bold ps-3 mb-0 text-black">${
                          content.author.name
                        }</p>
                    </a>
                </div>
                <h3>${content.title}</h3>
                <p>${content.updated}</p>
                <p>${content.body}</p>
                ${
                  content.author === yourUsername
                    ? "<button>delete</button>"
                    : ""
                }
            </div>`;
  }
};

// sette inn deletknapp som dukker opp på posten IF author er marthebull
// så posts.innerHTML += <button id=${content.id}></button>

async function getAllPosts(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(url, options);

    const response = await fetch(url, options);

    const posts = await response.json();
    console.log(posts);

    for (let post of posts) {
      allPosts.push(post);
    }
    writePosts();
  } catch (error) {
    console.warn(error);
  }
}

getAllPosts(getAllPostsURL);

// new post

async function postPost(url, data) {
  console.log("funger pls");

  try {
    const accessToken = localStorage.getItem("accessToken");
    //console.log(accessToken);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    console.log(url, data, options);
    // opp i api
    const response = await fetch(url, options);
    console.log(response);
    const answer = await response.json();
    if (response.status === 200) {
      console.log("bra");
      getAllPosts(getAllPostsURL);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
    console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

submitPost.addEventListener("click", () => {
  const postData = {
    title: postTitle.value.trim(), // Required
    body: postContent.value.trim(), // Required
  };
  postPost(postPostURL, postData);

  setTimeout(() => {
    getAllPosts(getAllPostsURL);
  }, 5000);
});

submitPost.addEventListener("click", () => {
  console.log("Så smart marthe");
});
