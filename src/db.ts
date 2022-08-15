import mongoose from 'mongoose';

export let connection: mongoose.Connection;

// enabled virtual for all documents
mongoose.set('toJSON', { virtuals: true });
mongoose.set('toObject', { virtuals: true });

const connectionIsSuccessfully = (uri?: string): void => {
  if (process.env.APP_ENV === 'local' && uri) {
    const message = `Connection with mongoDB into url:${uri}`;
    console.log(message, uri);
  }
};

const getMongoUri = (): string => {
  const env: string = process.env.APP_ENV || 'local';
  let uri: string = process.env.DB_URL || '';

  if (env === 'local') {
    const host: string | undefined = process.env.DB_HOST;
    const port: string | undefined = process.env.DB_PORT;
    const db: string | undefined = process.env.DB_DATABASE;
    uri = `${host}:${port}/${db}`;
  }

  return uri;
};

export async function connect(): Promise<void> {
  const mongoUri = getMongoUri();

  if (connection) {
    connectionIsSuccessfully(mongoUri);
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    connection = mongoose.connection;
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
