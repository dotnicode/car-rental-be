import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { envs } from 'src/config/envs';

import {
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
  AuthFlowType,
  ChangePasswordCommand,
  CognitoIdentityProvider,
  InitiateAuthCommand,
  SignUpCommand,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';

import { RecoverUserPasswordDto } from '../user/dto/recover-password.dto';
import { SignInUserDto } from '../user/dto/signin-user-dto';
import { SignUpUserDto } from '../user/dto/signup-user.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;
  private cognitoIdentityProvider: CognitoIdentityProvider;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID,
      ClientId: envs.AWS_COGNITO_CLIENT_ID,
      endpoint: envs.AWS_COGNITO_ENDPOINT,
    });

    this.cognitoIdentityProvider = new CognitoIdentityProvider({
      region: envs.AWS_REGION,
      endpoint: envs.AWS_COGNITO_ENDPOINT,
    });
  }

  async signupUser(
    signupUserDto: Pick<SignUpUserDto, 'email' | 'password' | 'role'>,
  ): Promise<SignUpCommandOutput> {
    const { email, password, role = Role.CLIENT } = signupUserDto;

    const userAttributes = [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'custom:role',
        Value: role,
      },
    ];

    const command = new SignUpCommand({
      ClientId: envs.AWS_COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: userAttributes,
    });

    try {
      const response = await this.cognitoIdentityProvider.send(command);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async confirmSignUp(username: string) {
    const confirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID!,
      Username: username,
    });

    await this.cognitoIdentityProvider.send(confirmCommand);
  }

  async addUserToGroup(username: string, groupName: 'admin' | 'client') {
    const addUserToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID!,
      Username: username,
      GroupName: groupName,
    });

    await this.cognitoIdentityProvider.send(addUserToGroupCommand);
  }

  async signinUser(signinUserDto: SignInUserDto) {
    const { email, password } = signinUserDto;

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: envs.AWS_COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await this.cognitoIdentityProvider.send(command);

      return {
        accessToken: response.AuthenticationResult?.AccessToken,
        refreshToken: response.AuthenticationResult?.RefreshToken,
        idToken: response.AuthenticationResult?.IdToken,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async recoverPassword(recoverPasswordDto: RecoverUserPasswordDto) {
    const { currentPassword, newPassword, accessToken } = recoverPasswordDto;

    const command = new ChangePasswordCommand({
      PreviousPassword: currentPassword,
      ProposedPassword: newPassword,
      AccessToken: accessToken,
    });

    await this.cognitoIdentityProvider.send(command);
  }

  logout() {
    const userCognito = this.userPool.getCurrentUser();

    if (userCognito) {
      userCognito.signOut();
    }
  }
}
