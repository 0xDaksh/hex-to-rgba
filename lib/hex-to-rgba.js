'use babel';

import HexToRgbaView from './hex-to-rgba-view';
import { CompositeDisposable } from 'atom';
const hexToRgba = require('hex-rgba');

export default {

  hexToRgbaView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.hexToRgbaView = new HexToRgbaView(state.hexToRgbaViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.hexToRgbaView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'hex-to-rgba:toggle': () => this.toggle(),
      'hex-to-rgba:convert': () => this.convert()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.hexToRgbaView.destroy();
  },

  serialize() {
    return {
      hexToRgbaViewState: this.hexToRgbaView.serialize()
    };
  },
  toggle() {
    return(
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    )
  },
  convert() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      let selection = editor.getSelectedText()
      selection = hexToRgba(selection, 100)
      editor.insertText(selection)
    }
  }
};
