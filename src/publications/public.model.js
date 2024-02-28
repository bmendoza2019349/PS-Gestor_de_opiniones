import mongoose from "mongoose";
const { Schema } = mongoose;

const PublicSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "The name is required"],
    },
    category: {
        type: String,
        enum: ["Estado", "Historia", "Actividad", "Evento", "Recuerdo"],
        default: "Actividad"
    },
    img: {
        type: String
    },
    // comments: [{
    //     text: String,

    //     user:{ 
    //         type: Schema.Types.ObjectId,
    //         ref: 'User',
    //         required: [true, 'El user es obligatorio']
    //     }
    // }],
    comments: {
        type: String,
        required: [true, "The comments is required"],
    },
    
});

export default mongoose.model('Public', PublicSchema);