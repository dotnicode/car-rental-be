import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { SignUpUserDto } from './dto/signup-user.dto';
import { envs } from 'src/config/envs';
import { SignInUserDto } from './dto/signin-user-dto';
import { RecoverUserPasswordDto } from './dto/recover-user-password.dto';

@Injectable()
export class AwsCognitoService {
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: envs.AWS_COGNITO_USER_POOL_ID,
      ClientId: envs.AWS_COGNITO_CLIENT_ID,
    });
  }

  async signupUser(signupUserDto: SignUpUserDto) {
    const {
      firstName,
      lastName,
      email,
      password,
      dob,
      address,
      country,
      role,
    } = signupUserDto;

    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: 'name',
            Value: `${firstName} ${lastName}`,
          }),
          new CognitoUserAttribute({
            Name: 'dob',
            Value: dob.toISOString(),
          }),
          new CognitoUserAttribute({
            Name: 'address',
            Value: address,
          }),
          new CognitoUserAttribute({
            Name: 'country',
            Value: country,
          }),
          new CognitoUserAttribute({
            Name: 'role',
            Value: role,
          }),
        ],
        [],
        (err, result) => {
          if (!result) {
            reject(new Error(err?.message || 'Registration failed'));
          } else {
            resolve(result.user);
          }
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
