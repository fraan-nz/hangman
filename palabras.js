const words = [
	"Alura",
	"Lento",
	"Caballo",
	"Auto",
	"Examen",
	"Cubo",
	"Comida",
	"Abajo",
	"Alumno",
	"Perro",
	"Invierno",
];

export async function getWord() {
	try {
		let response = await fetch(
			"https://palabras-aleatorias-public-api.herokuapp.com/random"
		);
		let word = await response.json();
		return word.body.Word.toUpperCase();
	} catch (error) {
		console.log(error);
		let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
		return word;
	}
}
