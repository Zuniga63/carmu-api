import { Socket } from 'socket.io';

export default function (socket: Socket) {
  const room = 'categoryRoom';
  const client = 'categoryPage';
  const event = {
    newCategory: 'newCategory',
    updateCategory: 'updateCategory',
    deleteCategory: 'deleteCategory',
    reorderCategory: 'reorderCategory',
  };

  socket.on('joinToCategoryRoom', () => {
    socket.join(room);
    console.log('User connected to category Room');
  });

  socket.on(`${client}:${event.newCategory}`, (data) => {
    socket.broadcast.to(room).emit(`server:${event.newCategory}`, data);
  });

  socket.on(`${client}:${event.updateCategory}`, (data) => {
    socket.broadcast.to(room).emit(`server:${event.updateCategory}`, data);
  });

  socket.on(`${client}:${event.deleteCategory}`, (data) => {
    socket.broadcast.to(room).emit(`server:${event.deleteCategory}`, data);
  });
}
