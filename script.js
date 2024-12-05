// Sélection du canvas
const canvas = document.getElementById("jeu"); // Récupère l'élément <canvas> avec l'id "jeu"
const ctx = canvas.getContext("2d"); // Crée un contexte 2D pour dessiner sur le canvas

// Variables globales
let joueur = { x: 50, y: 180, width: 20, height: 20, speed: 5, dy: 0 };
// Objet représentant le joueur avec sa position (x, y), ses dimensions (width, height), sa vitesse, et son déplacement vertical (dy)
let obstacles = []; // Tableau pour stocker les obstacles
let score = 0; // Compteur pour le score
let gameOver = false; // Booléen pour vérifier si le jeu est terminé

// Générer des obstacles
function creerObstacle() {
    // Crée un nouvel obstacle avec une position aléatoire en hauteur et l'ajoute au tableau "obstacles"
    const obstacle = {
        x: canvas.width, // Position initiale à droite du canvas
        y: Math.random() * (canvas.height - 30), // Hauteur aléatoire
        width: 30, // Largeur de l'obstacle
        height: 30, // Hauteur de l'obstacle
        speed: 4 // Vitesse de déplacement de l'obstacle
    };
    obstacles.push(obstacle);
}

// Mise à jour des obstacles
function updateObstacles() {
    for (let obs of obstacles) {
        obs.x -= obs.speed; // Déplace chaque obstacle vers la gauche

        // Vérifie les collisions entre le joueur et les obstacles
        if (
            joueur.x < obs.x + obs.width && // Collision côté gauche
            joueur.x + joueur.width > obs.x && // Collision côté droit
            joueur.y < obs.y + obs.height && // Collision par le haut
            joueur.y + joueur.height > obs.y // Collision par le bas
        ) {
            gameOver = true; // Si une collision est détectée, le jeu est terminé
        }
    }
    // Supprime les obstacles qui sortent du canvas
    obstacles = obstacles.filter(obs => obs.x > -obs.width);

    // Ajoute un nouvel obstacle toutes les 2 secondes
    if (score % 120 === 0) { // 120 frames ≈ 2 secondes à 60 fps
        creerObstacle();
    }
}

// Mise à jour du joueur
function updateJoueur() {
    joueur.y += joueur.dy; // Met à jour la position verticale du joueur

    // Empêche le joueur de sortir des limites du canvas
    if (joueur.y < 0) joueur.y = 0; // Bord supérieur
    if (joueur.y + joueur.height > canvas.height) joueur.y = canvas.height - joueur.height; // Bord inférieur
}

// Dessiner les éléments
function dessiner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas avant chaque nouvelle image

    // Dessiner le joueur
    ctx.fillStyle = "white"; // Couleur blanche pour le joueur
    ctx.fillRect(joueur.x, joueur.y, joueur.width, joueur.height);

    // Dessiner les obstacles
    ctx.fillStyle = "red"; // Couleur rouge pour les obstacles
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // Afficher le score
    ctx.fillStyle = "yellow"; // Couleur jaune pour le texte
    ctx.font = "20px Arial"; // Police et taille du texte
    ctx.fillText(`Score: ${score}`, 10, 20); // Affiche le score en haut à gauche
}

// Gestion des entrées clavier
function keyDown(e) {
    // Modifie la direction verticale du joueur en fonction des touches pressées
    if (e.key === "ArrowUp") joueur.dy = -joueur.speed; // Monter
    if (e.key === "ArrowDown") joueur.dy = joueur.speed; // Descendre
}

function keyUp(e) {
    // Arrête le mouvement vertical si les touches sont relâchées
    if (e.key === "ArrowUp" || e.key === "ArrowDown") joueur.dy = 0;
}

// Boucle principale du jeu
function boucle() {
    if (gameOver) {
        // Affiche "Game Over" si le jeu est terminé
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return; // Arrête la boucle
    }

    score++; // Incrémente le score à chaque frame
    updateJoueur(); // Met à jour le joueur
    updateObstacles(); // Met à jour les obstacles
    dessiner(); // Dessine les éléments à l'écran

    requestAnimationFrame(boucle); // Demande l'exécution de la boucle à la prochaine frame
}

// Lancer le jeu
document.addEventListener("keydown", keyDown); // Ajoute un écouteur d'événements pour détecter les touches pressées
document.addEventListener("keyup", keyUp); // Ajoute un écouteur d'événements pour détecter les touches relâchées
creerObstacle(); // Crée un premier obstacle
boucle(); // Démarre la boucle du jeu
