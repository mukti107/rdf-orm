export const config = {
    baseUrl:'',
    username: '',
    password: ''
};

export const initConnection = (conf:{[key:string]: any})=>{
    Object.assign(config, conf);
}

export const axiosConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json,*/*;q=0.9'

    }
}

export default config;
