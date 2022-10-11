// Ny side edit-post.html?id=${id}
//GET post title, body og img, sette de inn i et form.innerHTML
//sette på eventlistener på publish changes som PUTer fra inputfeltene (som på create post)

// get the query string
const queryString = document.location.search;
// create an object that will allows us to access all the query string parameters
const params = new URLSearchParams(queryString);
// get the id parameter from the query string
const id = params.get("id");
console.log(id);

const editForm = document.getElementById("edit-form");

const API_BASE_URL = "https://nf-api.onrender.com";
const getPost = `${API_BASE_URL}/api/v1/social/posts/`;

const postUrl = `${getPost}${id}?_author=true`;
console.log(postUrl);

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

const editUsername = document.getElementById("edit-username");
const createdDate = document.getElementById("created");
const editTitle = document.getElementById("edit-title");
const editContent = document.getElementById("edit-content");
const editMedia = document.getElementById("edit-media");
const submitChanges = document.getElementById("submit-edit");

function listData(post) {
  console.log(post);
  editUsername.innerHTML = `${post.author.name}`;
  createdDate.innerHTML = `${post.created}`;
  editTitle.innerHTML = `${post.title}`;
  editContent.innerHTML = `${post.body}`;
  editMedia.innerHTML = `${post.media}`;
}

// Funksjon som endrer posten, blir kalt leneger oppe

async function updatePost(id) {
  const data = {
    title: editTitle.value,
    body: editContent.value,
    media: editMedia.value,
  };
  console.log(data);
  console.log(id);
  const putUrl = `${postUrl}`;
  try {
    const accessToken = localStorage.getItem("accessToken");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    };
    console.log(putUrl, options);
    const response = await fetch(putUrl, options);
    console.log(response);
    const answer = await response.json();
    console.log(answer);
    if (response.status === 200) window.location = "../home-feed.html";
  } catch (error) {
    console.log(error);
  }
}

submitChanges.addEventListener("click", () => {
  console.log("heihei");
  updatePost(id);
});
