import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const testEmail = "rafael.marques.vale.dev@gmail.com";

  const existingCompany = await prisma.company.findFirst({
    where: { name: "Empresa Teste" },
  });

  if (existingCompany) {
    console.log("✓ Dados de teste já existem");
    return;
  }

  const company = await prisma.company.create({
    data: {
      name: "Empresa Teste",
      cnpj: "12.345.678/0001-90",
    },
  });

  const user = await prisma.user.create({
    data: {
      companyId: company.id,
      email: testEmail,
      name: "Rafael Marques",
      role: "OWNER",
    },
  });

  await prisma.company.update({
    where: { id: company.id },
    data: { ownerId: user.id },
  });

  console.log("✓ Seed completo:");
  console.log(`  - Empresa: ${company.name} (${company.id})`);
  console.log(`  - Usuário: ${user.email} (${user.id})`);
  console.log(`\nPara testar magic link, use o email: ${testEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
