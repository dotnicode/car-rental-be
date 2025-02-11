import * as fs from 'fs/promises';
import * as path from 'path';
import { envs } from 'src/config/envs';

export async function getConfirmationCode(email: string): Promise<string | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      'data',
      'cognito-local',
      `${envs.AWS_COGNITO_USER_POOL_ID}.json`,
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
