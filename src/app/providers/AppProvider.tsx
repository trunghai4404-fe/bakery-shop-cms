import React from 'react';
import { ConfigProvider } from 'antd';
import { QueryProvider } from './QueryProvider';
import { ReduxProvider } from './ReduxProvider';
import { AuthWatcher } from '@/stores/auth/AuthWatcher';

interface Props {
  children: React.ReactNode;
}

export function AppProvider({ children }: Props) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#E2B2C0',
              colorBgContainer: '#FFFFFF',
              colorBgLayout: '#F8F1EC',
              colorText: '#4B4140',
              fontFamily: "'Nunito', sans-serif",
              borderRadius: 8,
              borderRadiusSM: 6,
              borderRadiusLG: 12,
            },
            components: {
              Menu: {
                itemBg: 'transparent',
                itemColor: '#806D67',
                itemSelectedColor: '#5E3642',
                itemSelectedBg: '#F7E4E9',
                itemHoverColor: '#4B4140',
                itemHoverBg: '#F3E7E2',
                itemMarginInline: 8,
                itemBorderRadius: 6,
              },
              Layout: {
                siderBg: '#FCF7F3',
              },
            },
          }}
        >
          <AuthWatcher>{children}</AuthWatcher>
        </ConfigProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}