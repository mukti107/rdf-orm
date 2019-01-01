import {Builder, TYPE_QUERY, TYPE_UPDATE} from "./Builder";
import {TripletHelper} from "./TripletHelper";

export class Model{

    table = 'default';
    id = Math.floor(Math.random()*1000000000000000000000);
    values:{[key:string]: any} = {};

    constructor(){
        return new Proxy(this, {
            get:(self: any,field:string) => self[field] || self.values[field] || null,
            set:(self: any,field:string, value: any) => {
                if(self.hasOwnProperty(field))
                    self[field]=value
                else
                    self.values[field] = value;
                return true;
            }
        });
    }

    public static find(id: any){
        const rec = new this;
        return rec.retrive(id);
    }

    retrive(id: any){
        this.id = id;
        return new Promise((resolve, reject) => {
            const builder =  new Builder(TYPE_QUERY);
            builder.setGraph(this.table);
            builder.addCondition(TripletHelper.create('id:'+id));
            builder.execute()
                .then(resp=>{
                    if(resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings) {
                        for (const rec of resp.data.results.bindings) {
                            this.values[builder.getValue(rec.p)] = builder.getValue(rec.o);
                        }
                    }
                    resolve(this)
                })
                .catch(err=>reject(err));
        });

    }

    public static all(){
        return new Promise((resolve, reject) => {
            const rec = new this;
            const builder = new Builder(TYPE_QUERY);
            builder.setGraph(rec.table);
            builder.addCondition(TripletHelper.create());
            builder.execute()
                .then(resp => {
                    const result: {[key:string]: any} = {};
                    if (resp.data && resp.data.results && resp.data.results.bindings && resp.data.results.bindings) {
                        for (const triplet of resp.data.results.bindings) {
                            const id = builder.getValue(triplet.s);
                            if (!result[id]) result[id] = {id};
                            result[id][builder.getValue(triplet.p)] = builder.getValue(triplet.o);
                        }
                    }
                    const mapped = Object.keys(result).map((id: string) => {
                        const instance = new this;
                        Object.assign(instance, result[id]);
                        return instance
                    });
                    console.log(mapped);
                    resolve(mapped)
                })
                .catch(reject)
            ;
        });
    }

    save(){
        const builder =  new Builder(TYPE_UPDATE);
        builder.addCondition(TripletHelper.create());
        builder.setGraph(this.table);
        for(const key in this.values) {
            const removeTriplet =TripletHelper.create('id:'+this.id, 'rel:'+key) ;
            builder.addRemoveTriplet(removeTriplet);

            const insertTriplet =TripletHelper.create('id:'+this.id, 'rel:'+key, '"'+this.values[key]+'"') ;
            builder.addInsertTriplet(insertTriplet);
        }
        builder.execute();
    }

    delete(){
        const builder =  new Builder(TYPE_UPDATE);
        builder.addCondition(TripletHelper.create());
        builder.setGraph(this.table);
        builder.addRemoveTriplet(TripletHelper.create('id:'+this.id));
        return builder.execute();
    }
}

export default Model;
