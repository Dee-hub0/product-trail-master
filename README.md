# Alten Shop 🛫

### Prérequis:

PHP 8.2.0
Symfony 7.1.5
Nodejs 20.12.12

### Instructions

- Colnez le projet 'https://github.com/Dee-hub0/product-trail-master.git'

- Mettez-vous sur sur le dossier /front et executez :
 `npm install` `npm update` pour l'installation des dépendences

- Depuis le terminal, se positionner sur le dossier /back et, executez la commande suivante pour créer la BD
  `php bin/console doctrine:database:create`

- Démarrez le serveur de développement Back-end :
  `symfony serve`

- Démarrez le serveur de développement Front-end :
  `ng serve` ou `npm start`

### Tests

- Vous pouvez lancer et excecuter les tests Fonctionnels et unitaires de l'application en utilisant la commande suivante :

`php bin/phpunit`

### Tests API Postman

- Le fichier "product-trial-master.postman_collection" est une exportation d'une collection Postman qui contient l'ensemble des tests des endpoints de l'API (GET, PATCH, POST et DELETE).
