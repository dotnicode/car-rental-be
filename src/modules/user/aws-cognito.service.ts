import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { envs } from 'src/config/envs';
import { RecoverUserPasswordDto } from './dto/recover-user-password.dto';
import { SignInUserDto } from './dto/signin-user-dto';
import { SignUpUserDto } from './dto/signup-user.dto';
import SignupResponse from './types/SignupResponse.type';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID,
      ClientId: envs.AWS_COGNITO_CLIENT_ID,
      endpoint: envs.AWS_COGNITO_ENDPOINT,
    });
  }

  async signupUser(signupUserDto: SignUpUserDto): Promise<SignupResponse> {
    const { firstName, lastName, role, email, password } = signupUserDto;

    const userAttributes = [
      new CognitoUserAttribute({
        Name: 'fullname',
        Value: `${firstName} ${lastName}`,
      }),
      new CognitoUserAttribute({
        Name: 'role',
        Value: role,
      }),
    ];

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        userAttributes,
        [],
        (err, result) => {
          if (err) reject(new Error(err.message || JSON.stringify(err)));
          resolve(result as unknown as SignupResponse);
        },
      );
    });
  }

  async signinUser(signinUserDto: SignInUserDto) {
    const { email, password } = signinUserDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    const userCognito = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      userCognito.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            accessToken: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err: Error) => {
          reject(new Error(err.message || 'Signin failed'));
        },
      });
    });
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
