# sfm-api

## Route Users

```
//Création d'un utilisateur//

POST https://sfm-project.herokuapp.com/users/register

Params : 
 - first_name
 - last_name
 - email
 - password
 - mobile
```

```
//Connexion//

POST https://sfm-project.herokuapp.com/users/login

Params : 
 - email
 - password

Retourne un token
```

```
//Récupérer tout les utilisateurs//

GET https://sfm-project.herokuapp.com/users/

Retourne un tableau d'objets
```

```
//Récupérer un utilisateur//

GET https://sfm-project.herokuapp.com/users/user/:id

Retourne un objet
```

```
//Supprimer un utilisateur//

DELETE https://sfm-project.herokuapp.com/users/:email
```

```
//Modifier un utilisateur//

PUT https://sfm-project.herokuapp.com/users/user/:id
Params : 
 - first_name
 - last_name
 - email
 - mobile
```

```
//Modifier le rang d'un utilisateur//

PUT https://sfm-project.herokuapp.com/users/user/:id/rank
Params: 
 - rank (0 à 1)
```

### Route Songs

```
//Récupérer toutes les musiques// 

GET https://sfm-project.herokuapp.com/songs/

Retourne un tableau d'objet
```

```
//Récupérer une musique// 

GET https://sfm-project.herokuapp.com/songs/song/:id

Retourne un objet
```

```
//Supprimer une musique// 

DELETE https://sfm-project.herokuapp.com/songs/:id
```


```
//Uploader une musique// 

POST https://sfm-project.herokuapp.com/songs/upload
Params: 
 - title
 - artist
 - album
 - date 
 - style
 - file (fichier dans un formData)
```

### Route Parties

```
//Créer un évènment// 

POST https://sfm-project.herokuapp.com/parties/create
Params: 
 - event_name
 - date
 - location
 - description
 - theme 
```

```
//Récupérer tout les évènements// 

GET https://sfm-project.herokuapp.com/parties/

Retourne un tableau d'objets
```


```
//Récupérer un évènement// 

GET https://sfm-project.herokuapp.com/parties/event/:id

Retourne un objet
```


```
//Supprimer un évènement// 

DELETE https://sfm-project.herokuapp.com/parties/:id

```

```
//Modifier un évènement// 

PUT https://sfm-project.herokuapp.com/parties/event/:id
Params: 
 - event_name
 - date
 - location
 - description
 - theme 
```

```
//Modifier l'état d'un évènement// 

PUT https://sfm-project.herokuapp.com/parties/event/:id/state
Params: 
 - state

```

```
//Inscrire un utilisateur à un évènement// 

POST https://sfm-project.herokuapp.com/parties/event/:id/sign

Params: 
 - userId
 - songId
 - order
```

```
//Désinscrire un utilisateur à un évènement// 

POST https://sfm-project.herokuapp.com/parties/event/:id/unsub_user

Params: 
 - userId
```

```
//Ajouter une musique à un évènement// 

POST https://sfm-project.herokuapp.com/parties/event/:id/song
Params: 
 - songId
```

```
//Supprimer une musique à un évènement// 

POST https://sfm-project.herokuapp.com/parties/event/:id/remove_song
Params: 
 - songId
```