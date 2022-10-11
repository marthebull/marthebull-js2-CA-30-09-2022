// ------- urler
const API_BASE_URL = "https://nf-api.onrender.com";
const getAllPostsURL = `${API_BASE_URL}/api/v1/social/posts?_author=true&_comments=true&_reactions=true`;
const postPostURL = `${API_BASE_URL}/api/v1/social/posts/`;

// ----------- setter riktig brukernevn
const currentUsername = document.getElementById("current-username");
const currentUsernameCreate = document.getElementById(
  "current-username-create"
);
const collectedUsername = localStorage.getItem("username");
console.log(collectedUsername);
currentUsername.innerHTML = `@ ${collectedUsername}`;
currentUsernameCreate.innerHTML = `@ ${collectedUsername}`;

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
const submitPost = document.getElementById("submit-post-profile");
const postTitle = document.getElementById("post-title-profile");
const postMedia = document.getElementById("post-media-profile");
const postContent = document.getElementById("post-content-profile");

submitPost.addEventListener("click", () => {
  const postData = {
    title: postTitle.value.trim(),
    body: postContent.value.trim(),
    media: postMedia.value.trim(),
  };
  postPost(postPostURL, postData);
});

// ------- Hvor postene skal bli satt inn
const postOutput = document.getElementById("profile-posts");
// ------- Looper gjennom skriver ut poster

const writePosts = (list, postOutput) => {
  postOutput.innerHTML = "";
  let newDivs = "";

  for (let content of list) {
    const deleteBtn = `<button class="btnDelete btn btn-primary ms-3 text-secondary rounded-pill" data-delete="${content.id}">Delete</button>`;
    const viewBtn = `<button class="btnView btn border-primary ms-3 text-primary rounded-pill" data-view="${content.id}">See more</button>`;
    const updateBtn = `<button class="btnUpdate btn border-primary ms-3 text-primary  rounded-pill" data-update="${content.id}" type="button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>`;
    newDivs += `
            <div class="bg-white rounded-3 p-5 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="profile.html">
                    <div class="rounded-circle bg-primary p-4 opacity-50" alt="Jakes profile picture"></div>
                        <p class="ps-3 mb-0 text-black">@ ${
                          content.author.name
                        }</p>
                    </a>
                </div>
                <h3>${content.title}</h3>
                <div>
                    <p class="col-12 overflow-auto">${content.body}</p>
                </div>
                
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

  postOutput.innerHTML = newDivs;

  const viewBtns = document.querySelectorAll("button.btnView");
  //console.log(viewBtns);
  for (let btnView of viewBtns) {
    btnView.addEventListener("click", () => {
      const viewId = btnView.getAttribute("data-view");
      window.location = `../view-post.html?id=${viewId}`;
    });
  }

  const editBtns = document.querySelectorAll("button.btnUpdate");
  //console.log(editBtns);
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
    console.log(response);
    const posts = await response.json();
    console.log(posts);
    postCollection = posts;
    console.log("Colletion:", postCollection);
    writePosts(posts, outElement);
  } catch (error) {
    console.warn(error);
  }
}

// Henter alle poster
getAllPosts(getAllPostsURL);
