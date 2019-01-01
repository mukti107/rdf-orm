import axios from 'axios';
import config, {axiosConfig} from './config';
import * as Querystring from "querystring";
import {Triplet} from "./Trilpet";

export const TYPE_UPDATE = "update";
export const TYPE_QUERY = "query";
export class Builder {
    limit:number = -1;
    conditionsTriplets:Array<Triplet> = [];
    insertTriplets:Array<Triplet> = [];
    removeTriplets:Array<Triplet> = [];
    selectTriplet:Triplet = ['?s', '?p', '?o'];
    type = TYPE_QUERY;
    graph = 'default';


    constructor(type = TYPE_QUERY){
        this.type = type;
    }

    getQueryString(){
        return `
        PREFIX rel:  <rel:>
        PREFIX id: <id:>
        ${this.type === TYPE_QUERY? 'SELECT '+this.tripletString(this.selectTriplet, '')+'FROM <'+this.getGraph()+'> WHERE { '+this.tripletsString(this.conditionsTriplets)+' } '+(this.limit>0 ? "LIMIT "+this.limit : '') : ''}
        ${this.type === TYPE_UPDATE && this.removeTriplets.length>0 ? 'WITH <'+this.getGraph()+'> DELETE {'+this.tripletsString(this.removeTriplets)+'} '+ 'WHERE { '+this.tripletsString(this.conditionsTriplets)+' };' : ''}
        ${this.type === TYPE_UPDATE && this.insertTriplets.length>0 ? 'WITH <'+this.getGraph()+'> INSERT {'+this.tripletsString(this.insertTriplets)+'} '+ 'WHERE { '+this.tripletsString(this.conditionsTriplets)+' };' : ''}
        `.replace(/\n\s+/g, " ")
    }

    setLimit(limit: number){
        this.limit = limit;
    }

    setGraph(graph: string){
        this.graph = graph;
    }

    getGraph(){
        return config.baseUrl+'/'+this.graph;
    }

    addInsertTriplet(triplet: Triplet){
        this.insertTriplets.push(triplet);
    }

    addRemoveTriplet(triplet: Triplet){
        this.removeTriplets.push(triplet);
    }

    addCondition(triplet: Triplet){
        this.conditionsTriplets.push(triplet);
    }

    tripletsString(triplets: Array<Triplet>){
        return triplets.map(triplet=>this.tripletString(triplet)).join(' ');
    }

    tripletString(triplet: Triplet, delimeter = '.'){
        const {0: s, 1: p, 2 :o} = triplet;
        return `${s} ${p} ${o} ${delimeter}`;
    }

    getEndpointInfo(){
        switch (this.type) {
            case TYPE_UPDATE:
                return {
                    url: config.baseUrl+'/update',
                    paramName: 'update',
                    store: config.baseUrl+'/sample'
                };
            default:
                return {url: config.baseUrl+'/query', paramName: 'query'};
        }
    }



    execute(){
        const endpointInfo = this.getEndpointInfo();
        const data = {[endpointInfo.paramName]: this.getQueryString()}
        console.log(data);
        return axios.post(endpointInfo.url, Querystring.stringify(data), axiosConfig);
            // .then(resp=>{
            //     const result:any = {};
            //     if(resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings){
            //         for(const rec of resp.data.results.bindings){
            //             const id = this.getValue(rec.s);
            //             if(!result[id]) result[id] = {};
            //             result[id][this.getValue(rec.p)] = this.getValue(rec.o);
            //         }
            //     }
            //     return result;
            // })
            // .catch((resp)=>console.log(resp.data))
        // ;
    }

    getValue({type, value}: any){
        if(type === 'uri'){
            const arr = value.split(':');
            return arr[1];
        }
        return value;
    }

}



