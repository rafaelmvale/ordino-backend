export interface VerifyMagicLinkInputDto {
  token: string;
}

export interface VerifyMagicLinkOutputDto {
  token: string;
  user: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}
