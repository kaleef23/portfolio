'use server';

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set.');
    // In a real app, you might want to throw an error or handle this more gracefully.
    // For now, we'll deny access if it's not set.
    return false;
  }

  // Use a secure comparison. In a real-world scenario, you should use a
  // library like `bcrypt` to compare hashed passwords. For this simple case,
  // we'll do a direct comparison.
  return password === adminPassword;
}
