const { default: mongoose } = require("mongoose");

 const initiateDB = async () => {
    const db = await mongoose.connect(`mongodb+srv://dpnkishore:${process.env.DB_PASSWORD || 'hsQD2gP27l1cMrWe'}@cluster0.gjgo7n2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then((res) => {
        console.log('Connected to MongoDB');
        
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });
}

exports.initiateDB = initiateDB;