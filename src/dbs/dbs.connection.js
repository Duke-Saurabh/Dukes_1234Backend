import mongoose from 'mongoose';

const connectdb=async()=>{
    try {
        // const response=await mongoose.connect(`${process.env.MONGODB_CONNECT}/${DB_NAME}`);   
        const response = await mongoose.connect(`${process.env.MONGODB_CONNECT}/${process.env.DB_NAME}`);

        if(!response){
            throw new Error('not able to connect dbs. Error in line 7 in dbs.connection');
        }

        console.log('Host:', response.connections[0].host);
        return response;
    } catch (error) {
        console.error(`not able to connect dbs, Error:`,error);
        throw new Error('not able to connect dbs. Error in line 13 in dbs.connection');
    }
}

export {connectdb};

