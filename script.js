// Sélection du canvas
const canvas = document.getElementById("jeu");
const ctx = canvas.getContext("2d");

// Variables globales
let joueur = { x: 50, y: 180, width: 70, height: 50, speed: 5, dy: 0 };
let obstacles = [];
let vagues = [];
let balles = []; // Tableau pour stocker les balles
let score = 0;
let gameOver = false;
let vitesseBase = 4;
let vies = 3;
let dernierTir = 0; // Initialisé à 0
const delaiEntreTirs = 2500; // Délai en millisecondes (3 secondes)

// Ajout des tableaux pour les nouveaux objets
let coeurs = []; // Tableau pour les cœurs
let bombes = []; // Tableau pour les bombes
let tonneaux = []; // Tableau pour les tonneaux

let ia = { x: canvas.width - 50, y: canvas.height / 2, width: 20, height: 20, speed: 2, dy: 0 };


const obstacleImage = new Image();
const balleImage = new Image();
const coeurImage = new Image();
const bombeImage = new Image();
const tonneauImage = new Image();
const joueurImage = new Image();
const vagueImage = new Image();
obstacleImage.src = 'tronc_d_arbre.png';
balleImage.src = 'canon_ball.png';
coeurImage.src = 'coeur.png';
bombeImage.src = 'bombe.png';
tonneauImage.src = 'tonneau.png';
joueurImage.src = 'joueur.png';
vagueImage.src = 'vague.png';

let imagesChargees = false;

// Attendre que toutes les images soient chargées
obstacleImage.onload = balleImage.onload = function () {
    imagesChargees = true;
};

// Générer des obstacles
function creerObstacle() {
    const obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 50,
        height: 100,
        speed: vitesseBase/1.65,
        image: obstacleImage
    };
    obstacles.push(obstacle);
}

// Mise à jour des obstacles
function updateObstacles() {
    for (let obs of obstacles) {
        obs.x -= obs.speed;

        // Vérifie les collisions avec le joueur
        if (
            joueur.x < obs.x + obs.width &&
            joueur.x + joueur.width > obs.x &&
            joueur.y < obs.y + obs.height &&
            joueur.y + joueur.height > obs.y
        ) {
            vies--;
            obstacles = obstacles.filter(o => o !== obs);
            if (vies <= 0) {
                gameOver = true;
            }
        }
    }

    obstacles = obstacles.filter(obs => obs.x > -obs.width);
    vitesseBase = 4 + Math.floor(score / 2500);

    if (score % 100 === 0) {
        creerObstacle();
    }
}

function creerVague() {
    const vague = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 200,
        height: 100,
        speed: 7,
        image: vagueImage
    };
    vagues.push(vague);
}

function updateVagues() {
    for (let vague of vagues) {
        vague.x -= vague.speed;

        // Vérifie les collisions avec le joueur
        if (
            joueur.x < vague.x + vague.width &&
            joueur.x + joueur.width > vague.x &&
            joueur.y < vague.y + vague.height &&
            joueur.y + joueur.height > vague.y
        ) {
            vies -= 2;
            vagues = vagues.filter(o => o !== vague);
            if (vies <= 0) {
                gameOver = true;
            }
        }
    }

    vagues = vagues.filter(vague => vague.x > -vague.width);

    if (score % 1000 === 999) {
        creerVague();
    }
}

// Mise à jour des balles
function updateBalles() {
    for (let balle of balles) {
        balle.x += balle.speed;

        // Supprime la balle si elle sort du canvas
        if (balle.x > canvas.width) {
            balles = balles.filter(b => b !== balle);
        }

        // Vérifie les collisions avec les obstacles
        for (let obs of obstacles) {
            if (
                balle.x < obs.x + obs.width &&
                balle.x + balle.width > obs.x &&
                balle.y < obs.y + obs.height &&
                balle.y + balle.height > obs.y
            ) {
                obstacles = obstacles.filter(o => o !== obs); // Supprime l'obstacle touché
                balles = balles.filter(b => b !== balle); // Supprime la balle
                break; // Passe à la balle suivante
            }
        }
    }
}

// Mise à jour du joueur
function updateJoueur() {
    joueur.y += joueur.dy;

    if (joueur.y < 0) joueur.y = 0;
    if (joueur.y + joueur.height > canvas.height) joueur.y = canvas.height - joueur.height;
}

let balle = null; // Variable pour stocker la balle

function tirerBalle() {
    const maintenant = Date.now(); // Récupère l'heure actuelle en millisecondes
    if (maintenant - dernierTir >= delaiEntreTirs) {
        // Si le délai est écoulé, permettre un tir
        const nouvelleBalle = {
            x: joueur.x + joueur.width,  // Position à droite du joueur
            y: joueur.y + joueur.height / 2 - 20,  // Position au centre vertical du joueur
            width: 40,  // Largeur de la balle
            height: 40,  // Hauteur de la balle
            speed: 13  // Vitesse de déplacement de la balle
        };

        // Ajoute la balle au tableau balles (ce qui permet de la dessiner)
        balles.push(nouvelleBalle);

        // Log la balle dans la console pour le débogage
        console.log("Balle tirée :", nouvelleBalle);

        dernierTir = maintenant; // Met à jour l'heure du dernier tir
    } else {
        console.log("Tir impossible, délai non écoulé !");
    }
}

// Générer un cœur
function creerCoeur(x, y) {
    const coeur = {
        x,
        y,
        width: 35,
        height: 35,
        speed: vitesseBase / 1.8
    };
    coeurs.push(coeur);
}

// Générer une bombe
function creerBombe(x, y) {
    const bombe = {
        x,
        y,
        width: 35,
        height: 35,
        speed: vitesseBase / 1.8
    };
    bombes.push(bombe);
}

// Générer un tonneau
function creerTonneau() {
    const tonneau = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 50,
        height: 50,
        speed: vitesseBase / 1.65
    };
    tonneaux.push(tonneau);
}

// Mise à jour des cœurs
function updateCoeurs() {
    for (let coeur of coeurs) {
        coeur.x -= coeur.speed;

        // Vérifie si le joueur ramasse un cœur
        if (
            joueur.x < coeur.x + coeur.width &&
            joueur.x + joueur.width > coeur.x &&
            joueur.y < coeur.y + coeur.height &&
            joueur.y + joueur.height > coeur.y
        ) {
            vies = Math.min(vies + 1, 3); // Augmente les vies jusqu'à un maximum de 3
            coeurs = coeurs.filter(c => c !== coeur);
        }
    }

    coeurs = coeurs.filter(coeur => coeur.x > -coeur.width);
}

// Mise à jour des bombes
function updateBombes() {
    for (let bombe of bombes) {
        bombe.x -= bombe.speed;

        // Vérifie si une bombe touche un obstacle
        for (let obs of obstacles) {
            if (
                bombe.x < obs.x + obs.width &&
                bombe.x + bombe.width > obs.x &&
                bombe.y < obs.y + obs.height &&
                bombe.y + bombe.height > obs.y
            ) {
                obstacles = obstacles.filter(o => o !== obs); // Supprime l'obstacle touché
                bombes = bombes.filter(b => b !== bombe); // Supprime la bombe
                break;
            }
        }
        // Vérifie les collisions avec le joueur
        if (
            joueur.x < bombe.x + bombe.width &&
            joueur.x + joueur.width > bombe.x &&
            joueur.y < bombe.y + bombe.height &&
            joueur.y + joueur.height > bombe.y
        ) {
            vies--;
            bombes = bombes.filter(o => o !== bombe);
            if (vies <= 0) {
                gameOver = true;
            }
        }
    }

    bombes = bombes.filter(bombe => bombe.x > -bombe.width);
}

// Mise à jour des tonneaux
function updateTonneaux() {
    for (let tonneau of tonneaux) {
        tonneau.x -= tonneau.speed;

        // Vérifie si une balle touche un tonneau
        for (let balle of balles) {
            if (
                balle.x < tonneau.x + tonneau.width &&
                balle.x + balle.width > tonneau.x &&
                balle.y < tonneau.y + tonneau.height &&
                balle.y + balle.height > tonneau.y
            ) {
                balles = balles.filter(b => b !== balle); // Supprime la balle
                tonneaux = tonneaux.filter(t => t !== tonneau); // Supprime le tonneau

                // Génère un cœur ou une bombe
                if (Math.random() < 0.5) {
                    creerCoeur(tonneau.x, tonneau.y);
                } else {
                    creerBombe(tonneau.x, tonneau.y);
                }
                break;
            }
        }
    }

    tonneaux = tonneaux.filter(tonneau => tonneau.x > -tonneau.width);
}

function creerIA() {
    const tonneau = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 40),
        width: 50,
        height: 50,
        speed: vitesseBase / 1.65
    };
    tonneaux.push(tonneau);
}

function updateIA() {
    // Suivre verticalement
    if (ia.y < joueur.y) {
        ia.y += ia.speed;
    } else if (ia.y > joueur.y) {
        ia.y -= ia.speed;
    }

    // Suivre horizontalement (optionnel, si nécessaire)
    if (ia.x < joueur.x) {
        ia.x += ia.speed;
    } else if (ia.x > joueur.x) {
        ia.x -= 0;
    }

    // Limiter la position de l'IA pour qu'elle reste dans le canvas
    ia.y = Math.max(0, Math.min(canvas.height - ia.height, ia.y));
    ia.x = Math.max(0, Math.min(canvas.width - ia.width, ia.x));

    // Vérifier si l'IA touche le joueur
    if (
        ia.x < joueur.x + joueur.width &&
        ia.x + ia.width > joueur.x &&
        ia.y < joueur.y + joueur.height &&
        ia.y + ia.height > joueur.y
    ) {
        vies--; // Réduire les vies si l'IA touche le joueur
        if (vies <= 0) {
            gameOver = true;
        }
    }
}


// Dessiner les éléments
function dessiner() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur
    ctx.drawImage(joueurImage, joueur.x, joueur.y, joueur.width, joueur.height);

    // Dessiner les obstacles
    for (let obs of obstacles) {
        ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);
    }

    for (let vague of vagues) {
        ctx.drawImage(vagueImage, vague.x, vague.y, vague.width, vague.height);
    }

    // Dessiner les balles
    for (let balle of balles) {
        ctx.drawImage(balleImage, balle.x, balle.y, balle.width, balle.height);
    }

    // Dessiner les tonneaux
    for (let tonneau of tonneaux) {
        ctx.drawImage(tonneauImage, tonneau.x, tonneau.y, tonneau.width, tonneau.height);
    }

    // Dessiner les coeurs
    for (let coeur of coeurs) {
        ctx.drawImage(coeurImage, coeur.x, coeur.y, coeur.width, coeur.height);
    }

    // Dessiner les bombes
    for (let bombe of bombes) {
        ctx.drawImage(bombeImage, bombe.x, bombe.y, bombe.width, bombe.height);
    }

    // Dessiner l'IA
    ctx.fillStyle = "purple";
    ctx.fillRect(ia.x, ia.y, ia.width, ia.height);

    // Dessiner un seul joueur
    ctx.drawImage(joueurImage, joueur.x, joueur.y, joueur.width, joueur.height);

    // Afficher le score et les vies
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Vies: ${vies}`, 10, 40);
    ctx.fillText(`Vitesse: ${vitesseBase.toFixed(1)}`, 10, 60);

    // Afficher "Game Over" si la partie est terminée
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
}


// Boucle du jeu
function gameLoop() {
    if (gameOver) return;

    updateJoueur();
    updateObstacles();
    updateVagues();
    updateBalles();
    updateCoeurs();
    updateBombes();
    updateTonneaux();
    updateIA();

    score++;

    dessiner();

    requestAnimationFrame(gameLoop);
}

setInterval(creerTonneau, 5000);

// Contrôles du joueur
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        joueur.dy = -joueur.speed;
    } else if (event.key === "ArrowDown") {
        joueur.dy = joueur.speed;
    } else if (event.key === " ") {
        tirerBalle();
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        joueur.dy = 0;
    }
});

// Démarrer le jeu
gameLoop();
