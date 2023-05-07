import { TabMessage } from '~/types/TabMessage';

export type MessageFormat = {
  action: string;
  message: unknown;
};

export class ChromeTabs<T extends MessageFormat> {
  publish(message: T) {
    return chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        if (!tabs[0].id) throw new Error('Not found tabs');

        return chrome.tabs.sendMessage(tabs[0].id, message);
      },
    );
  }

  subscribe(callback: (request: T) => void) {
    chrome.runtime.onMessage.addListener(callback);
  }
}

export const chromeTabs = new ChromeTabs<TabMessage>();
