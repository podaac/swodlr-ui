export class RequiredModulesNotFound extends Error {
  constructor(modules: [string]) {
    super(
      `Required modules not found: ${modules.toString()}`
    )
  }
}

export class OAuthParametersNotFound extends Error {
  constructor() {
    super('OAuth parameters not found in local storage');
  }
}

declare interface OAuthErrorResponse {
  error: string,
  error_description: string | null
}

export class OAuthTokenExchangeFailed extends Error {
  private _description: string | null;

  constructor(response: OAuthErrorResponse) {
    const { error, error_description } = response;

    super(`An error occurred while exchanging the token: ${error}`);
    this._description = error_description;
  }

  get description() {
    return this._description;
  }
}
