import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const codingProject = await prisma.project.create({
    data: {
      name: 'Coding',
      color: 'green',
      userId: user.id
    }
  })

  const personalProject = await prisma.project.create({
    data: {
      name: 'Personal',
      color: 'blue',
      userId: user.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Code a React app using Remix',
      description: '',
      priority: 3,
      projectId: codingProject.id,
      userId: user.id,
      time: true
    }
  });

  await prisma.task.create({
    data: {
      title: 'Learn cypress',
      description: 'This will help you take full advantage of the indie stack and ship better code!',
      priority: 4,
      projectId: codingProject.id,
      userId: user.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Create the user interface',
      description: 'Make sure to do mobile-first design and test different breakpoints using responsively',
      priority: 3,
      projectId: codingProject.id,
      userId: user.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Do Yoga',
      description: 'Find a YouTube video focused on rock climbers yoga',
      priority: 1,
      projectId: personalProject.id,
      userId: user.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Do Laundry',
      description: 'Two baskets',
      priority: 3,
      projectId: personalProject.id,
      userId: user.id
    }
  })

  await prisma.task.create({
    data: {
      title: 'Finish your DuoLingo lesson',
      description: '',
      priority: 2,
      projectId: personalProject.id,
      userId: user.id
    }
  })

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
