window.onload = () => {
  fetchData();
  addTodos();
  updateData();
};

// global variables
let item_task = "";
let inserted_id = '';

// add todos
const addTodos = () => {
  document.querySelector("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.querySelector("#todo-input");
    const taskObj = JSON.stringify({
      task: taskInput.value,
    });

    fetch("http://localhost:4000/task", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify JSON data
      },
      body: taskObj, // Convert the data to a JSON string
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
    fetchData();
    taskInput.value = "";
  });
};

const fetchData = () => {
  const todo_box = document.querySelector("#todo-box");
  fetch("http://localhost:4000/api")
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
      todo_box.innerHTML = "";
      data.data.map((item) => {
        todo_box.innerHTML += `
        <div class=" flex justify-between items-center gap-5 p-3 rounded-md">
                <span class="text-2xl" aria-inserted="${item._id}">${item.task}</span>
                <span class="text-2xl">
                    <i class="fa-solid fa-pen-to-square text-green-500 mr-2 cursor-pointer" id="edit"></i>
                    <i class="fa-solid fa-trash text-rose-500 cursor-pointer" id="delete"></i>
                </span>
            </div>`;
      });
    })
    .catch((error) => console.log(error));

  //add eventlistner for edit and delete
  todo_box.addEventListener("click", (e) => {
    if (e.target.id === "edit") {
      const taskSpan =
        e.target.parentElement.parentElement.querySelector("span:first-child");
      document.querySelector("#modal").classList.remove("hidden");
      document.querySelector("#modal").classList.add("flex");
      item_task = taskSpan.textContent;
      inserted_id = taskSpan.getAttribute('aria-inserted');
      document.querySelector("#model-input").value = item_task;
    } else if (e.target.id === "delete") {
      const taskSpan =
        e.target.parentElement.parentElement.querySelector("span:first-child");
        inserted_id = taskSpan.getAttribute('aria-inserted');

      const updateObj = JSON.stringify({ insertedId : inserted_id });
    fetch("http://localhost:4000/delete", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify JSON data
        },
        body: updateObj, // Convert the data to a JSON string
      }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetchData();
    })
      .catch((error) => console.error(error));


    }
  });

  // model coding start
  document.querySelector("#modal").addEventListener("click", (e) => {
    if (
      e.target.id === "close-modal" ||
      e.target.id === "cancel-btn" ||
      e.target.parentElement.tagName === "BODY"
    ) {
      document.querySelector("#modal").classList.remove("flex");
      document.querySelector("#modal").classList.add("hidden");
    }
  });
};

// updateData
const updateData = () => {
  document.querySelector("#confirm-btn").addEventListener("click", () => {
    const inputValue = document.querySelector("#model-input").value;
    const updateObj = JSON.stringify({
        task: inputValue,
        insertedId : inserted_id
    });
    fetch("http://localhost:4000/update", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // Specify JSON data
        },
        body: updateObj, // Convert the data to a JSON string
      }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.querySelector("#modal").classList.remove("flex");
        document.querySelector("#modal").classList.add("hidden");
        fetchData();
    })
      .catch((error) => console.error(error));
    
  });
};
