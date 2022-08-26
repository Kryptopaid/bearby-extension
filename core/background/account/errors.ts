import { BaseError } from 'lib/error';

export class AccountError extends BaseError {
  name = 'AccountError';
}

export const NIL_ACCOUNT = 'Account not found';
export const INCORRECT_ACCOUNT = 'Account type is not correct';
export const ACCOUNT_MUST_UNIQUE = 'Account must be unique';
export const ACCOUNT_OUT_INDEX = 'Account index out of list';
export const ACCOUNT_NOT_FOUND = 'Cannot find account';
export const HARDWARE_NOT_SUPPORT_METHOD = 'Hardware doesnt support';
