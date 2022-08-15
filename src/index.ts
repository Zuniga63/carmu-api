import app from './app';

// start server
app.listen(app.get('port'), async (): Promise<void> => {
  console.log(`Server is running on: ${app.get('host')}`);
});
