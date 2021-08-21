const URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const userListContainer = document.querySelector(".user-list-container");
const serchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const USER_PER_PAGE = 10;

const users = JSON.parse(localStorage.getItem("Favorite"));
let filterUsers = [];

function showUserModal(id) {
  const modalName = document.querySelector(".card-name");
  const modalTitle = document.querySelector(".modal-title");

  const email = document.querySelector(".email");
  const gender = document.querySelector(".gender");
  const age = document.querySelector(".age");
  const birthDay = document.querySelector(".birthDay");
  const modalImg = document.getElementById("modal-img");
  const updated = document.querySelector(".updated");
  const created = document.querySelector(".created");

  axios.get(`${URL}${id}`).then((response) => {
    const item = response.data;

    modalName.innerText = `${item.name} ${item.surname}`;
    modalTitle.innerText = `${item.name} ${item.surname}`;
    email.innerText = `Email: ${item.email}`;
    gender.innerText = `Gender: ${item.gender}  `;
    age.innerText = `Age: ${item.age}  `;
    birthDay.innerText = `Birthday${item.birthday}`;
    updated.innerText = `updated_at:${item.updated_at}`;
    created.innerText = `${item.created_at}`;
    modalImg.src = item.avatar;
  });
}

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="card mb-3" style="max-width: 450px;">
  <div class="row g-0" data-id="${item.id}">
    <div class="col-md-4">
      <img src="${item.avatar}" class="img-fluid rounded-start" alt="..." data-bs-toggle="modal"
      data-bs-target="#userModal">
    </div>
    <div class="col-md-8" data-id="${item.id}>
      <div class="card-body">
        <h5 class="card-title">${item.name} </h5>
        <button
            type="button"
            class="btn btn-primary card-btn"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
          >More</button>
          <button type="button" class="btn btn-danger">+</button>
      </div>
    </div>
  </div>
</div>
`;
  });

  userListContainer.innerHTML = rawHTML;
}

function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem("Favorite")) || [];
  const user = users.filter((user) => user.id === id);
  if (favoriteList.some((user) => user.id === id)) {
    return alert(`${user}已在好友清單中囉！`);
  }
  favoriteList.push(user);
  localStorage.setItem("Favorite", JSON.stringify(favoriteList));
}

function getUserByPage(page) {
  const startIndex = (page - 1) * USER_PER_PAGE;
  // const data = filterMovies.length ? filterMovies : movies;
  return users.slice(startIndex, startIndex + USER_PER_PAGE);
}

function renderPaginator(amount) {
  console.log(amount);
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

serchForm.addEventListener("submit", function onSearchPeople(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filterUsers = users.filter((user) =>
    user.name.toLowerCase().includes(keyword)
  );

  if (filterUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的人`);
  }
  renderUserList(filterUsers);
});

userListContainer.addEventListener("click", function onShowModal(event) {
  showUserModal(event.target.parentElement.parentElement.dataset.id);
});

paginator.addEventListener("click", function onPaginatorClick(event) {
  event.preventDefault();
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.page);
  renderUserList(getUserByPage(page));
});

renderUserList(users);
