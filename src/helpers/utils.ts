import * as bcrypt from 'bcrypt';

export async function hashedPasswordHelper(
    plainPassword: string,
    saltRounds = 10,
): Promise<string> {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        throw error;
    }
}

export async function comparePasswordHelper(
    plainPassword: string,
    hashPassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(plainPassword, hashPassword);
    } catch (error) {
        throw error;
    }
}