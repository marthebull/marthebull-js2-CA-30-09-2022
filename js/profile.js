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
      window.location = "../profile.html";
      getAllPosts(getAllPostsURL);
    }
    console.log(answer);
  } catch (error) {
    console.warn(error);
  }
}

// --------------- Poster posten når man klikker på knappen
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

// -------- Validere Create post formet -------------------------- kanskje fjerne alt dette hvis jeg ikke fåt det til
const titleMsg = document.getElementById("title-msg-profile");
const contentMsg = document.getElementById("content-msg-profile");
const imageUrlMsg = document.getElementById("image-url-msg-profile");

submitPost.addEventListener("click", validateForm);

function validateForm(e) {
  e.preventDefault();

  let submittedTitle = postTitle.value.trim();
  console.log(`Title: ${submittedTitle}`);

  titleMsg.innerHTML = "";
  if (submittedTitle.length < 1) {
    titleMsg.innerHTML = "A title for your thoughts.";
  }

  let submittedContent = postContent.value.trim();
  console.log(`Message: ${submittedContent}`);

  contentMsg.innerHTML = "";
  if (submittedContent.length < 1) {
    contentMsg.innerHTML = "Hey, thoughts goes in here!";
  }

  imageUrlMsg.innerHTML = "";
  if (postMedia.value.trim() === "") {
    imageUrlMsg.innerHTML = "Show them with a valid image URL.";
  }
}

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
                        <p class="ps-3 mb-0 text-black">@ ${content.owner}</p>
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
                      localStorage.getItem("username") === content.owner
                        ? updateBtn
                        : ""
                    }
                    ${
                      localStorage.getItem("username") === content.owner
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

const myPostsURL = `${API_BASE_URL}/api/v1/social/profiles/${collectedUsername}?_posts=true`;

async function getMyPosts(url) {
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
    const profile = await response.json();
    console.log("Profil:", profile);
    console.log("navn:", profile.name);
    console.log("post:", profile.posts);

    const myOwnPosts = profile.posts;

    writePosts(myOwnPosts, postOutput);
  } catch (error) {
    console.warn(error);
  }
}

// Henter alle poster
getMyPosts(myPostsURL);

// ------------ Viser alle brukere på siden

const profilesURL = `${API_BASE_URL}/api/v1/social/profiles/`;
const profilesOutput = document.getElementById("profiles-output");

async function getAllProfiles(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(url, options);
    console.log(response);
    const users = await response.json();
    console.log(users);
    writeProfiles(users, profilesOutput);
  } catch (error) {
    console.warn(error);
  }
}

// Henter alle poster
getAllProfiles(profilesURL);

const writeProfiles = (list, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";

  for (let user of list) {
    newDivs += `
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="profile.html">
                        <div class="rounded-circle bg-primary p-4 opacity-50" alt=""></div>
                        <p class="font-weight-bold ps-3 mb-0 text-black">${user.name}</p>
                    </a>
            `;
  }

  profilesOutput.innerHTML = newDivs;
};

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
    if (response.status === 200) window.location = "../profile.html";
  } catch (error) {
    console.log(error);
  }
}
