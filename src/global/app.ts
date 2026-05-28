import '@material/web/list/list'
import '@material/web/list/list-item'
import '@material/web/icon/icon'
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/icon/icon.js';
import '@material/web/divider/divider.js';
import '@material/web/button/filled-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import '@material/web/button/text-button.js';
import '@material/web/tabs/tabs.js';
import '@material/web/tabs/primary-tab.js';
import { registerNavigationApi } from './navigation.js'

export default function() { // or export default async function()
  // package initialization code
  registerNavigationApi()
}