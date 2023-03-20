// ############### Catch All Element I need ################### //

let addTaskBtn = Array.from(document.querySelectorAll('.Board-Todo-List .Add-Task-Btn'));
let todoListsArray = Array.from(document.querySelectorAll('.Todo-List'));
let boardsTodoListArray = document.querySelectorAll('.Board-Todo-List');
let dragItem = null;


// ############### get Tasks From Local Storage Logic ################### //

if (window.localStorage.getItem("list-1") != null) {
  getTodoListsFromLocalStorage();
  setControlsEvents();
  setDragEvents();
}


// ############### Add New Task Logic ################### //

addTaskBtn.forEach(btn => {
  btn.addEventListener('click', function addTaskHandler(btn) {
    // Create new task
    let newTask = `
    <div class="task-cont" draggable="true" >
      <input class="task" type="text" placeholder="Enter task title" disabled="true">
      <div class="control-box">
        <button class="edit" name="edit button"><i class="fa-solid fa-pen"></i></button>
        <button class="remove" name="remove button"><i class="fa-solid fa-eraser"></i></button>
      </div>
    <div>`;
    let tasksList = this.parentElement.children[1];
    tasksList.innerHTML += newTask;
    setDragEvents();
    setControlsEvents();
  })
});


// ############### Controls Functions ################### //

function controlsDefaultMode(currentTask) {
  window.onclick = (e) => {
    if (!currentTask.contains(e.target)) {
      let editBtnArray = Array.from(document.querySelectorAll('.Todo-List .task-cont .control-box .edit'));
      editBtnArray.forEach(btn => {
        let allTasksInput = btn.parentElement.parentElement.children[0];
        allTasksInput.setAttribute('value', `${allTasksInput.value}`);
        allTasksInput.setAttribute('disabled', 'true');
        btn.classList.remove('hide');
        setListsToLocalStorage();
      })
    }
  }
}

function setControlsEvents() {
  let editBtnArray = Array.from(document.querySelectorAll('.Todo-List .task-cont .control-box .edit'));
  let removeBtnArray = Array.from(document.querySelectorAll('.Todo-List .task-cont .control-box .remove'));
  editBtnArray.forEach(btn => {
    btn.addEventListener('click', function () {
      let currentTask = this.parentElement.parentElement.children[0];
      let currentTaskContainer = this.parentElement.parentElement;
      currentTask.removeAttribute("disabled");
      currentTask.focus();
      this.classList.add('hide');
      controlsDefaultMode(currentTaskContainer);
    })
  });
  removeBtnArray.forEach(btn => {
    btn.addEventListener('click', function () {
      let currentTaskContainer = this.parentElement.parentElement;
      currentTaskContainer.remove();
      setListsToLocalStorage()
    })
  });
}

// ############### Drag & Drop Functions ################### //


function setDragEvents() {
  let TasksArray = document.querySelectorAll('.task-cont');
  TasksArray.forEach(task => {
    task.addEventListener('dragstart', dragstart);
    task.addEventListener('dragend', dragend);
    task.addEventListener('touchstart', function (e) {
      dragItem = this;
      this.style.opacity = '0.5';
      let taskinput = document.querySelector("input.task")
      inputTask.style.borderRadius = '1.5rem';
      ;[...e.changedTouches].forEach(touch => {
        this.style.top = `${touch.pageY / 100}px`;
        this.style.left = `${touch.pageX / 100}px`;
        this.id = touch.identifier;
      })
    });
    task.addEventListener('touchmove', function (e) {
      const style = getComputedStyle(task);
      const taskHight = parseInt(style.height);
      const taskWidth = parseInt(style.width);
      e.preventDefault();
      ;[...e.changedTouches].forEach(touch => {
        task.style.position = `absolute`;
        task.style.top = `${touch.pageY - (taskHight / 2)}px`;
        task.style.left = `${touch.pageX - (taskWidth / 2)}px`;
        task.id = touch.identifier;
        boardsTodoListArray.forEach(list => {
          if (list.offsetTop < touch.pageY) {
            let currentList = list.querySelector(".Todo-List");
            currentList.style.background = 'var(--Second-Background-Color)';
          } else {
            let currentList = list.querySelector(".Todo-List");
            currentList.style.background = 'transparent';
          }
        })
      })
    });
    task.addEventListener('touchend', function (e) {
      task.style.opacity = '1';
      ;[...e.changedTouches].forEach(touch => {
        task.style.position = `relative`;
        task.style.top = `0px`;
        task.style.left = `0px`;
        task.id = touch.identifier;
        boardsTodoListArray.forEach(list => {
          let currentList = list.querySelector(".Todo-List");
          currentList.style.background = 'transparent';
          if (list.offsetTop < touch.pageY && dragItem !== null) {
            let choosingList = list.querySelector(".Todo-List");
            choosingList.appendChild(dragItem);
          }
        });
        dragItem = null;
      })

      setListsToLocalStorage();
    });
    boardsTodoListArray.forEach(list => {
      list.addEventListener('dragover', dragover);
      list.addEventListener('dragleave', dragleave);
      list.addEventListener('drop', dragDrop);
    });
  })
  setListsToLocalStorage();
}

function dragstart() {
  dragItem = this;
  this.style.opacity = '0.5';
  this.style.borderRadius = '1.5rem';
}

function dragend() {
  dragItem = null;
  this.style.opacity = '1';
  setListsToLocalStorage();
}

function dragover(e) {
  let currentList = this.querySelector(".Todo-List");
  e.preventDefault();
  currentList.style.background = 'var(--Second-Background-Color)';
}

function dragleave() {
  let currentList = this.querySelector(".Todo-List");
  currentList.style.background = 'transparent';
}

function dragDrop() {
  let currentList = this.querySelector(".Todo-List");
  currentList.appendChild(dragItem);
  currentList.style.background = 'transparent';
}

// ############### Local Storage  Functions ################### //

function setListsToLocalStorage() {
  let tasksList = Array.from(document.querySelectorAll('.Todo-List'));
  let list0 = tasksList[0].innerHTML;
  let list1 = tasksList[1].innerHTML;
  let list2 = tasksList[2].innerHTML;
  window.localStorage.setItem("list-0", list0);
  window.localStorage.setItem("list-1", list1);
  window.localStorage.setItem("list-2", list2);
}

function getTodoListsFromLocalStorage() {
  todoListsArray[0].innerHTML = window.localStorage.getItem("list-0");
  todoListsArray[1].innerHTML = window.localStorage.getItem("list-1");
  todoListsArray[2].innerHTML = window.localStorage.getItem("list-2");
}
