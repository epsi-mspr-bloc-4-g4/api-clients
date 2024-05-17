import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCompany() {
  const company = await prisma.company.create({
    data: {
      name: "Samsung",
    },
  });
  console.log(company);
}

createCompany()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
