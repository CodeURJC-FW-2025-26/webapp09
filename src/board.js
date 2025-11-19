import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();


const db = client.db('nomoretrash-db');
export const clothes = db.collection('clothes');


export const UPLOADS_FOLDER = './uploads';

export async function addClothe(clothe) {
    
    return await clothes.insertOne(clothe);
}

export async function updateClothe(id, updateData) {
    return await clothes.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
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

export async function deleteReview(clotheId, reviewId){

    console.log('Id Review: ', reviewId);
    console.log('Clothe Id: ', clotheId);
    return await clothes.updateOne(
        {_id: new ObjectId(clotheId)},
        {$pull: { reviews:{ id: reviewId } }}
    )
}

export async function addReview(user, title, review, clotheId, inputReviewID){
    let clothe = await getClothe(clotheId)
    if (inputReviewID === ""){
        var reviewID = clothe.reviewsCount + 1;
        await clothes.updateOne({_id: new ObjectId(clotheId)}, {
        $push: { reviews:{id: reviewID, title: title, review: review, user: user }},
        $inc: {reviewsCount: 1}
    })
    } else {
        var reviewID = Number(inputReviewID); 
        await clothes.updateOne({_id: new ObjectId(clotheId), "reviews.id":reviewID}, {
            $set: {
                "reviews.$.title": title,
                "reviews.$.review": review,
                "reviews.$.user": user
            }
        })
    }
    
    console.log('Id de la nueva review: ', reviewID);
    console.log('Nuevo valor del contador: ', clothe.reviewsCount);
}