import Cookies from "js-cookie";

export const MemoryManager = {
  setItem: (key: string, value: string) => {
    Cookies.set(key, value, { expires: 60 });
  },

  getItem: (key: string) => {
    let val = Cookies.get(key);
    return val ? val : null;
  },

  removeItem: (key: string) => {
    Cookies.remove(key);
  },

  clear: () => {
    Object.keys(Cookies.get()).forEach(function (cookieName) {
      Cookies.remove(cookieName);
    });
  },
};
