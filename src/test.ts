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


const test  = async ()=>{

    const user:any = await User.find(112955940751436660000);
    user.name = "Test User modified";
    user.email = "new email heretest@test.com";
    user.save();

    // const page:any = await Page.find(486146737788467400000);
    // page.delete();
};

test();


// usr.retrive(619081964812893800000).then(console.log);
