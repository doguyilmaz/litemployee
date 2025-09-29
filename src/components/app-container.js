import {LitElement, html, css} from 'lit';
import {Router} from '@vaadin/router';

export class AppContainer extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  firstUpdated() {
    const router = new Router(this.shadowRoot.querySelector('#content'));
    router.setRoutes([
      {
        path: '/',
        component: 'employee-list',
        action: async () => {
          await import('./employee-list.js');
        },
      },
      {
        path: '/add',
        component: 'employee-form',
        action: async () => {
          await import('./employee-form.js');
        },
      },
      {
        path: '/edit/:id',
        component: 'employee-form',
        action: async () => {
          await import('./employee-form.js');
        },
      },
    ]);
  }

  render() {
    return html`
      <nav-menu></nav-menu>
      <div id="content"></div>
    `;
  }
}

customElements.define('app-container', AppContainer);
