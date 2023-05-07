import ReactDOM from 'react-dom/client';

import Tooltip from '~/components/tooltip';
import { TabMessage } from '~/types/TabMessage';
import { chromeStorage } from '~/utils/chromeStorage';
import { chromeTabs } from '~/utils/chromeTabs';

chromeTabs.subscribe((request: TabMessage) => {
  if (request.action === 'sendEnabled' || request.action === 'sendEffectivePath') {
    initialize();
  }
});

const wipAndShipItButton = (() => {
  const wipButton = document.querySelector<HTMLInputElement>('input[name="save_as_wip"]');
  const shipItButton = document.querySelector<HTMLInputElement>('input[name="save_as_lgtm"]');

  return {
    enabled: () => {
      const enabledStyle = `
        pointer-events: pointer;
        opacity: 1;
      `;

      if (wipButton) {
        wipButton.disabled = false;
        wipButton.style.cssText = enabledStyle;
      }

      if (shipItButton) {
        shipItButton.disabled = false;
        shipItButton.style.cssText = enabledStyle;
      }
    },

    disabled: () => {
      const disabledStyle = `
        pointer-events: none;
        opacity: 0.5;
      `;

      if (wipButton) {
        wipButton.disabled = true;
        wipButton.style.cssText = disabledStyle;
      }

      if (shipItButton) {
        shipItButton.disabled = true;
        shipItButton.style.cssText = disabledStyle;
      }
    },
  };
})();

const quickSave = (() => {
  const cancelShortcutCommand = (event: KeyboardEvent) => {
    const shortcutCommand1 = event.ctrlKey && event.key === 's';
    const shortcutCommand2 = event.metaKey && event.key === 's';

    if (shortcutCommand1 || shortcutCommand2) {
      const disabled = true;

      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  return {
    enabled: () => {
      document.removeEventListener('keydown', cancelShortcutCommand, { capture: true });
    },

    disabled: () => {
      document.addEventListener('keydown', cancelShortcutCommand, { capture: true });
    },
  };
})();

const tooltip = (() => {
  const changeLogFormContainer = document.querySelector<HTMLInputElement>(
    '.editor-footer__change-log-form',
  );

  if (changeLogFormContainer) {
    changeLogFormContainer.style.cssText = `
      position: relative;
      display: inline-block;
    `;
  }

  const changeLogForm = document.querySelector('#js-post-message');

  if (changeLogForm) {
    const container = document.createElement('div');

    changeLogForm.parentNode?.insertBefore(container, changeLogForm.nextElementSibling);

    ReactDOM.createRoot(container).render(<Tooltip />);
  }

  return {
    show: () => {
      const tooltip = document.getElementById('esa-change-log-sentinel-tooltip');

      if (tooltip) {
        tooltip.style.cssText = `
          display: block;
        `;
      }
    },

    hide: () => {
      const tooltip = document.getElementById('esa-change-log-sentinel-tooltip');

      if (tooltip) {
        tooltip.style.cssText = `
          display: none;
        `;
      }
    },
  };
})();

// TODO: addEventListener系が重複登録されていないか
const initialize = async () => {
  const data = await chromeStorage.fetch(['enabled', 'effectivePath']);

  if (!data.enabled) {
    wipAndShipItButton.enabled();
    quickSave.enabled();
    tooltip.hide();

    return;
  }

  const lastBreadcrumb = document.querySelector(
    '#preview-body .category-path > li:last-child > a',
  ) as HTMLAnchorElement;

  const isHashPathContain = (sourceUrl: string, searchPath: string) => {
    try {
      const url = new URL(decodeURIComponent(sourceUrl));
      const hashString = url.hash.slice(1);
      const keyValuePairs = hashString.split('&');

      const pathPair = keyValuePairs.find((pair) => {
        const [key] = pair.split('=');

        return key === 'path';
      });

      const pathValue = pathPair ? pathPair.split('=')[1] : null;

      return pathValue ? pathValue.includes(searchPath) : false;
    } catch (error) {
      console.error(error);
      console.error('Invalid URL:', sourceUrl);

      return false;
    }
  };

  if (!isHashPathContain(lastBreadcrumb.href, data.effectivePath || '')) {
    wipAndShipItButton.enabled();
    quickSave.enabled();
    tooltip.hide();

    return;
  }

  const changeLogForm: HTMLInputElement | null = document.querySelector('#js-post-message');

  const switchSaveFunction = (changeMessage: string) => {
    const defaultChangeMessages = ['Create post.', 'Update post.'];

    const isDefaultChangeLog = (changeMessage: string) => {
      return defaultChangeMessages.some((defaultChangeMessage) => {
        return !!(changeMessage.indexOf(defaultChangeMessage) !== -1);
      });
    };

    if (isDefaultChangeLog(changeMessage)) {
      wipAndShipItButton.disabled();
      quickSave.disabled();
      tooltip.show();
    } else {
      wipAndShipItButton.enabled();
      quickSave.enabled();
      tooltip.hide();
    }
  };

  if (changeLogForm) {
    changeLogForm.addEventListener('keyup', (event) => {
      switchSaveFunction((event.target as HTMLInputElement).value);
    });

    switchSaveFunction(changeLogForm.value);
  }
};

(async () => {
  const sleep = (sec: number) => {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  };

  // FIXME: 動作に必要な要素を取得するようにリトライ処理に変えた方が良い
  await sleep(1.5);

  initialize();
})();
