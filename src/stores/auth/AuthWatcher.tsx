import React, { useEffect } from 'react';
import { getProfileThunk } from './auth.action';
import { useAppDispatch, useAppSelector } from '../hooks';
import { cookies } from '@/lib/cookies';

interface AuthWatcherProps {
  children: React.ReactNode;
}

export const AuthWatcher = ({ children }: AuthWatcherProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const token = cookies.getAccessToken();

    if (token && !user) {
      dispatch(getProfileThunk());
    }
  }, [dispatch, user]);

  return <>{children}</>;
};

export default AuthWatcher;
