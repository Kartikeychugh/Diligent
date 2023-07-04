export const retryFunction = <T>(callback: () => Promise<T>, count: number) => {
  const retryableFn = async (): Promise<T> => {
    try {
      return await callback();
    } catch (e) {
      if (count > 0) {
        count--;
        return retryableFn();
      } else {
        throw e;
      }
    }
  };

  return retryableFn;
};
