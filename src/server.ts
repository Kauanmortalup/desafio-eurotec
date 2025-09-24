import express from 'express';
import cartRoutes from './routes/index';
import { cart } from './services/cartService';

async function bootstrap() {
  const app = express();
  app.use(express.json());
  app.use('/cart', cartRoutes);

  // Load cart history
  await cart.init();

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();