const URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const userListContainer = document.querySelector(".user-list-container");
const serchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const dataPanel = document.querySelector("#data-panel");
const icon = document.querySelector("#view-selector");
const modal = document.querySelector("#userModal");
const genderBtn = document.querySelector("#gender-selector");

const USER_PER_PAGE = 16;
const users = [];
let filterUsers = [];
let filterGenders = [];
let page = 1;
let cardModel = true;
const SELECED_GENDER = {
  All: "all",
  MALE: "male",
  FEMALE: "female",
};
let genderAll = SELECED_GENDER.All;

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
  const addButton = document.querySelector(".modal-add-user");

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
    addButton.innerHTML = `<button type="button" class="btn btn-danger btn-add-user" data-id="${item.id}">+</button>`;
    modalImg.src = item.avatar;
  });
}

function renderUserList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    if (cardModel) {
      rawHTML += `<div class="grid col-sm-3">
    <div class="card mb-4">
        <img src="${item.avatar}" class="card-img-top" alt="..." />
          <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <button
          type="button"
          class="btn btn-primary card-btn btn-show-user"
          data-bs-toggle="modal"
          data-bs-target="#userModal"
          data-id="${item.id}"
        >More</button>
        <button type="button" class="btn btn-danger btn-add-user" data-id="${item.id}">+</button>
        </div>
      </div>
  </div>`;
    } else {
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
            class="btn btn-primary card-btn btn-show-user"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            data-id="${item.id}"
          >More</button>
          <button type="button" class="btn btn-danger btn-add-user" data-id="${item.id}">+</button>
      </div>
    </div>
  </div>
</div>
`;
    }
  });
  userListContainer.innerHTML = rawHTML;
}

function filterGender(users, gender) {
  filterGenders = users.filter((user) => user.gender === gender);
  renderUserList(getUserByPage(1, filterGenders));
  renderPaginator(filterGenders.length);
}

function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem("Favorite")) || [];
  const user = users.find((user) => user.id === id);
  if (favoriteList.some((user) => user.id === id)) {
    return alert(`${user.name}???????????????????????????`);
  }
  favoriteList.push(user);
  localStorage.setItem("Favorite", JSON.stringify(favoriteList));
}

function getUserByPage(page, data) {
  const startIndex = (page - 1) * USER_PER_PAGE;
  return data.slice(startIndex, startIndex + USER_PER_PAGE);
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

dataPanel.addEventListener("click", function onPanelClick(event) {
  event.preventDefault();
  if (event.target.matches(".btn-show-user")) {
    showUserModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-user")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

modal.addEventListener("click", function onModalClick(event) {
  event.preventDefault();
  if (event.target.matches(".btn-add-user")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

serchForm.addEventListener("submit", function onSearchPeople(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  switch (genderAll) {
    case SELECED_GENDER.MALE: {
      filterUsers = filterGenders.filter((user) =>
        user.name.toLowerCase().includes(keyword)
      );
      break;
    }
    case SELECED_GENDER.FEMALE: {
      filterUsers = filterGenders.filter((user) =>
        user.name.toLowerCase().includes(keyword)
      );
      break;
    }
    default: {
      filterUsers = users.filter((user) =>
        user.name.toLowerCase().includes(keyword)
      );
      break;
    }
  }
  if (filterUsers.length === 0) {
    return alert(`????????????????????????${keyword} ????????????????????????`);
  }
  renderUserList(getUserByPage(page, filterUsers));
  renderPaginator(filterUsers.length);
});

userListContainer.addEventListener("click", function onShowModal(event) {
  showUserModal(event.target.parentElement.parentElement.dataset.id);
});

paginator.addEventListener("click", function onPaginatorClick(event) {
  event.preventDefault();
  if (event.target.tagName !== "A") return;
  page = Number(event.target.dataset.page);

  switch (genderAll) {
    case SELECED_GENDER.MALE: {
      renderUserList(getUserByPage(page, filterGenders));
      break;
    }
    case SELECED_GENDER.FEMALE: {
      renderUserList(getUserByPage(page, filterGenders));
      break;
    }
    default: {
      renderUserList(getUserByPage(page, users));
      break;
    }
  }
});

icon.addEventListener("click", function onIconClick(event) {
  cardModel = event.target.matches(".card-view");

  switch (genderAll) {
    case SELECED_GENDER.MALE: {
      renderUserList(getUserByPage(page, filterGenders));
      break;
    }
    case SELECED_GENDER.FEMALE: {
      renderUserList(getUserByPage(page, filterGenders));
      break;
    }
    default: {
      renderUserList(getUserByPage(page, users));
      break;
    }
  }
});

genderBtn.addEventListener("click", function onGenderClick(event) {
  if (event.target.dataset.gender === "male") {
    filterGender(users, "male");
    genderAll = "male";
  } else if (event.target.dataset.gender === "female") {
    genderAll = "female";
    filterGender(users, "female");
  } else {
    genderAll = "all";
    renderUserList(getUserByPage(page, users));
    renderPaginator(users.length);
  }
});

axios.get(URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(getUserByPage(1, users));
  renderPaginator(users.length);
});
