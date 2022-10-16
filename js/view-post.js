// get the query string
const queryString = document.location.search;
// create an object that will allows us to access all the query string parameters
const params = new URLSearchParams(queryString);
// get the id parameter from the query string
const id = params.get("id");
//console.log(id);

const out = document.getElementById("post");

const API_BASE_URL = "https://nf-api.onrender.com";
const getPost = `${API_BASE_URL}/api/v1/social/posts/`;

const postUrl = `${getPost}${id}?_author=true`;
//console.log(postUrl);

// Henter ut aktuell post
async function getThisPost(url) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);

    const response = await fetch(url, options);
    //console.log(response);
    const post = await response.json();
    //console.log(post);
    listData(post);
  } catch (error) {
    console.warn(error);
  }
}

// Kaller funksjonen som henter poost
getThisPost(postUrl);

function listData(post) {
  out.innerHTML = "";
  const deleteBtn = `<button class="btnDelete btn btn-primary ms-3 text-secondary rounded-pill" data-delete="${post.id}">Delete</button>`;
  const feedBtn = `<a href="../home-feed.html" class="btnView btn border-primary ms-3 text-primary rounded-pill">Back to feed</a>`;
  const updateBtn = `<button class="btnUpdate btn border-primary ms-3 text-primary  rounded-pill" data-update="${post.id}" type="button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>`;
  let date = new Date(post.created);
  let postedDate = date.toLocaleString("default", {
    weekday: "long",
    day: "2-digit",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "numeric",
  });
  out.innerHTML += `
            <div class="bg-white rounded-3 p-5 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="#">
                    <div class="rounded-circle bg-primary p-4 opacity-50" alt="Jakes profile picture"></div>
                        <p class="ps-3 mb-0 text-black">@ ${
                          post.author.name
                        }</p>
                    </a>
                </div>
                <p class="opacity-50 mx-auto">${postedDate}</p>
                <h3>${post.title}</h3>
                <p class="col-12">${post.body}</p>
                <img class="rounded-3 mb-3" width="100%" src="${
                  post.media
                }" alt="">
                <div class="d-flex justify-content-end">
                    ${feedBtn}
                    ${
                      localStorage.getItem("username") === post.author.name
                        ? updateBtn
                        : ""
                    }
                    ${
                      localStorage.getItem("username") === post.author.name
                        ? deleteBtn
                        : ""
                    }
                </div>
            </div>
            `;
  const deleteBtns = document.querySelectorAll("button.btnDelete");
  for (let btnDelete of deleteBtns) {
    btnDelete.addEventListener("click", () => {
      //console.log(btnDelete.getAttribute("data-delete"));
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(btnDelete.getAttribute("data-delete"));
      }
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
}

// Funksjon som sletter posten, blir kalt leneger oppe ved delete-knapp
async function deletePost(id) {
  //console.log(id);
  const url = `${postUrl}`;
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    //console.log(url, options);
    const response = await fetch(url, options);
    //console.log(response);
    const answer = await response.json();
    //console.log(answer);
    if (response.status === 200) window.location = "../home-feed.html";
  } catch (error) {
    //console.log(error);
  }
}
