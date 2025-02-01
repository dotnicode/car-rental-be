type SignupResponse = {
  username: string;
  pool: {
    userPoolId: string;
    clientId: string;
    client: {
      endpoint: string;
      fetchOptions: Record<string, unknown>;
    };
    advancedSecurityDataCollectionFlag: boolean;
  };
  Session: null;
  client: {
    endpoint: string;
    fetchOptions: Record<string, unknown>;
  };
  signInUserSession: null;
  authenticationFlowType: string;
  keyPrefix: string;
  userDataKey: string;
};

export default SignupResponse;
