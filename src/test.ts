import Model from "./Model";
import {initConnection} from "./config";

initConnection({baseUrl:'http://localhost:3030/smartdebate'});

class Page extends Model{
    table = 'pages';
}

class User extends Model{
    table = 'users';
}

// const post:any = Post.find(317721667345324050000);
// const post:any = new Post;
// post.app = "hello there";
// post.save();
//
const user:any = new User;
user.name = "Test User";
user.email = "test@test.com";
user.save();

const test  = async ()=>{
    // const page:any = await Page.find(486146737788467400000);
    // page.delete();
};

test();


// usr.retrive(619081964812893800000).then(console.log);
