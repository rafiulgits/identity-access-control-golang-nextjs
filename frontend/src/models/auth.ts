export interface OAuthDto {
  provider: string;
  accessToken: string;
}

export interface CredentialLoginDto {
  email: string;
  password: string;
}


export interface TokenDto {
  bearer: string;
}