import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

import './TextTrail.css';

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = (e as MouseEvent).clientX;
    clientY = (e as MouseEvent).clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class TextItem {
  DOM = { el: null as HTMLDivElement | null, inner: null as HTMLSpanElement | null };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect: DOMRect | null = null;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__text-inner') as HTMLSpanElement;
    this.getRect();
    this.initEvents();
  }
  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }
  resize: (() => void) | null = null;
  getRect() {
    this.rect = this.DOM.el!.getBoundingClientRect();
  }
  setText(text: string) {
    if (this.DOM.inner) {
      this.DOM.inner.textContent = text;
    }
    this.getRect();
  }
}

class TextTrailVariant1 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...this.DOM.el.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };

      this.rafId = requestAnimationFrame(() => this.render());

      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());

    gsap.killTweensOf(text.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'power3',
          opacity: 0,
          scale: 0.2
        },
        0.4
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) {
      this.isIdle = true;
    }
  }
}

class TextTrailVariant2 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };

      this.rafId = requestAnimationFrame(() => this.render());

      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());

    gsap.killTweensOf(text.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      )
      .fromTo(
        text.DOM.inner,
        {
          scale: 2.8,
          filter: 'brightness(250%)'
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          filter: 'brightness(100%)'
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'power2',
          opacity: 0,
          scale: 0.2
        },
        0.45
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) this.isIdle = true;
  }
}

class TextTrailVariant3 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };

      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());
    gsap.killTweensOf(text.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      )
      .fromTo(
        text.DOM.inner,
        {
          scale: 1.2
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.6,
          ease: 'power2',
          opacity: 0,
          scale: 0.2,
          xPercent: () => gsap.utils.random(-30, 30),
          yPercent: -200
        },
        0.6
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) this.isIdle = true;
  }
}

class TextTrailVariant4 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());
    gsap.killTweensOf(text.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      )
      .fromTo(
        text.DOM.inner,
        {
          scale: 2,
          filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max((400 * distance) / 100, 100)}%)`
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          filter: 'brightness(100%) contrast(100%)'
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'power3',
          opacity: 0
        },
        0.4
      )
      .to(
        text.DOM.el,
        {
          duration: 1.5,
          ease: 'power4',
          x: `+=${dx * 110}`,
          y: `+=${dy * 110}`
        },
        0.05
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) this.isIdle = true;
  }
}

class TextTrailVariant5 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };
  lastAngle = 0;

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    let startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 150;
    dy *= distance / 150;

    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());
    gsap.killTweensOf(text.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          filter: 'brightness(80%)',
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2,
          rotation: startAngle
        },
        {
          duration: 1,
          ease: 'power2',
          scale: 1,
          filter: 'brightness(100%)',
          x: this.mousePos.x - text.rect!.width / 2 + dx * 70,
          y: this.mousePos.y - text.rect!.height / 2 + dy * 70,
          rotation: this.lastAngle
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'expo',
          opacity: 0
        },
        0.5
      )
      .to(
        text.DOM.el,
        {
          duration: 1.5,
          ease: 'power4',
          x: `+=${dx * 120}`,
          y: `+=${dy * 120}`
        },
        0.05
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) this.isIdle = true;
  }
}

class TextTrailVariant6 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  mapSpeedToSize(speed: number, minSize: number, maxSize: number) {
    const maxSpeed = 200;
    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }
  mapSpeedToBrightness(speed: number, minB: number, maxB: number) {
    const maxSpeed = 70;
    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }
  mapSpeedToBlur(speed: number, minBlur: number, maxBlur: number) {
    const maxSpeed = 90;
    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }
  mapSpeedToGrayscale(speed: number, minG: number, maxG: number) {
    const maxSpeed = 90;
    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());

    const scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    const brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    const blurValue = this.mapSpeedToBlur(speed, 20, 0);
    const grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(text.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.8,
          ease: 'power3',
          scale: scaleFactor,
          filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      )
      .fromTo(
        text.DOM.inner,
        {
          scale: 2
        },
        {
          duration: 0.8,
          ease: 'power3',
          scale: 1
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'power3.in',
          opacity: 0,
          scale: 0.2
        },
        0.45
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) {
      this.isIdle = true;
    }
  }
}

function getNewPosition(position: number, offset: number, arr: TextItem[]) {
  const realOffset = Math.abs(offset) % arr.length;
  if (position - realOffset >= 0) {
    return position - realOffset;
  } else {
    return arr.length - (realOffset - position);
  }
}

class TextTrailVariant7 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  visibleTextsCount = 0;
  visibleTextsTotal = 9;

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;
    this.visibleTextsTotal = Math.min(this.visibleTextsTotal, this.textsTotal - 1);

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;

    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());
    ++this.visibleTextsCount;

    gsap.killTweensOf(text.DOM.el);
    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .fromTo(
        text.DOM.el,
        {
          scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0),
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2
        },
        {
          duration: 0.4,
          ease: 'power3',
          scale: scaleValue,
          rotationZ: gsap.utils.random(-3, 3),
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2
        },
        0
      );

    if (this.visibleTextsCount >= this.visibleTextsTotal) {
      const lastInQueue = getNewPosition(this.textPosition, this.visibleTextsTotal, this.texts);
      const oldText = this.texts[lastInQueue];
      gsap.to(oldText.DOM.el, {
        duration: 0.4,
        ease: 'power4',
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
          if (this.activeTextsCount === 0) {
            this.isIdle = true;
          }
        }
      });
    }
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
  }
}

class TextTrailVariant8 {
  container: HTMLDivElement;
  DOM: { el: HTMLDivElement };
  items: string[];
  texts: TextItem[];
  textsTotal: number;
  textPosition = 0;
  zIndexVal = 1;
  activeTextsCount = 0;
  isIdle = true;
  threshold = 80;

  mousePos = { x: 0, y: 0 };
  lastMousePos = { x: 0, y: 0 };
  cacheMousePos = { x: 0, y: 0 };

  rotation = { x: 0, y: 0 };
  cachedRotation = { x: 0, y: 0 };
  zValue = 0;
  cachedZValue = 0;

  rafId: number | null = null;

  constructor(container: HTMLDivElement, items: string[]) {
    this.container = container;
    this.DOM = { el: container };
    this.items = items;
    this.texts = [...container.querySelectorAll('.content__text')].map(
      (el) => new TextItem(el as HTMLDivElement)
    );
    this.textsTotal = this.texts.length;

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove, { passive: false });

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
    };
    container.addEventListener('mousemove', initRender);
    container.addEventListener('touchmove', initRender, { passive: false });

    this.cleanup = () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
      container.removeEventListener('mousemove', initRender);
      container.removeEventListener('touchmove', initRender);
      if (this.rafId) cancelAnimationFrame(this.rafId);
    };
  }

  cleanup: (() => void) | null = null;

  render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

    if (distance > this.threshold) {
      this.showNextText();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }

  randomName() {
    return this.items[Math.floor(Math.random() * this.items.length)];
  }

  showNextText() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 30;
    this.rotation.y = (relX / centerX) * 30;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = distanceFromCenter / maxDistance;
    this.zValue = proportion * 1200 - 600;
    this.cachedZValue = this.zValue;
    const normalizedZ = (this.zValue + 600) / 1200;
    const brightness = 0.2 + normalizedZ * 2.3;

    ++this.zIndexVal;
    this.textPosition = this.textPosition < this.textsTotal - 1 ? this.textPosition + 1 : 0;
    const text = this.texts[this.textPosition];
    text.setText(this.randomName());
    gsap.killTweensOf(text.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onTextActivated(),
        onComplete: () => this.onTextDeactivated()
      })
      .set(this.DOM.el, { perspective: 1000 }, 0)
      .fromTo(
        text.DOM.el,
        {
          opacity: 1,
          z: 0,
          scale: 1 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - text.rect!.width / 2,
          y: this.cacheMousePos.y - text.rect!.height / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`
        },
        {
          duration: 1,
          ease: 'expo',
          scale: 1 + this.zValue / 1000,
          x: this.mousePos.x - text.rect!.width / 2,
          y: this.mousePos.y - text.rect!.height / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y
        },
        0
      )
      .to(
        text.DOM.el,
        {
          duration: 0.4,
          ease: 'power2',
          opacity: 0,
          z: -800
        },
        0.3
      );
  }

  onTextActivated() {
    this.activeTextsCount++;
    this.isIdle = false;
  }
  onTextDeactivated() {
    this.activeTextsCount--;
    if (this.activeTextsCount === 0) this.isIdle = true;
  }
}

const variantMap = {
  1: TextTrailVariant1,
  2: TextTrailVariant2,
  3: TextTrailVariant3,
  4: TextTrailVariant4,
  5: TextTrailVariant5,
  6: TextTrailVariant6,
  7: TextTrailVariant7,
  8: TextTrailVariant8
};

interface TextTrailProps {
  items: string[];
  variant?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

export default function TextTrail({ items = [], variant = 1 }: TextTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<TextTrailVariant1 | TextTrailVariant2 | TextTrailVariant3 | TextTrailVariant4 | TextTrailVariant5 | TextTrailVariant6 | TextTrailVariant7 | TextTrailVariant8 | null>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;

    const Cls = variantMap[variant] || variantMap[1];
    instanceRef.current = new Cls(containerRef.current, items);

    return () => {
      if (instanceRef.current && 'cleanup' in instanceRef.current && instanceRef.current.cleanup) {
        instanceRef.current.cleanup();
      }
      instanceRef.current = null;
    };
  }, [variant, items]);

  const poolSize = 24;

  return (
    <div className="content" ref={containerRef}>
      {Array.from({ length: poolSize }).map((_, i) => (
        <div className="content__text" key={i}>
          <span className="content__text-inner" />
        </div>
      ))}
    </div>
  );
}
