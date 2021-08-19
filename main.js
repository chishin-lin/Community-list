const list = "https://lighthouse-user-api.herokuapp.com/api/v1/users";

const usersListContain = document.querySelector(".usersListContain");

const users = [];
axios.get(list).then((response) => {
  users.push(...response.data.results);
  renderUsersList(users);
  console.log(response);
});

function renderUsersList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="card" style="width: 18rem">
    <img src="${item.avatar}" class="card-img-top" alt="..." />
    <div class="card-body">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
      ${item.name} ${item.surname}
      </button>
    </div>
  </div>`;
  });

  usersListContain.appendChild(rawHTML);
}
