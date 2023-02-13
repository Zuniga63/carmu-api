import mongoose from 'mongoose';
import UserModel from './models/User.model';

export let connection: mongoose.Connection;

// enabled virtual for all documents
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });
mongoose.set('strictQuery', true);

const connectionIsSuccessfully = (uri?: string): void => {
  if (process.env.APP_ENV === 'local' && uri) {
    const message = `Connection with mongoDB into url:${uri}`;
    console.log(message);
  } else {
    console.log('Connection to database is successfully');
  }
};

export async function connect(): Promise<void> {
  const mongoUri = process.env.DB_URL || '';
  console.log(mongoUri);

  if (connection) {
    connectionIsSuccessfully(mongoUri);
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    connection = mongoose.connection;
    const users = await UserModel.count();
    if (users === 0) {
      const user = new UserModel({
        name: 'Administrador',
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin',
      });

      await user.save({ validateBeforeSave: false });
    }
    connectionIsSuccessfully(mongoUri);
  } catch (error) {
    console.log('Something went wrong!', error);
  }
}

export async function disconect(): Promise<void> {
  if (!connection) return;

  await mongoose.disconnect();
}

export async function cleanup() {
  const deletes: Promise<any>[] = [];
  const { collections } = connection;

  for (const index in collections) {
    if (Object.prototype.hasOwnProperty.call(collections, index)) {
      const collection = collections[index];
      deletes.push(collection.deleteMany({}));
    }
  }

  await Promise.all(deletes);
}
