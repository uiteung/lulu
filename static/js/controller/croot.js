import { token } from "./cookies";

// Jika token null maka diarahkan ke euis.ulbi.ac.id
if (token === "") {
	window.location.assign("https://euis.ulbi.ac.id");
}