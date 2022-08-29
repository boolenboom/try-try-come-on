import { defineCustomElement } from "vue";
import AccountForm from '@/elements/AccountForm.ce.vue';

window.customElements.define('account-form',defineCustomElement(AccountForm));