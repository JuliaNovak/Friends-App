const friendsList = document.querySelector(".friends-list");
const friendCard = document.createElement("div");
friendCard.classList.add(".friend-card");
let usersData = [];
const url = "https://randomuser.me/api/?results=100";

function fetchUrl() {
   fetch(url)
      .then((response) => response.json())
      .then((data) => {
         usersData = data.results;
         render(usersData);
      })
      .catch((error) => print(error));
}
fetchUrl();

function render(usersArray) {
   friendsList.innerHTML = "";
   usersArray.map((user) => {
      friendsList.innerHTML += `<div class='friend-card'>
    <img class='friend-avatar' src='${user.picture.large}'/>
    <p class='friends-info name'>${user.name.first} ${user.name.last}</p>
    <p class='friends-info'>${user.gender}, ${user.dob.age}y.o.</p>
    <p class='friends-info'>${user.phone}</p>
    <p class='friends-info'>${user.email}</p>
    </div>`;
   });
}

let optionsForFilter = {};

const searchInput = document.querySelector(".search-input");
function filterByInput() {
   optionsForFilter.name = searchInput.value.toLowerCase();
   prepareUsersToRender();
}
searchInput.addEventListener("keyup", filterByInput);

const sexRadioButtons = document.querySelectorAll(".gender_btn");
function onGenderSelected() {
   for (const radioButton of sexRadioButtons) {
      if (radioButton.checked) {
         optionsForFilter.gender = radioButton.id;
      }
   }
   prepareUsersToRender();
}

function prepareUsersToRender() {
   render(sortUsers(filterUsers()));
}

function filterUsers() {
   let filteredUsers = usersData;
   if (optionsForFilter.name) {
      filteredUsers = filteredUsers.filter((user) => {
         let userName = `${user.name.first} ${user.name.last}`
            .toLowerCase()
            .includes(optionsForFilter.name);
         return userName;
      });
   }
   if (optionsForFilter.gender) {
      filteredUsers = filteredUsers.filter((user) => {
         const userGender = optionsForFilter.gender;
         if (user.gender === userGender || userGender === "all") {
            return user;
         }
      });
   }
   return filteredUsers;
}

function sortUsers(filteredUsers) {
   if (optionsForFilter.sort && optionsForFilter.sort.includes("sortAge")) {
      filteredUsers = filteredUsers.sort((a, b) => {
         [a, b] =
            optionsForFilter.sort === "sortAge-descending" ? [b, a] : [a, b];
         return a.dob.age - b.dob.age;
      });
   }
   if (optionsForFilter.sort && optionsForFilter.sort.includes("sortAlph")) {
      filteredUsers = filteredUsers.sort((a, b) => {
         [a, b] =
            optionsForFilter.sort === "sortAlph-descending" ? [b, a] : [a, b];
         return a.name.first.localeCompare(b.name.first);
      });
   }
   return filteredUsers;
}

Array.from(sexRadioButtons, (button) =>
   button.addEventListener("click", onGenderSelected)
);

const ageRadioButtons = document.querySelectorAll(".radio-age");
function sortByAge() {
   for (const button of ageRadioButtons) {
      let buttonValue = button.value;
      if (button.checked) {
         buttonValue === "age-descending"
            ? (optionsForFilter.sort = "sortAge-descending")
            : (optionsForFilter.sort = "sortAge-ascending");
      }
   }
   prepareUsersToRender();
}
Array.from(ageRadioButtons, (button) =>
   button.addEventListener("click", sortByAge)
);

const nameRadioButtons = document.querySelectorAll(".radio-name");
function sortByAlphabet() {
   for (const button of nameRadioButtons) {
      let buttonValue = button.value;
      if (button.checked) {
         buttonValue === "name-descending"
            ? (optionsForFilter.sort = "sortAlph-descending")
            : (optionsForFilter.sort = "sortAlph-ascending");
      }
   }
   prepareUsersToRender();
}

Array.from(nameRadioButtons, (button) =>
   button.addEventListener("click", sortByAlphabet)
);

const resetButton = document.querySelector(".reset-btn");
function resetFilters() {
   searchInput.value = "";
   sexRadioButtons.forEach(
      (button) => (button.checked = button.id.checked = "all")
   );
   ageRadioButtons.forEach((button) => (button.checked = false));
   nameRadioButtons.forEach((button) => (button.checked = false));
   render(usersData);
}

resetButton.addEventListener("click", resetFilters);
