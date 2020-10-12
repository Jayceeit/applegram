import mediaSizes from "../../helpers/mediaSizes";
import appImManager from "../../lib/appManagers/appImManager";
import { cancelEvent } from "../../lib/utils";
import DivAndCaption from "../divAndCaption";

const CLASSNAME_SHOWN_MAIN = 'is-pinned-message-shown';
const CLASSNAME_BASE = 'pinned-container';
const HEIGHT = 52;

export default class PinnedContainer {
  private close: HTMLElement;

  constructor(protected className: string, public divAndCaption: DivAndCaption<(title: string, subtitle: string, message?: any) => void>, onClose?: () => void | Promise<boolean>) {
    /* const prev = this.divAndCaption.fill;
    this.divAndCaption.fill = (mid, title, subtitle) => {
      this.divAndCaption.container.dataset.mid = '' + mid;
      prev(mid, title, subtitle);
    }; */

    divAndCaption.container.classList.add(CLASSNAME_BASE, 'hide');
    divAndCaption.title.classList.add(CLASSNAME_BASE + '-title');
    divAndCaption.subtitle.classList.add(CLASSNAME_BASE + '-subtitle');

    this.close = document.createElement('button');
    this.close.classList.add(CLASSNAME_BASE + '-close', `pinned-${className}-close`, 'btn-icon', 'tgico-close');

    divAndCaption.container.append(this.close);

    this.close.addEventListener('click', (e) => {
      cancelEvent(e);

      ((onClose ? onClose() : null) || Promise.resolve(true)).then(needClose => {
        if(needClose) {
          this.toggle(true);
        }
      });
    });
  }

  public toggle(hide?: boolean) {
    const isHidden = this.divAndCaption.container.classList.contains('hide');
    if(hide === undefined) {
      hide = !isHidden;
    } else if(hide == isHidden) {
      return;
    }

    const scrollTop = mediaSizes.isMobile ? appImManager.scrollable.scrollTop : undefined;
    this.divAndCaption.container.classList.toggle('hide', hide);
    appImManager.topbar.classList.toggle(`is-pinned-${this.className}-shown`, !hide);

    if(scrollTop !== undefined && !appImManager.topbar.classList.contains(CLASSNAME_SHOWN_MAIN)) {
      appImManager.scrollable.scrollTop = scrollTop + ((hide ? -1 : 1) * HEIGHT);
    }
  }

  public fill(title: string, subtitle: string, message: any) {
    this.divAndCaption.container.dataset.mid = '' + message.mid;
    this.divAndCaption.fill(title, subtitle, message);
  }
}