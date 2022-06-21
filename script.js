import { getWord } from "./palabras.js";

const wordContainer = document.getElementById("word__container");
const startButton = document.getElementById("start");
const screen = document.getElementById("playing");
const modal = document.getElementById("modal");
const modalScreen = document.getElementById("screenModal");
const keyboard = document.getElementById("keyboard");
const letterKey = document.querySelectorAll(".letter__btn");

let canvas = document.getElementById("hanged");
let ctx = canvas.getContext("2d");
ctx.canvas.width = 0;
ctx.canvas.height = 0;

const bodyParts = [
	[4, 2, 1, 1],
	[4, 3, 1, 2],
	[3, 5, 1, 1],
	[5, 5, 1, 1],
	[3, 3, 1, 1],
	[5, 3, 1, 1],
];

let panda = "panda";
let selectedWord;
let usedLetters;
let mistakes;
let hits;

const selectRandomWord = async () => {
	let word = await getWord();
	return word.split("");
};

const startGame = async () => {
	selectedWord = await selectRandomWord();
	modalScreen.style.display = "none";
	screen.style.display = "flex";
	letterKey.forEach((key) => {
		key.classList.remove("disabled");
	});
	usedLetters = [];
	mistakes = 0;
	hits = 0;
	wordContainer.innerHTML = "";
	startButton.style.display = "none";
	drawHang();
	drawWord();
	keyboard.addEventListener("click", displayKeyboard);
	document.addEventListener("keydown", letterEvent);
};

const addLetter = (letter) => {
	const letterElement = document.createElement("span");
	letterElement.innerHTML = letter.toUpperCase();
};

const addBodyPart = (bodyPart) => {
	ctx.fillStyle = "#fff";
	ctx.fillRect(...bodyPart);
};

const wrongLetter = () => {
	addBodyPart(bodyParts[mistakes]);
	mistakes++;
	if (mistakes === bodyParts.length) endGame("defeat");
};

const showModal = (result) => {
	modalScreen.style.display = "flex";
	if (result === "victory") {
		modal.innerHTML = `<h3>Ganaste!</h3>
        <p>La palabra era ${selectedWord.join("")}</p>
        <div>
        <button id="new" >Volver a Jugar</button>
        <button><a href="/">Salir</a></button>
        </div>`;
	}
	if (result === "defeat") {
		modal.innerHTML = `<h3>Perdiste!</h3>
        <p>La palabra era ${selectedWord.join("")}</p>
        <div>
        <button id="new">Volver a Jugar</button>
        <button><a href="/">Salir</a></button>
        </div>`;
	}
	document.getElementById("new").addEventListener("click", startGame);
};

const endGame = (result) => {
	document.removeEventListener("keydown", letterEvent);
	showModal(result);
};

const correctLetter = (letter) => {
	const { children } = wordContainer;
	for (let i = 0; i < children.length; i++) {
		if (children[i].innerHTML === letter) {
			children[i].classList.toggle("hidden");
			hits++;
		}
	}
	if (hits === selectedWord.length) endGame("victory");
};

const letterInput = (letter) => {
	if (selectedWord.includes(letter)) {
		correctLetter(letter);
	} else {
		wrongLetter();
	}
	addLetter(letter);
	usedLetters.push(letter);
};

const disableKey = (letter) => {
	letterKey.forEach((key) => {
		if (key.innerHTML.toUpperCase() === letter) {
			key.classList.add("disabled");
		}
	});
};

const displayKeyboard = (event) => {
	let newLetter = event.target.innerHTML.toUpperCase();
	if (
		newLetter.match(/^[a-zñ]$/i) &&
		!usedLetters.includes(newLetter) &&
		mistakes < bodyParts.length
	) {
		letterInput(newLetter);
		disableKey(newLetter);
	}
};

const letterEvent = (event) => {
	let newLetter = event.key.toUpperCase();
	if (
		newLetter.match(/^[a-zñ]$/i) &&
		!usedLetters.includes(newLetter) &&
		mistakes < bodyParts.length
	) {
		letterInput(newLetter);
		disableKey(newLetter);
	}
};

const drawWord = () => {
	selectedWord.forEach((letter) => {
		const letterElement = document.createElement("span");
		letterElement.innerHTML = letter.toUpperCase();
		letterElement.classList.add("letter");
		letterElement.classList.add("hidden");
		wordContainer.appendChild(letterElement);
	});
};

const drawHang = () => {
	ctx.canvas.width = 120;
	ctx.canvas.height = 160;
	ctx.scale(20, 20);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#d95d39";
	ctx.fillRect(0, 7, 4, 1);
	ctx.fillRect(1, 0, 1, 8);
	ctx.fillRect(2, 0, 3, 1);
	ctx.fillRect(4, 1, 1, 1);
};

startButton.addEventListener("click", startGame);
