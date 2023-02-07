import bcrypt from 'bcryptjs';

export class PasswordHasher {

  //added layer of security  
  private readonly saltRounds: number = 8;

  public async hashPassword(password: string): Promise<string> {

    //use the hash function to hash the password
    return bcrypt.hash(password, this.saltRounds);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    //turn password into a hash then compare the hash with the password
    return bcrypt.compare(password, hash);
  }
}