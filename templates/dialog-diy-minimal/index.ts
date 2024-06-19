import TemplateString from './template.html';
import { ServiceType, getServicesGrouped } from '../shared/services';

import polyfillDialog from '../shared/polyfillDialog';

type ElementContext = { [contextSymbol]?: any }
type HTMLElementWithContext = HTMLElement & ElementContext;

const contextSymbol = Symbol();

const rootWrapper = document.createElement('template');
rootWrapper.innerHTML = TemplateString;
const root = rootWrapper.content;

const getContext = function (element: HTMLElementWithContext) {
  const collected = [];

  let current = element;
  while (current) {
    if (current[contextSymbol]) collected.unshift(current[contextSymbol]);
    current = current.parentNode as HTMLElementWithContext;
  }

  return Object.assign({}, ...collected);
};

const setContext = function (element: HTMLElementWithContext, context: any) {
  element[contextSymbol] = context;
};

const accessProperty = function (context: any, propertyName: string) {
  const propertyKey = propertyName.split('.');
  const propertyValue = propertyKey.reduce((prev, curr) => prev?.[curr], context);
  return propertyValue;
};

// Parse tpl:text="key"
const parseText = function (element: HTMLElement) {
  const context = getContext(element);

  const rawValue = element.getAttribute('tpl:text');
  const values = rawValue.split(',').map(propertyName => accessProperty(context, propertyName));

  element.innerText = values.join(' ');
  element.removeAttribute('tpl:text');
};

// Parse tpl:attr="name=key1,id=key2"
const parseAttribute = function (element: HTMLElement) {
  const context = getContext(element);

  const rawValue = element.getAttribute('tpl:attr');
  rawValue.split(',').forEach(x => {
    let [key, value] = x.split('=', 2);
    element.setAttribute(key, accessProperty(context, value));
  });

  element.removeAttribute('tpl:attr');
};

// Parse tpl:foreach="key as value"
const parseForEach = function (element: HTMLElement) {
  const context = getContext(element);

  const [arrayPropertyKey, newContextKey] = element.getAttribute('tpl:foreach').split(' as ');
  const array = accessProperty(context, arrayPropertyKey) as any[];
  if (!array) {
    element.replaceWith(document.createComment('Invalid tpl:foreach'));
    return;
  }

  const resultElements = array.map(subContext => {
    const clone = element.cloneNode(true) as HTMLElementWithContext;
    clone.removeAttribute('tpl:foreach');
    clone[contextSymbol] = { [newContextKey]: subContext };
    return clone;
  });

  element.replaceWith(...resultElements);
};

const parseElement = function (element: HTMLElement) {
  if (element.hasAttribute('tpl:foreach')) {
    parseForEach(element);
    return; // The template element is removed
  }

  if (element.hasAttribute('tpl:text')) {
    parseText(element);
  }

  if (element.hasAttribute('tpl:attr')) {
    parseAttribute(element);
  }
};

const processChildren = function (parent: HTMLElement | DocumentFragment) {
  const children = parent.children;
  const processed: Element[] = [];

  const next = () => Array.from(children).find(x => !processed.includes(x)) as HTMLElement | undefined;

  let element: HTMLElement;
  while ((element = next()) != undefined) {
    processed.push(element);
    parseElement(element);

    // Stop processing if element is removed
    if (element.parentNode) processChildren(element);
  }
};

const rootElement = root.firstElementChild as HTMLDialogElement & ElementContext;
polyfillDialog(rootElement);

const translation = window.CookieCode.getTranslation();
const serviceGroups = getServicesGrouped();

let introKey = 'UseFunctional';
if (serviceGroups.some(x => x.id === ServiceType.Analytical || x.id === ServiceType.AnalyticalAnonymous)) introKey += 'Analytical';
if (serviceGroups.some(x => x.id === ServiceType.Tracking)) introKey += 'Tracking';

setContext(rootElement, {
  translation,
  intro: translation[introKey],
  reseller: window.CookieCode.getInfo().reseller,
  serviceGroups: serviceGroups,
});

processChildren(rootElement);
// End of template processing here

// Group checkboxes
Array.from(rootElement.querySelectorAll<HTMLInputElement>('.action-consent-service-group')).forEach(groupInput => {
  const consentRequired = serviceGroups.find(x => x.id === groupInput.name).services.every(x => x.consentRequired);
  const serviceInputs = Array.from(
    groupInput.closest('.service-group').querySelectorAll<HTMLInputElement>('.action-consent-service')
  );

  if (!consentRequired) {
    groupInput.disabled = true;
    serviceInputs.forEach(serviceInput => serviceInput.disabled = true);

  } else {
    serviceInputs.forEach(serviceInput =>
      serviceInput.addEventListener('change', () => {
        groupInput.checked = serviceInputs.every(x => x.checked);
      })
    );

    groupInput.addEventListener('change', () => {
      serviceInputs.forEach(x => (x.checked = groupInput.checked));
    });
  }
});

// Buttons
rootElement.querySelector('button[value="save"]').addEventListener('click', function () {
  const consentStatus = { ...window.CookieCode.getState().consent };
  Array.from(rootElement.querySelectorAll<HTMLInputElement>('.action-consent-service')).forEach(input => {
    if (input.name in consentStatus) {
      consentStatus[input.name] = input.checked;
    }
  });

  window.CookieCode.consent(consentStatus);
  window.CookieCode.hideBanner();
  
  rootElement.close();
});

rootElement.querySelector('button[value="close"]').addEventListener('click', function () {
  rootElement.close();
});

document.currentScript.parentNode.prepend(rootElement);

// const parent = document.currentScript.parentNode;
// const isInShadowRoot = parent instanceof ShadowRoot;

// parent.prepend(...Array.from(root.children));
// parent.firstElementChild.showModal();
