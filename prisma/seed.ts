import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const p = new PrismaClient();

async function run() {
  await p.user.deleteMany();

  const promises = [] as Promise<any>[];

  for (let index = 0; index < 20; index++) {
    promises.push(
      p.user.create({
        data: {
          name: faker.name.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        }
      }),
    );
  }

  await Promise.all(promises);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await p.$disconnect();
  });
