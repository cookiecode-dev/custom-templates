export default function (element: HTMLDialogElement) {
  if (window.HTMLDialogElement || element.showModal) return;

  const showFunc = function () {
    element.setAttribute('open', '');
  };
  const hideFunc = function () {
    element.removeAttribute('open');
  };
  
  const id = '_dialog_element_' + (Math.random().toString(36) + '00000000000000000').slice(2, 10);

  element.id = id;
  element.showModal = showFunc;
  element.show = showFunc;
  element.close = hideFunc;
  element.returnValue = '';

  Object.defineProperty(element, 'open', {
    get: function () {
      return this.hasAttribute('open');
    },
  });

  let css = `
  #${id}:not([open]) { display: none !important; }
  #${id}[open] { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2147483647; }
  `;

  const style = document.createElement('style');
  style.innerHTML = css;
  element.after(style);
}
