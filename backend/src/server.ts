import { config } from './config/env';
import { app } from './app';

const server = app.listen(config.port, () => {
  console.log(`EMS backend listening on port ${config.port}`);
});

export { server };
