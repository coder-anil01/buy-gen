import mongose from 'mongoose';

const connectDB = async ()=> {
    try {
        const conn = await mongose.connect(process.env.MONGODB_URI)
        console.log(`Connected to mongodb database ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error in mongdb ${error}`)
    }
};

export default connectDB;