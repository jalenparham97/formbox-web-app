import { create } from "zustand";

type Store = {
  slack: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  "google-sheets": {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  excel: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  airtable: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  zapier: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  webhook: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
  mailchimp: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
  };
};

export const useIntegrationStore = create<Store>()((set) => ({
  slack: {
    isOpen: false,
    open: () => {
      set((state) => {
        return { ...state, slack: { ...state.slack, isOpen: true } };
      });
    },
    close: () => {
      set((state) => {
        return { ...state, slack: { ...state.slack, isOpen: false } };
      });
    },
  },
  "google-sheets": {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          "google-sheets": { ...state["google-sheets"], isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          "google-sheets": { ...state["google-sheets"], isOpen: false },
        };
      });
    },
  },
  excel: {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          excel: { ...state["excel"], isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          excel: { ...state["excel"], isOpen: false },
        };
      });
    },
  },
  airtable: {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          airtable: { ...state.airtable, isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          airtable: { ...state.airtable, isOpen: false },
        };
      });
    },
  },
  zapier: {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          zapier: { ...state.zapier, isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          zapier: { ...state.zapier, isOpen: false },
        };
      });
    },
  },
  webhook: {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          webhook: { ...state.webhook, isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          webhook: { ...state.webhook, isOpen: false },
        };
      });
    },
  },
  mailchimp: {
    isOpen: false,
    open: () => {
      set((state) => {
        return {
          ...state,
          mailchimp: { ...state.mailchimp, isOpen: true },
        };
      });
    },
    close: () => {
      set((state) => {
        return {
          ...state,
          mailchimp: { ...state.mailchimp, isOpen: false },
        };
      });
    },
  },
}));
