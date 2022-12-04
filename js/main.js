// find form
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const listOfTasks = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
}
tasks.forEach(item => {

	const cssClass = item.done ? 'task-title task-title--done' : 'task-title';

	const taskHtml = `<li id ="${item.id}"class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${item.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
	listOfTasks.insertAdjacentHTML('beforeend', taskHtml);
});

checkList();
//
form.addEventListener("submit", addTask);
listOfTasks.addEventListener("click", deleteTask);
listOfTasks.addEventListener("click", doneTask);

function addTask(e) {
	const target = e.target;
	e.preventDefault();
	const taskText = taskInput.value;

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false,
	}

	tasks.push(newTask);
	saveToLS();


	const cssClass = newTask.done ? 'task-title task-title--done' : 'task-title';

	const taskHtml = `<li id ="${newTask.id}"class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${newTask.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;
	listOfTasks.insertAdjacentHTML('beforeend', taskHtml);
	taskInput.value = "";
	taskInput.focus();

	checkList();
};


function deleteTask(e) {
	if (e.target.dataset.action != 'delete') return;
	const parentNode = e.target.closest('.list-group-item');

	//local storage delete tasks=====================================================================
	const id = +parentNode.id;
	const index = tasks.findIndex((task) => task.id === id);
	tasks.splice(index, 1);
	saveToLS();
	//========================================================================================================================================================
	parentNode.remove();

	checkList();
}

function doneTask(e) {
	e.preventDefault();
	const target = e.target;
	if (target.dataset.action != 'done') return;
	const parentNode = target.closest('.list-group-item');

	const id = +parentNode.id;
	const task = tasks.find((item) => {
		if (item.id == id) {
			return true;
		}
	});

	task.done = !task.done;
	saveToLS();
	const taskTitle = parentNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
}

function checkList() {
	if (tasks.length == 0) {
		const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li> `
		listOfTasks.insertAdjacentHTML('afterbegin', emptyListHtml);
	}
	if (tasks.length > 0) {
		const emptyListElement = document.querySelector('#emptyList');
		emptyListElement ? emptyListElement.remove() : null;
	}
}

function saveToLS() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}