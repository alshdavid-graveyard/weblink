export type DOMEventMap = Record<string, (e: Event) => void>;
export type CSSProperties = Record<string, any>;

export interface ElementOptions<T extends keyof HTMLElementTagNameMap = 'div'> {
    cssText?: string;
    styles?: CSSProperties;
    src?: string;
    className?: string;
    id?: string;
    innerHTML?: string;
    innerText?: string;
    events?: DOMEventMap;
    ref?: (el: HTMLElementTagNameMap[T]) => any | Promise<any>
}

export const create = <T extends keyof HTMLElementTagNameMap = 'div'>(
  tag: T,
  options: ElementOptions<T> = {},
  ...children: Array<HTMLElement | string>
) => {
    const element = document
      .createElement(
        tag || 'div',
      ) as HTMLElementTagNameMap[T];

    if (options.ref) {
      options.ref(element)
    }

    if (options.id) {
        element.id = options.id;
    }

    if (options.src) {
      (element as any).src = options.src;
    }

    if (options.className) {
        element.classList.value = options.className;
    }

    if (options.cssText) {
        element.style.cssText = options.cssText;
    }

    if (options.styles) {
        setStyles(element, options.styles);
    }

    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    if (options.innerText) {
        element.innerText = options.innerText;
    }

    if (options.events) {
        setEvents(element, options.events);
    }

    for (const child of children) {
      if (typeof child === 'string') {
        element.innerHTML = child
      } else {
        element.appendChild(child);
      }
    }

    return element;
};

export const setStyles = (element: HTMLElement, styles: CSSProperties) => {
  for (const [ style, value ] of Object.entries(styles)) {
    element.style[style as any] = value;
  }
};

export const setEvents = (element: HTMLElement, events: DOMEventMap) => {
  for (const [name, value] of Object.entries(events)) {
    (element as any)[name] = value;
  }
};
