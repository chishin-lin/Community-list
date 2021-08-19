const apiData = "https://lighthouse-user-api.herokuapp.com/api/v1/users/";

const userListContain = document.querySelector(".userListContain");

const users = [];

function showUserModal(id) {
  const name = document.querySelector(".modal-name");
  const email = document.querySelector(".email");
  const gender = document.querySelector(".gender");
  const age = document.querySelector(".age");
  const birthDay = document.querySelector(".birthDay");
  const modalImg = document.querySelector("#Img");
  const updated = document.querySelector(".updated");
  const created = document.querySelector(".created");
  axios.get(apiData + id).then((response) => {
    const item = response.data;
    name.innerText = `${item.name} ${item.surname}`;
    email.innerText = `Email: ${item.email}`;
    gender.innerText = `Gender: ${item.gender}  `;
    age.innerText = `Age: ${item.age}  `;
    birthDay.innerText = `Birthday${item.birthday}`;
    updated.innerText = `updated_at: ${item.updated_at}`;
    created.innerText = `created_at: ${item.created_at}`;
    modalImg.innerHTML = `<img id="modalImg " src="${item.avatar}" class="img-fluid rounded-start" alt="..." />`;
  });
}
function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="card" style="width: 18rem" data-id="${item.id}">
    <img src="${item.avatar}" class="card-img-top modalImg" alt="..."  data-bs-toggle="modal"
    data-bs-target="#userModal"/>
    <div class="card-body" data-id="${item.id}">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#userModal"
      >
      ${item.name} ${item.surname}
      </button>
    </div>
  </div>`;
  });

  userListContain.innerHTML = rawHTML;
}

userListContain.addEventListener("click", (event) => {
  showUserModal(event.target.parentElement.dataset.id);
});

axios.get(apiData).then((response) => {
  users.push(...response.data.results);
  renderUserList(users);
});
