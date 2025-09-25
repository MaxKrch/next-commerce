import type { IReactionDisposer } from 'mobx';
import React from 'react';

export type ILocalStore = {
  destroy(): void;
  reactions: IReactionDisposer[];
  initReactions(): void;
  clearReactions(): void;
};

const useLocalStore = <T extends ILocalStore & { _destroyed?: boolean }>(creator: () => T) => {
  const container = React.useRef<T | null>(null);

  if (!container.current) {
    container.current = creator();
  }

  React.useEffect(() => {
    if (container.current?._destroyed) {
      container.current.initReactions()
    }
    console.log(container.current)
    return () => {
      if (container.current) {
        container.current._destroyed = true;
        container.current.destroy();
      }
    };
  }, []);

  return container.current;
};

export default useLocalStore;
