import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";

export async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);

  const userCount = await userRepository.count();

  if (userCount === 0) {
    const users = [
      {
        username: "user1",
        email: "user1@example.com",
        password_hash: await bcrypt.hash("password1", 10),
      },
      {
        username: "user2",
        email: "user2@example.com",
        password_hash: await bcrypt.hash("password2", 10),
      },
      {
        username: "user3",
        email: "user3@example.com",
        password_hash: await bcrypt.hash("password3", 10),
      },
    ];

    for (const user of users) {
      await userRepository.save(user);
    }

    console.log("Database seeded with initial users.");
  } else {
    console.log("Database already has users, skipping seed.");
  }
}
