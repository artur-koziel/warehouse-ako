import { AppDataSource } from '../config/data-source';

(async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();
  console.log('Migrations completed.');
  await AppDataSource.destroy();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
