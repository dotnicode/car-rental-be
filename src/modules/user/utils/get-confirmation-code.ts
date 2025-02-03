import * as fs from 'fs/promises';
import * as path from 'path';

export async function getConfirmationCode(email: string): Promise<string | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      'containers',
      'cognito-local',
      'db',
      'local_4mTITs2N.json',
    );
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    const user = data.Users[email];

    if (!user) {
      return null;
    }

    return user.ConfirmationCode;
  } catch (error) {
    console.error('Error al obtener el código de confirmación:', error);
    return null;
  }
}

// Ejemplo de uso:
// const code = await getConfirmationCode('Chance_Pfeffer@hotmail.com');
// console.log(code); // Imprime: 617043
