// get the query string
const queryString = document.location.search;
// create an object that will allows us to access all the query string parameters
const params = new URLSearchParams(queryString);
// get the id parameter from the query string
const id = params.get("id");
console.log(id);

const out = document.getElementById("post");

const API_BASE_URL = "https://nf-api.onrender.com";
const getPost = `${API_BASE_URL}/api/v1/social/posts/`;

const postUrl = `${getPost}${id}?_author=true`;
//console.log(postUrl);

async function getThisPost(url) {
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
    console.log(response);
    const post = await response.json();
    console.log(post);
    listData(post);
  } catch (error) {
    console.warn(error);
  }
}

// Kaller funksjonen som henter poost
getThisPost(postUrl);

function listData(post) {
  out.innerHTML = "";
  const deleteBtn = `<button class="btnDelete btn btn-primary ms-3 text-secondary rounded-pill" data-delete="${post.id}">DELETE</button>`;
  const feedBtn = `<a href="../home-feed.html" class="btnView btn border-primary ms-3 text-primary rounded-pill">BACK TO FEED</a>`;
  const updateBtn = `<button class="btnUpdate btn border-primary ms-3 text-primary  rounded-pill" data-update="${post.id}" type="button" data-bs-toggle="modal" data-bs-target="#editModal">EDIT</button>`;
  out.innerHTML += `
            <div class="bg-white rounded-3 p-5 mb-3">
                <div>
                    <a class="d-flex align-items-center mb-4 text-decoration-none" href="../profile.html">
                        <p class=" mb-0 text-black">@ ${post.author.name}</p>
                    </a>
                </div>
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
      console.log(btnDelete.getAttribute("data-delete"));
      if (confirm("Are you sure you want to delete this post?")) {
        deletePost(btnDelete.getAttribute("data-delete"));
      }
    });
  }
}

// Funksjon som sletter posten, blir klat leneger oppe
async function deletePost(id) {
  console.log(id);
  const url = `${postUrl}${id}`;
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
