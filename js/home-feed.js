// ------------------ Deklarerer variabler

const posts = document.getElementById("posts");
const postContent = document.getElementById("post-content");
const postTitle = document.getElementById("post-title");
const postMedia = document.getElementById("post-media");
const submitPost = document.getElementById("submit-post");
const yourUsername = document.getElementById("your-username");
const editBtn = document.getElementById("edit-button");

const API_BASE_URL = "https://nf-api.onrender.com";

const getAllPostsURL = `${API_BASE_URL}/api/v1/social/posts?_author=true&_comments=true&_reactions=true`;
const postPostURL = `${API_BASE_URL}/api/v1/social/posts/`;

const allPosts = [];

// Brukernavn på new post form
yourUsername.innerHTML = localStorage.getItem("username");

// -------------- Oppsett av enkelt post

const writePosts = () => {
  posts.innerHTML = "";
  for (let content of allPosts) {
    const deleteBtn = `<button class="btnDelete btn btn-primary ms-3 text-secondary rounded-pill" data-delete="${content.id}">DELETE</button>`;
    const viewBtn = `<button class="btnView btn border-primary ms-3 text-primary rounded-pill" data-view="${content.id}">SEE MORE</button>`;
    const updateBtn = `<button class="btnUpdate btn border-primary ms-3 text-primary  rounded-pill" data-update="${content.id}" type="button" data-bs-toggle="modal" data-bs-target="#editModal">EDIT</button>`;
    posts.innerHTML += `
            <div class="bg-white rounded-3 p-5 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="profile.html">
                        <p class=" mb-0 text-black">@ ${content.author.name}</p>
                    </a>
                </div>
                <h3>${content.title}</h3>
                <p class="col-12 overflow-auto">${content.body}</p>
                <img class="rounded-3 mb-3" width="100%" src="${
                  content.media
                }" alt="">
                <div class="d-flex justify-content-end">
                    ${viewBtn}
                    ${
                      localStorage.getItem("username") === content.author.name
                        ? updateBtn
                        : ""
                    }
                    ${
                      localStorage.getItem("username") === content.author.name
                        ? deleteBtn
                        : ""
                    }
                </div>
            </div>
            `;
  }
  const viewBtns = document.querySelectorAll("button.btnView");
  //console.log(viewBtns);
  for (let btnView of viewBtns) {
    btnView.addEventListener("click", () => {
      const viewId = btnView.getAttribute("data-view");
      window.location = `../view-post.html?id=${viewId}`;
    });
  }

  const editBtns = document.querySelectorAll("button.btnUpdate");
  console.log(editBtns);
  for (let btnEdit of editBtns) {
    btnEdit.addEventListener("click", () => {
      const editId = btnEdit.getAttribute("data-update");
      window.location = `../edit-post.html?id=${editId}`;
    });
  }

  const deleteBtns = document.querySelectorAll("button.btnDelete");
  //console.log(deleteBtns);
  for (let btnDelete of deleteBtns) {
    btnDelete.addEventListener("click", () => {
      console.log(btnDelete.getAttribute("data-delete"));
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(btnDelete.getAttribute("data-delete"));
      }
    });
  }
};

// ----------------- Henter alle poster

async function getAllPosts(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);
    const response = await fetch(url, options);
    const posts = await response.json();
    //console.log(posts);
    for (let post of posts) {
      allPosts.push(post);
    }
    writePosts();
  } catch (error) {
    console.warn(error);
  }
}

// Henter alle poster
getAllPosts(getAllPostsURL);

// ----------------------- Poster ny post

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
      window.location = "../home-feed.html";
      getAllPosts(getAllPostsURL);
    }
    console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

// Poster posten når man klikker på knappen
submitPost.addEventListener("click", () => {
  const postData = {
    title: postTitle.value.trim(),
    body: postContent.value.trim(),
    //media: postMedia.value.trim(),
  };
  postPost(postPostURL, postData);
});

// ---------------- Sletter posten

const deleteBtn = document.getElementById("delete-button");

async function deletePost(id) {
  console.log(id);
  const url = `${postPostURL}${id}`;
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(url, options);
    const response = await fetch(url, options);
    console.log(response);
    const answer = await response.json();
    console.log(answer);
    if (response.status === 200) window.location = "../home-feed.html";
  } catch (error) {
    console.log(error);
  }
}

// --------------- Edit post

// GET aktuell post, sette verdiene fra disse inn i innerHTML på inputfelt
// gjøre endringer, PUT tilbake i API når du klikker på publish

// -------------- filtrer poster

// -------------- søk på poster, navn, innhold osv

// --------------- Last egne poster på profil side + brukernavn
