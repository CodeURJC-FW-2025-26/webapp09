import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

async function testConnection() {
    try{
        await client.connect();
        console.log("Conexión a MOongoDB establecida")

        const db = client.db('nomoretrahs-db');
        const clothes = db.collection('clothes');
        console.log("Colecciones en la base de datos:", clothes.map(c => c.name));
    } catch(err){
    console.error("Error conectando a la base de datos")
    }
}

const db = client.db('nomoretrash-db');
const clothes = db.collection('clothes');


export const UPLOADS_FOLDER = './uploads';

export async function addClothe(clothe) {

    return await clothes.insertOne(clothe);
}

export async function deleteClothe(id){

    return await clothes.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteClothes(){

    return await clothes.deleteMany();
}

export async function getClothes(){

    return await clothes.find().toArray();
}

export async function getClothe(id){

    return await clothes.findOne({ _id: new ObjectId(id) });
}

