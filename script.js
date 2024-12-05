// Sélection du canvas
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");

// Variables globales
let joueur = { x: 50, y: 180, width: 20, height: 20, speed: 5, dy: 0 };
let obstacles = [];
let score = 0;
let gameOver = false;

// Générer des obstacles
function creerObstacle() {
    const obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: 4
    };
    obstacles.push(obstacle);
}

// Mise à jour des obstacles
function updateObstacles() {
    for (let obs of obstacles) {
        obs.x -= obs.speed;

        // Collision
        if (
            joueur.x < obs.x + obs.width &&
            joueur.x + joueur.width > obs.x &&
            joueur.y < obs.y + obs.height &&
            joueur.y + joueur.height > obs.y
        ) {
            gameOver = true;
        }
    }
    obstacles = obstacles.filter(obs => obs.x > -obs.width);

    // Ajouter un obstacle toutes les 2 secondes
    if (score % 120 === 0) {
        creerObstacle();
    }
}

// Mise à jour du joueur
function updateJoueur() {
    joueur.y += joueur.dy;

    // Limites du canvas
    if (joueur.y < 0) joueur.y = 0;
    if (joueur.y + joueur.height > canvas.height) joueur.y = canvas.height - joueur.height;
}

// Dessiner les éléments
function dessiner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    ctx.fillStyle = "white";
    ctx.fillRect(joueur.x, joueur.y, joueur.width, joueur.height);

    // Dessiner les obstacles
    ctx.fillStyle = "red";
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Afficher le score
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// Gestion des entrées clavier
function keyDown(e) {
    if (e.key === "ArrowUp") joueur.dy = -joueur.speed;
    if (e.key === "ArrowDown") joueur.dy = joueur.speed;
}

function keyUp(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") joueur.dy = 0;
}

// Boucle principale du jeu
function boucle() {
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return;
    }

    score++;
    updateJoueur();
    updateObstacles();
    dessiner();

    requestAnimationFrame(boucle);
}

// Lancer le jeu
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
creerObstacle();
boucle();
