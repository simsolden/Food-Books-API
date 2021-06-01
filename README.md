# FoodBooks

Food Books est une application Web de gestion de recettes. Le but premier du site est d’avoir des utilisateurs qui s’occuperaient d’organiser leurs propres recettes en ligne, comme si c’était leurs propres livres de recettes personnels. Dans un deuxième temps le site sera aussi un blog sur lequel on pourra partager ses recettes aux autres utilisateurs. Et pourquoi pas à l’avenir aller vers un format réseau social où l’on pourra suivre le compte d’autres utilisateurs, aimer des recettes, les noter

Ils pourront donc créer, modifier, voir et supprimer leurs recettes. Ils seront capables de filtrer, trier et organiser leurs recettes de différentes manières. Ils pourront aussi voir les recettes des autres utilisateurs si ceux-ci décident de partager leurs recettes. 
En plus de cela l’utilisateur connecté pourra gérer un planning dans lequel il pourra placer ses recettes ou celles partagées par les autres utilisateurs afin d’organiser ses repas de la semaine. Une liste de catégories sera aussi disponible avec différentes photos et description dans le but d’aider l’utilisateur en manque d’inspiration.

## Installation

1.Remplissez le fichier .env avec les informations correspondantes : 
-	Me contacter pour l’adresse de la base de données. L’adresse IP du serveur devra être fournie afin d’être ajouter à une whitelist d’adresses pouvant accéder à la base de données.
-	L’url du site foodbooks.fr (ou autre si le nom de domaine est modifié)
-	Pour les clés secrètes JWT, un bon moyen de générer une clé est d’utilisé la commande :

```
require(‘crypto’).randomBytes(64).toString(‘hex’) ;
```

Si vous voulez rajouter des adresses pouvant accéder à l’api, les ajouter dans le fichier .env, puis les ajouter dans le tableau acceptedOrigins du middlewere "corsHeaders".
```javascript
  const acceptedOrigins = [process.env.WEBSITE_URL]; // Ajouter les urls dans ce tableau
```
2. Pour compiler les fichiers en JavaScript lancer la commande tsc . Un dossier dist sera alors créé. C’est ce dossier qui est l’application JavaScript qui tournera sur le serveur. 
```bash
tsc 
```
ou en watch mode (écoute et update chaque changement)
```bash
tsc -w
```
3. Ajouter le dossier assets avec son contenu à la racine du dossier dist.
4. Depuis la racine du dossier api, lancer la commande 
```bash
yarn install 
```
5. Une fois tous les modules installer, lancer la commande yarn start pour lancer l’application
```bash
 yarn start  
```
 ou yarn dev pour lancer l’application en watch mode.
```bash
 yarn dev  
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
