import mongoose from "mongoose";

export async function connect(){
    try{
        mongoose.connect(process.env.MONGO_URL!);
        const connection=mongoose.connection
        connection.on('connected',()=>{
            console.log('mongodb connected successfully')
        })
        connection.on('error',()=>{
            console.log('connection error')
        })
    }
    catch(e){
        console.log("something is wrong!")
        console.log(e)
    }
}