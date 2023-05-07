export class ChromeStorage<T> {
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  async fetch<K extends keyof T>(properties: K[]): Promise<{ [P in K]: T[P] | undefined }> {
    const data = await chrome.storage.local.get(this.storeName);

    const result: { [P in K]?: T[P] } = {};

    for (const property of properties) {
      result[property] = data[this.storeName]?.[property];
    }

    return result as { [P in K]: T[P] | undefined };
  }

  async save<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    const data = await chrome.storage.local.get(this.storeName);

    data[this.storeName] = data[this.storeName] || {};
    data[this.storeName][key] = value;

    return chrome.storage.local.set(data).catch((err) => {
      throw err;
    });
  }
}

export interface EsaChangeLogSentinel {
  enabled: boolean;
  effectivePath: string;
}

export const storeName = 'esaChangeLogSentinel';

export const chromeStorage = new ChromeStorage<EsaChangeLogSentinel>(storeName);
