const URL = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const userListContainer = document.querySelector(".user-list-container");

const users = [];

function showUserModal(id) {
  const name = document.querySelector(".modal-name");
  const email = document.querySelector(".email");
  const gender = document.querySelector(".gender");
  const age = document.querySelector(".age");
  const birthDay = document.querySelector(".birthDay");
  const modalImg = document.getElementById("modal-img");
  const updated = document.querySelector(".updated");
  const created = document.querySelector(".created");

  axios.get(`${URL}${id}`).then((response) => {
    const item = response.data;

    name.innerText = `${item.name} ${item.surname}`;
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
    rawHTML += `<div class="card" style="width: 12rem" data-id="${item.id}">
        <img src="${item.avatar}" class="cardimg " alt="..."  data-bs-toggle="modal"
        data-bs-target="#userModal"/>
        <div class="card-body card-btn" data-id="${item.id}">
          <button
            type="button"
            class="btn btn-primary btn-center"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
          >${item.name} ${item.surname}</button>
        </div>
      </div>
`;
  });

  userListContainer.innerHTML = rawHTML;
}

userListContainer.addEventListener("click", function showModal(event) {
  console.log(event.target.parentElement);
  showUserModal(event.target.parentElement.dataset.id);
});

axios.get(URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(users);
});
