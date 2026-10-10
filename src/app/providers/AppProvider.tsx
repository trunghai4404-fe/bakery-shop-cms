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
              Button: {
                colorPrimary: '#B86B82',
                colorPrimaryHover: '#9E546B',
                colorPrimaryActive: '#854055',
                primaryColor: '#FFFFFF',
              },
              Menu: {
                itemBg: 'transparent',
                itemColor: '#4A3B37',
                itemSelectedColor: '#5E3642',
                itemSelectedBg: '#F2E3E7',
                itemHoverColor: '#382B28',
                itemHoverBg: '#F0E2DC',
                itemMarginInline: 8,
                itemBorderRadius: 6,
              },
              Switch: {
                colorPrimary: '#7E9A79',
                colorPrimaryHover: '#6B8766',
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