export const getRedisSyncWalletStatusKey = (wallet: string) => {
  return ("syncing_wallet_v2:" + wallet);
};

export const getRedisSyncSingleNFTStatusKey = (nft: string) => {
  return ("syncing_nft:" + nft);
};

export const getRedisConfirmEmailCooldownKey = (wallet: string) => {
  return ("cooling_down_confirm_email:" + wallet);
};

export const getRedisForgotPasswordCooldownKey = (wallet: string) => {
  return ("cooling_down_forgot_password:" + wallet);
};

export const getRedisConfirmEmailDaily = (wallet: string) => {
  return ("daily_limit_confirm_email:" + wallet);
};

export const getRedisForgotPasswordDaily = (wallet: string) => {
  return ("daily_limit_forgot_password:" + wallet);
};
