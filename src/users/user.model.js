import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
      },
      email: {
        type: String,
        required: [true, "El correo es obligarorio"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "La contraseña es obligaroria"],
      },
      img: {
        type: String,
      },
      state: {
        type: String,
        enum: ["Habilitado", "Suspendido", "Deshabilitado"],
        default: "Habilitado",
      },
});

UserSchema.methods.toJSON = function(){
    const { _v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);