import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { envs } from 'src/config/envs';

import {
  AdminConfirmSignUpCommand,
  AuthFlowType,
  CognitoIdentityProvider,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';

import { RecoverUserPasswordDto } from './dto/recover-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import SignupResponse from './types/SignupResponse.type';

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
  ): Promise<SignupResponse> {
    const { role, email, password } = signupUserDto;

    const userAttributes = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: 'role',
        Value: role,
      }),
    ];

    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, userAttributes, [], (err, result) => {
        if (err) reject(new Error(err.message || JSON.stringify(err)));
        resolve(result as unknown as SignupResponse);
      });
    });
  }

  async confirmSignUp(username: string) {
    const confirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID!,
      Username: username,
    });

    await this.cognitoIdentityProvider.send(confirmCommand);
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

  recoverPassword(recoverPasswordDto: RecoverUserPasswordDto) {
    const { email } = recoverPasswordDto;

    const userCognito = new CognitoUser({
      Username: email,
      Pool: this.userPool,
    });

    return new Promise((resolve, reject) => {
      userCognito.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err: Error) => {
          reject(new Error(err.message || 'Recover password failed'));
        },
      });
    });
  }

  logout() {
    const userCognito = this.userPool.getCurrentUser();

    if (userCognito) {
      userCognito.signOut();
    }
  }
}
