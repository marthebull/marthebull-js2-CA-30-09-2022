// ------------------ Deklarerer variabler

const outElement = document.getElementById("posts");
const postContent = document.getElementById("post-content");
const postTitle = document.getElementById("post-title");
const postMedia = document.getElementById("post-media");
const submitPost = document.getElementById("submit-post");
const yourUsername = document.getElementById("your-username");
const editBtn = document.getElementById("edit-button");

const API_BASE_URL = "https://nf-api.onrender.com";

const getAllPostsURL = `${API_BASE_URL}/api/v1/social/posts?_author=true&_comments=true&_reactions=true`;
const postPostURL = `${API_BASE_URL}/api/v1/social/posts/`;

// Brukernavn på new post form
const currentUser = localStorage.getItem("username");
yourUsername.innerHTML = `@ ${currentUser}`;

// -------------- Oppsett av enkelt post

const writePosts = (list, outElement) => {
  outElement.innerHTML = "";
  let newDivs = "";

  for (let content of list) {
    const deleteBtn = `<button class="btnDelete btn btn-primary ms-3 text-secondary rounded-pill" data-delete="${content.id}">Delete</button>`;
    const viewBtn = `<button class="btnView btn border-primary ms-3 text-primary rounded-pill" data-view="${content.id}">See more</button>`;
    const updateBtn = `<button class="btnUpdate btn border-primary ms-3 text-primary  rounded-pill" data-update="${content.id}" type="button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>`;
    let date = new Date(content.created);
    let postedDate = date.toLocaleString("default", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
    newDivs += `
            <div class="bg-white rounded-3 p-3 p-lg-5 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="#">
                    <div class="rounded-circle bg-primary p-4 opacity-50" alt="Jakes profile picture"></div>
                        <p class="ps-3 mb-0 text-black">@ ${
                          content.author.name
                        }</p>
                    </a>
                </div>
                <p class="col-12 overflow-auto opacity-50">${postedDate}</p>
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

  outElement.innerHTML = newDivs;

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

// ----------------- Henter alle poster
let postCollection = [];
//console.log(postCollection);

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
    //console.log(response);
    const posts = await response.json();
    //console.log(posts);
    postCollection = posts;
    //console.log("Colletion:", postCollection);
    writePosts(posts, outElement);
  } catch (error) {
    console.warn(error);
  }
}

// Henter alle poster
getAllPosts(getAllPostsURL);

// ----------------------- Poster ny post

async function postPost(url, data) {
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

// -------- Validere Create post formet -------------------------- kanskje fjerne alt dette hvis jeg ikke fåt det til
const titleMsg = document.getElementById("title-msg");
const contentMsg = document.getElementById("content-msg");
const imageUrlMsg = document.getElementById("image-url-msg");

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

  /*imageUrlMsg.innerHTML = "";
  if (postMedia.value.trim() === "") {
    imageUrlMsg.innerHTML = "Show them with a valid image URL.";
  }*/
}
// --------------------------------------------------------------------------

// Poster posten når man klikker på knappen

submitPost.addEventListener("click", () => {
  const title = postTitle.value.trim();
  const body = postContent.value.trim();
  let media = postMedia.value.trim();
  if (media === "") media = "https://www.pngkey.com/maxpic/u2w7r5y3a9o0w7t4/";

  let postData = {
    title: title,
    body: body,
    media: media,
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

// -------------- søk på poster, navn, innhold osv

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", search);

function search() {
  const filterQuery = searchBar.value.toLowerCase();
  //console.log(filterQuery);

  const filteredList = postCollection.filter((post) => {
    //console.log(post.title, post.author, post.body);

    console.log(postCollection.length);
    const postTitle = post.title.toLowerCase();
    const postAuthor = post.author.name.toLowerCase();
    const postBody = post.body.toLowerCase();
    //console.log(postTitle, postAuthor, postBody);
    if (postTitle.indexOf(filterQuery) > -1) return true;
    if (postAuthor.indexOf(filterQuery) > -1) return true;
    if (postBody.indexOf(filterQuery) > -1) return true;
    return false;
  });

  writePosts(filteredList, posts);
}

// --------------- Last egne poster på profil side + brukernavn
