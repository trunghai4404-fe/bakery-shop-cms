import React from 'react';

interface UseSelectScrollLoadOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  threshold?: number;
}

/**
 * Hook to trigger lazy load (fetchNextPage) when scrolling near the bottom of an Ant Design Select dropdown.
 */
export const useSelectScrollLoad = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 20,
}: UseSelectScrollLoadOptions) => {
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
        fetchNextPage();
      }
    }
  };

  return { handlePopupScroll };
};
