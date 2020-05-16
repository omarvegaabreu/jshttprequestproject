const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");
// console.log(fetchButton);

function httpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-tye": "application/json",
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          console.log(errorData);
          throw new Error("Oops something went wrong-server");
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error("Oops something went wrong");
    });
}

async function fetchPosts() {
  // console.log("fetch");
  try {
    const responseData = await httpRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );

    const listOfPosts = responseData;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true); //set true for deep clone
      postEl.querySelector("h2").textContent = post.title.toUpperCase();
      postEl.querySelector("p").textContent = post.body;
      postEl.querySelector("li").id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    alert("Something went wrong");
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  const post = {
    title: title,
    content: content,
    userId: userId,
  };
  httpRequest("POST", "https://jsonplaceholder.typicode.com/posts", post);
}
fetchButton.addEventListener("click", fetchPosts);
form.addEventListener("click", (event) => {
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;

  createPost(enteredTitle, enteredContent);
});

postList.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const postId = event.target.closest("li").id;
    httpRequest(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
