# Object Relation Mapping for RDF
Wrapper for RDF database

## Installation
### NPM
`npm i -s rdf-orm`
### Yarn
`yarn add rdf-orm`


##Initializae connection
```typescript
import {initConnection} from 'rdf-orm';
initConnection({baseUrl: 'http://localhost:3030/123'});
```

## Define a Data Model
```typescript
import {Model} from 'rdf-orm';
class Post extends Model{
    table='posts';
}
```

## Create new Record
```typescript
const post:Post|any = new Post;
post.title = "Sample post";
post.save();
```

## Retrive Record by ID
```typescript
const post:Post|any =await Post.find(<post_id>);
console.log(post);
```

## Delete a Record
```typescript
const post:Post|any =await Post.find(<post_id>);
post.delete();
```

## Get all Records
```typescript
const posts:Post|any =await Post.all();
console.log(posts);
```
