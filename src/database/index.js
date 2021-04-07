import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL;

async function start() {
  try {
    await mongoose.connect(mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    return console.log("(Mongodb): Conectado com sucesso!");
  } catch (error) {
    return console
      .log(`(Mongodb): Houve um erro ao se conectar erro: ${error}`);
  }
}

export default start();