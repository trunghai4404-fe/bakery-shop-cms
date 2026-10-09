import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import type { LoginRequest, LoginResponse } from '../interface/auth.interface';

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) => loginApi(data),
  });
};
