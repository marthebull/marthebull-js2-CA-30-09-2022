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

const url = `${getPost}${id}`;

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
