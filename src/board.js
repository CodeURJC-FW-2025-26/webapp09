import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('board');
const posts = db.collection('posts');

export const UPLOADS_FOLDER = './uploads';

export async function addPost(post) {

    return await posts.insertOne(post);
}

export async function deletePost(id){

    return await posts.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deletePosts(){

    return await posts.deleteMany();
}

export async function getPosts(){

    return await posts.find().toArray();
}

export async function getPost(id){

    return await posts.findOne({ _id: new ObjectId(id) });
}

