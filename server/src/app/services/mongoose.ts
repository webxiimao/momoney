import mongoose from 'mongoose';
const url = 'mongodb://localhost:27017/momoney';
function connectDb() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }, function (err) {
    if (err) {
      console.error(err);
    }
  });
}

export default connectDb;
